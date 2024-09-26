import React, { useState, useEffect, useCallback } from 'react';
import './reset-password.scss';

import { Redirect, useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import UserApi from 'src/apis/viviboom/UserApi';
import CenterDiv from '../../../common/center-div/center-div';
import PasswordInput from '../../../common/password-input/password-input';
import Button from '../../../common/button/button';

// Mostly the same as verify-email - separate to keep me sane
function ResetPassword() {
  const params = useParams();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [token] = useState(params.token);
  const { t } = useTranslation();

  const handleRequestEmailSubmit = async (e) => {
    e.preventDefault();
    if (email === '') {
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setEmailSent(false);
    try {
      await UserApi.passwordResetToken({ email });
      setEmailSent(true);
      toast(t('email.tokenSent'));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword === '') {
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await UserApi.passwordReset({ token, password: newPassword });
      history.push('/welcome');
      toast(t('email.setPasswordSuccess'));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  if (token) {
    return (
      <CenterDiv>
        <div className="verify-email">
          <h1>{t('email.setNewPassword')}</h1>
          {(errorMessage !== '') ? (
            <ul className="errors">
              <li>{errorMessage}</li>
            </ul>
          ) : ''}
          <form onSubmit={handleSetNewPassword}>
            <label>{t('email.newPassword')}</label>
            <PasswordInput disabled={loading} value={newPassword} placeholder={t('email.newPassword')} onChange={(e) => { setNewPassword(e.target.value); }} />
            <Button disabled={loading} type="submit" status={(loading) ? 'loading' : ''} value={t('email.setPasswordButton')} />
          </form>
        </div>
      </CenterDiv>
    );
  }

  return (
    <div className="reset-password-page">
      <CenterDiv>
        <div>
          <h1>{t('email.resetPassword')}</h1>
          {(emailSent) ? (
            <ul className="success">
              <li>{t('email.sentResetPasswordLink')}</li>
            </ul>
          ) : ''}
          {(errorMessage !== '') ? (
            <ul className="errors">
              <li>{errorMessage}</li>
            </ul>
          ) : ''}
          <p>{t('email.resetPasswordText')}</p>
          <form onSubmit={handleRequestEmailSubmit}>
            <label>{t('email.email')}</label>
            <input disabled={loading} type="email" placeholder={t('email.email')} value={email} onChange={(e) => { setEmail(e.target.value); }} />
            <Button disabled={loading} type="submit" status={(loading) ? 'loading' : ''} value={t('email.sendResetPasswordLinkButton')} />
          </form>
          {/* <p>Please write in to <strong>hello@vivita.sg</strong> with your child's name, and we will assist you in resetting your child's VIVIBOOM account's password.</p> */}
        </div>
      </CenterDiv>
    </div>
  );
}

export default ResetPassword;
