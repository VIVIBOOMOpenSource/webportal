import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import './student-sign-up.scss';

import Button from 'src/components/common/button/button';
import FormInput from 'src/components/common/form-input/form-input';
import ViviboomLogo from 'src/css/imgs/viviboom-logo.png';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import PublicBranchApi from 'src/apis/viviboom/PublicBranchApi';

const welcomeVideoLink = 'https://www.youtube.com/embed/mSht4hQuypg';
const VALID_CODE_LENGTH = 6;
const usernameRegex = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,16}[a-zA-Z0-9]$/;

function StudentSignUp() {
  const { t } = useTranslation('translation', { keyPrefix: 'entry' });
  const history = useHistory();

  const [showPage, setShowPage] = useState('Code');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const branchCode = digits.join('');
  const isCodeValid = branchCode.length === VALID_CODE_LENGTH && /^[a-zA-Z0-9]+$/.test(branchCode);

  const [branch, setBranch] = useState();

  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // for institution code only
  const onDigitChange = (index) => (event) => {
    if (index > digits.length) return;
    const val = event.target.value;
    const newArr = [...digits];
    if (val.length > 1) {
      if (val.charAt(val.length - 1) !== digits[index]) {
        newArr[index] = val.charAt(val.length - 1);
      } else {
        newArr[index] = val.charAt(0);
      }
      // jump to next char
      if (index < digits.length - 1) {
        const nextInput = document.getElementById(`code-digit-${index + 1}`);
        nextInput.focus();
      }
    } else if (val.length === 1) {
      newArr[index] = val;
      // jump to next char
      if (index < digits.length - 1) {
        const nextInput = document.getElementById(`code-digit-${index + 1}`);
        nextInput.focus();
      }
    } else {
      newArr[index] = val;
    }
    setDigits(newArr);
  };

  const onKeyDown = (index) => (event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`code-digit-${index - 1}`);
      prevInput.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`code-digit-${index - 1}`);
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < digits.length - 1) {
      const nextInput = document.getElementById(`code-digit-${index + 1}`);
      nextInput.focus();
    }
  };

  const onContinue = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const branchResponse = await PublicBranchApi.getList({ code: branchCode });
      if (branchResponse.data?.branches?.length === 1) {
        setBranch(branchResponse.data?.branches[0]);
        setShowPage('Form');
      } else {
        setErrorMessage(t('invalidCode'));
      }
    } catch (err) {
      toast(err?.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    setErrorMessage('');

    if (!givenName) {
      setErrorMessage(t('required', { name: t('givenName') }));
      return;
    }
    if (!familyName) {
      setErrorMessage(t('required', { name: t('familyName') }));
      return;
    }
    if (!email) {
      setErrorMessage(t('required', { name: t('email') }));
      return;
    }
    if (!username) {
      setErrorMessage(t('required', { name: t('username') }));
      return;
    }
    if (!password) {
      setErrorMessage(t('required', { name: t('password') }));
      return;
    }
    if (!usernameRegex.test(username)) {
      setErrorMessage(t('invalidUsername'));
      return;
    }
    if (password?.length < 8) {
      setErrorMessage(t('invalidPassword'));
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await UserReduxActions.signUp(givenName, familyName, email, username, password, branchCode);
      setShowPage('Success');
      history.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message ?? err.message);
    }
    setLoading(false);
  };

  return (
    <div className="student-signup">
      {showPage === 'Code' && (
        <div className="student-signup-info">
          <img className="logo-image" alt="logo" src={ViviboomLogo} />
          <p className="student-signup-info-text">
            {t('codeDescription')}
          </p>
          <div className="digits">
            {digits.map((d, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <input key={`code-char-${idx}`} id={`code-digit-${idx}`} className="digit" value={d} onChange={onDigitChange(idx)} onKeyDown={onKeyDown(idx)} />
            ))}
          </div>
          {!!errorMessage && <p className="err-message">{errorMessage}</p>}
          <Button
            onClick={onContinue}
            parentClassName="next-button"
            disabled={loading || !isCodeValid}
            status={loading ? 'loading' : null}
          >
            {t('Continue')}
          </Button>
        </div>
      )}
      {showPage === 'Form' && !!branch && (
        <div className="student-signup-form">
          <img className="logo-image" alt="logo" src={ViviboomLogo} />
          <p className="student-signup-info-text">
            {t('signUpFor', { name: branch?.institution.name })}
          </p>
          {!!errorMessage && (
            <ul className="errors">
              <li>{errorMessage}</li>
            </ul>
          )}
          <form className="signup-form" onSubmit={onSubmit}>
            <div className="signup-name">
              <FormInput
                disabled={loading}
                type="text"
                defaultValue={givenName}
                onChange={(e) => {
                  setGivenName(e.target.value);
                }}
                label={t('givenName')}
                required
              />
              <FormInput
                disabled={loading}
                type="text"
                defaultValue={familyName}
                onChange={(e) => {
                  setFamilyName(e.target.value);
                }}
                label={t('familyName')}
                required
              />
            </div>
            <FormInput
              disabled={loading}
              type="email"
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label={t('email')}
              required
            />
            <FormInput
              disabled={loading}
              type="text"
              defaultValue={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label={t('username')}
              required
              minLength={5}
              pattern="^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,16}[a-zA-Z0-9]$"
              title="Username must be made of 5-18 alphanumeric characters"
            />
            <FormInput
              disabled={loading}
              type="password"
              defaultValue={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label={t('password')}
              required
              minLength={8}
            />
            <Button
              parentClassName="next-button"
              disabled={loading}
              type="submit"
              status={loading ? 'loading' : null}
              value={t('createAccount')}
            />
          </form>
          <a className="sign-in" href="/welcome">
            {t('haveAccount')}
          </a>
        </div>
      )}
      {showPage === 'Success' && (
        <div className="success-page">
          <img className="logo-image" alt="logo" src={ViviboomLogo} />
          <p className="success-note">
            Thank you for signing up VIVIBOOM!
          </p>
          <div className="welcome-video">
            <iframe
              src={`${welcomeVideoLink}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSignUp;
