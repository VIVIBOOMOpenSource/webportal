import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import UserApi from 'src/apis/viviboom/UserApi';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import Button from '../../common/button/button';
import Modal from '../../common/modal/modal';
import FormInput from '../../common/form-input/form-input';

import './profile-details.scss';

function ProfileDetails({ description, setDescription }) {
  const user = useSelector((state) => state?.user);

  const { t } = useTranslation();

  const changeInfoTypes = {
    username: { display: 'Username' },
    email: { display: 'Email' },
    emailTwo: { display: 'Secondary Email' },
    password: { display: 'Password' },
  };

  const [lastOpenType, setLastOpenType] = useState(changeInfoTypes.username.display);

  const changeInfoInputRef = useRef(null);
  const changeInfoPasswordInputRef = useRef(null);

  const [changeInfoValue, setChangeInfoValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [edittingUsername, setEdittingUsername] = useState(false);
  const [edittingEmail, setEdittingEmail] = useState(false);
  const [edittingEmailTwo, setEdittingEmailTwo] = useState(false);
  const [edittingPassword, setEdittingPassword] = useState(false);
  const [changeInfoLoading, setChangeInfoLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [changeInfoButtonStatus, setChangeInfoButtonStatus] = useState('save');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setShowModal((edittingUsername || edittingEmail || edittingEmailTwo || edittingPassword));
  }, [edittingUsername, edittingEmail, edittingEmailTwo, edittingPassword]);

  useEffect(() => {
    setChangeInfoButtonStatus((changeInfoLoading) ? 'loading' : 'save');
  }, [changeInfoLoading]);

  const handleModalClose = () => {
    setErrorMessage('');
    setChangeInfoLoading(false);
    setChangeInfoValue('');
    setConfirmPassword('');
    setEdittingUsername(false);
    setEdittingEmail(false);
    setEdittingEmailTwo(false);
    setEdittingPassword(false);
    setShowModal(false);
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (changeInfoValue === '') return false;
    if (confirmPassword === '' && user.passSet) return false;

    const { authToken, id: userId } = user;
    const data = { authToken, userId, curPassword: confirmPassword };

    if (edittingUsername) {
      data.username = changeInfoValue;
    } else if (edittingEmail) {
      data.guardianEmail = changeInfoValue;
    } else if (edittingEmailTwo) {
      data.guardianEmailTwo = changeInfoValue;
    } else if (edittingPassword) {
      data.newPassword = changeInfoValue;
    }

    setErrorMessage('');
    try {
      await UserApi.patch(data);

      let message = t('myAccount.success');
      if (edittingUsername) {
        message = t('myAccount.successUsername');
      }
      if (edittingPassword) {
        message = t('myAccount.successPassword');
      }
      if (edittingEmail) {
        message = t('myAccount.successEmail', { email: data.guardianEmail });
      }
      if (edittingEmailTwo) {
        message = t('myAccount.successEmailTwo');
      }
      toast.success(message);
      handleModalClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

    await UserReduxActions.fetch();
    return setChangeInfoLoading(false);
  };

  return (
    <div className="more-profile-details">
      <div className="dimmed-background" />
      <p>{t('myAccount.aboutMe')}</p>
      <FormInput
        className="profile-description"
        onChange={(e) => setDescription(e.target.value)}
        value={(description?.length >= 0 ? description : user?.description) ?? ''}
        type="text"
        disabled={false}
      />
      <p>{t('myAccount.email')}</p>
      <div className="email-editor-container">
        <input className="email-detail" type="text" disabled value={user.guardianEmail} />
        <Button
          parentClassName="edit-button-container"
          status="edit"
          onClick={() => {
            setEdittingEmail(true);
            setLastOpenType(changeInfoTypes.email.display);
          }}
        />
      </div>
      {user?.branch?.countryISO === 'EE' && (
        <>
          <p>{t('myAccount.secondaryEmail')}</p>
          <div className="email-editor-container">
            <input className="email-detail" type="text" disabled value={user.guardianEmailTwo} />
            <Button
              parentClassName="edit-button-container"
              status="edit"
              onClick={() => {
                setEdittingEmailTwo(true);
                setLastOpenType(changeInfoTypes.emailTwo.display);
              }}
            />
          </div>
        </>
      )}
      <p>{t('myAccount.password')}</p>
      <div className="password-editor-container">
        <input className="password-detail" type="text" disabled value="••••••••" />
        <Button
          parentClassName="edit-button-container"
          status="edit"
          onClick={() => {
            setEdittingPassword(true);
            setLastOpenType(changeInfoTypes.password.display);
          }}
        />
      </div>

      <Modal className="change-info-modal" show={showModal} handleClose={handleModalClose}>
        <div className="change-info">
          <form onSubmit={formHandler}>
            <h3>{(!user.passSet && lastOpenType === changeInfoTypes.password.display) ? t(`myAccount.setNew${lastOpenType}`) : t(`myAccount.change${lastOpenType}`)}</h3>
            {(errorMessage !== '')
              ? (
                <ul className="errors">
                  <li>{errorMessage}</li>
                </ul>
              )
              : ''}

            {(lastOpenType !== changeInfoTypes.password.display)
              ? (
                <div>
                  <FormInput
                    type={(edittingEmail) ? 'email' : 'text'}
                    label={t(`myAccount.new${lastOpenType}`)}
                    disabled={changeInfoLoading}
                    passRef={changeInfoInputRef}
                    onChange={(e) => { setChangeInfoValue(e.target.value); }}
                    value={changeInfoValue}
                  />
                </div>
              )
              : ''}

            <div>
              <FormInput
                onChange={(e) => { setConfirmPassword(e.target.value); }}
                disabled={changeInfoLoading}
                value={confirmPassword}
                label={((lastOpenType === changeInfoTypes.password.display) ? t('myAccount.currentPassword') : t('myAccount.password'))}
                type="password"
                passRef={changeInfoPasswordInputRef}
              />
            </div>

            {(lastOpenType === changeInfoTypes.password.display)
              ? (
                <div>
                  <FormInput
                    disabled={changeInfoLoading}
                    onChange={(e) => { setChangeInfoValue(e.target.value); }}
                    label={t('myAccount.newPassword')}
                    type="password"
                    value={changeInfoValue}
                  />
                </div>
              )
              : ''}
            <Button type="submit" status={changeInfoButtonStatus} value={t(`myAccount.setNew${lastOpenType}`)} />
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileDetails;
