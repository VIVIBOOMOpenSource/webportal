import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'src/components/common/button/button';
import FormInput from 'src/components/common/form-input/form-input';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import Config from 'src/config';

import './sign-in.scss';

function SignIn({ isNew }) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookieConsent, setCookieConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!cookieConsent) {
      setErrorMessage(t('entry.consentNotification'));
      return;
    }
    setErrorMessage('');
    if (username !== '' && password !== '') {
      setLoading(true);
      setErrorMessage('');
      try {
        await UserReduxActions.login({ username, password });
      } catch (err) {
        toast.error(err.response?.data?.message ?? err.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.authToken) {
      history.push(location?.state?.redirectRoute || '/');
      setSuccessMessage(t('entry.logInSuccess'));
    }
  }, [t, history, location?.state?.redirectRoute, user?.authToken]);

  return (
    <div className="sign-in">
      <div className="login-form">
        {!isNew ? (
          <div>
            <h2 className="form-box-title">{t('welcome.Portal Login')}</h2>
            {successMessage !== '' ? (
              <ul className="success">
                <li>{successMessage}</li>
              </ul>
            ) : (
              ''
            )}
            {errorMessage !== '' ? (
              <ul className="errors">
                <li>{errorMessage}</li>
              </ul>
            ) : (
              ''
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-input">
                <FormInput
                  disabled={loading}
                  type="text"
                  defaultValue={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  label={t('entry.username')}
                />
              </div>
              <div className="form-input">
                <FormInput
                  disabled={loading}
                  type="password"
                  defaultValue={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  label={t('entry.password')}
                />
              </div>
              <div className="form-input cookie-consent">
                <span>
                  <input
                    name="cookieConsent"
                    type="checkbox"
                    checked={cookieConsent}
                    onChange={(e) => {
                      setCookieConsent(e.target.checked);
                    }}
                  />
                  {' '}
                  <Trans i18nKey="entry.consent">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    I consent to the <a className="underlined" href="https://www.privacypolicies.com/live/f674d17e-cfdf-40ec-9218-ec11549cc4a8">use of cookies</a>
                  </Trans>
                </span>
              </div>
              <Button
                disabled={loading}
                type="submit"
                status={loading ? 'loading' : null}
                value={t('entry.login')}
              />
            </form>
            <div className="links-container">
              <Link className="link" to="/reset-password">
                {t('entry.troubleLoggingIn')}
              </Link>
              <div className="app-download-text" onClick={() => window.open(`${Config.Common.MobileAppUrl}${location.pathname}`)}>{t('Come check out our mobile app!')}</div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="form-box-title">{t('welcome.New to Viviboom?')}</h2>
            <div className="new-section-container">
              <div className="new-section-desc">
                {' '}
                {t('entry.haveCode')}
                {' '}
              </div>
              <div className="new-section-button">
                <Button
                  type="submit"
                  value={t('entry.Go Here')}
                  onClick={() => history.push('/sign-up')}
                />
              </div>
            </div>
            {/* <div className="new-section-container">
              <div className="new-section-desc">
                {' '}
                {t('entry.signUpInstitution')}
                {' '}
              </div>
              <div className="new-section-button">
                <Button
                  type="submit"
                  value={t('entry.Sign Up For Free')}
                  onClick={() => history.push('/sign-up/institution')}
                />
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;
