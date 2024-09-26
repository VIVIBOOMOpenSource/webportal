import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import './institution-sign-up.scss';
import { useHistory } from 'react-router-dom';

import { ReactComponent as LanguageSvg } from 'src/css/imgs/icon-language.svg';
import NaviLanguageModal from 'src/components/navi/navi-language-modal';
import { toast } from 'react-toastify';
import PublicInstitutionApi from 'src/apis/viviboom/PublicInstitutionApi';
import PublicBranchApi from 'src/apis/viviboom/PublicBranchApi';
import FormInput from 'src/components/common/form-input/form-input';
import Button from 'src/components/common/button/button';
import { ReactComponent as Back } from 'src/css/imgs/icon-arrow-back.svg';

import ViviboomLogo from 'src/css/imgs/viviboom-logo-dark.png';
import ViviboomLogoBlack from 'src/css/imgs/viviboom-logo.png';
import { iso1A2Code } from 'country-coder';
import * as ct from 'countries-and-timezones';

const { getCode, getName, getNames } = require('country-list');

const usernameRegex = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){3,16}[a-zA-Z0-9]$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const welcomeVideoLink = 'https://www.youtube.com/embed/mSht4hQuypg';

function InstitutionSignUp() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const history = useHistory();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCountry, setInstitutionCountry] = useState('Singapore');
  const [institutionCountryISO, setInstitutionCountryISO] = useState('SG');
  const [countryTimezone, setCountryTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [initialBranchName, setInitialBranchName] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [countryTimezones, setCountryTimeZones] = useState(ct.getAllTimezones());
  const [countries, setCountries] = useState(getNames().sort());

  const code = useMemo(() => digits.join(''), [digits]);

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

  const submitForm = useCallback(async () => {
    setLoading(true);
    if (!institutionCountryISO) {
      toast.error(t('Invalid country ISO code'));
      return;
    }

    const requestParams = {
      name: institutionName,
      code: code?.length > 0 ? code : undefined,
      countryISO: institutionCountryISO,
      tzIANA: countryTimezone,
      initialBranchName,
      username,
      newPassword: password,
      guardianEmail: email,
      givenName,
      familyName,
    };
    try {
      await PublicInstitutionApi.post(requestParams);
      setPage(4);
    } catch (err) {
      toast.error(err.response.data.message || err.message);
    }
    setLoading(false);
  }, [code, countryTimezone, email, familyName, givenName, initialBranchName, institutionCountryISO, institutionName, password, t, username]);

  const checkBranchCodeValid = useCallback(async () => {
    try {
      const codeResult = await PublicBranchApi.getList({ code, limit: 1 });
      if (codeResult.data.branches && codeResult.data.branches.length > 0) return false;
    } catch (err) {
      toast(err?.response?.data?.message || err.message);
      return false;
    }
    return true;
  }, [code]);

  const changePage = async () => {
    setErrorMessage('');
    if (page === 1) {
      // institution name
      if (!institutionName) {
        setErrorMessage(t('required', { name: t('name of institution') }));
        return;
      }
      if (institutionName.length < 3) {
        setErrorMessage(t('Institution name need to be at least 3 characters long'));
        return;
      }
      // branch name
      if (!initialBranchName) {
        setErrorMessage(t('required', { name: t('branch name') }));
        return;
      }
      // branch code
      if (code?.length > 0 && code?.length < 6) {
        setErrorMessage(t('Sign up code needs to be 6 characters long'));
        return;
      }

      if (code?.length > 0 && !(await checkBranchCodeValid())) {
        setErrorMessage(t('The sign-up code is already taken'));
        return;
      }

      // successful
      setPage(2);
    } else if (page === 2) {
      // given name
      if (!givenName) {
        setErrorMessage(t('required', { name: t('givenName') }));
        return;
      }
      // family name
      if (!familyName) {
        setErrorMessage(t('required', { name: t('familyName') }));
        return;
      }
      // email
      if (!email) {
        setErrorMessage(t('required', { name: t('email') }));
        return;
      }
      if (!emailRegex.test(email)) {
        setErrorMessage(t('Invalid email'));
        return;
      }

      // successful
      setPage(3);
    } else if (page === 3) {
      // username
      if (!username) {
        setErrorMessage(t('required', { name: t('username') }));
        return;
      }
      // username
      if (username?.length < 5 || username?.length > 18) {
        setErrorMessage(t('usernameLength'));
        return;
      }
      if (!usernameRegex.test(username)) {
        setErrorMessage(t('invalidUsername'));
        return;
      }
      // password
      if (!password) {
        setErrorMessage(t('required', { name: t('password') }));
        return;
      }
      if (password?.length < 8) {
        setErrorMessage(t('Password need to be at least 8 character long'));
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(t('Passwords need to be the same'));
        return;
      }

      // successful
      submitForm();
    }
  };

  const handleBack = () => {
    history.push('/welcome');
  };

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(position) {
      const coordinates = position.coords;
      const countryISO = iso1A2Code([coordinates.longitude, coordinates.latitude]);
      setInstitutionCountryISO(countryISO);
      setInstitutionCountry(getName(countryISO));
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  return (
    <div className="welcome-institution-signup">
      <div className="welcome-background" />
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
      <div className="welcome-language" onClick={() => setShowLanguages(true)}>
        <span className="icon">
          <LanguageSvg />
        </span>
        <span className="text">{t('language')}</span>
      </div>
      <div className="login-back-button" onClick={handleBack}>
        <Back />
        <p className="back-text">{t('login')}</p>
      </div>
      <div className="welcome-content">
        <div className="welcome-info">
          <h2 className="welcome-info-pretitle">{t('WELCOME TO')}</h2>
          <img className="logo-image" alt="logo" src={ViviboomLogo} />
        </div>
        {page < 4 ? (
          <div className="landing-form">
            <div className="form-box">
              <div className="page-tracker-section">
                <div className="page-section">
                  <div className="page-dot active" onClick={() => setPage(1)}>1</div>
                  <div className="page-text active">{t('Institution Details')}</div>
                </div>
                <hr className={`page-one-to-two-line${page >= 2 ? ' active' : ''}`} />
                <div className="page-section">
                  <div className={`page-dot${page >= 2 ? ' active' : ''}`} onClick={() => { if (page >= 2) setPage(2); }}>2</div>
                  <div className={`page-text${page >= 2 ? ' active' : ''}`}>{t('Personal Details')}</div>
                </div>
                <hr className={`page-two-to-three-line${page >= 3 ? ' active' : ''}`} />
                <div className="page-section">
                  <div className={`page-dot${page >= 3 ? ' active' : ''}`}>3</div>
                  <div className={`page-text${page >= 3 ? ' active' : ''}`}>{t('Set Up Account')}</div>
                </div>
              </div>
              {page === 1 && (
              <>
                <div className="section-title">{t('Institution Details')}</div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Institution Name')}</div>
                  </div>
                  <FormInput
                    required
                    className="institution-name-input"
                    type="text"
                    value={institutionName}
                    minLength={3}
                    onChange={(e) => {
                      setInstitutionName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Branch Name')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="text"
                    value={initialBranchName}
                    onChange={(e) => {
                      setInitialBranchName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Sign Up Code (optional)')}</div>
                    <div className="input-subtitle">{t('signUpCodeDescription')}</div>
                  </div>
                  <div className="digits">
                    {digits.map((d, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                      <input key={`code-char-${idx}`} id={`code-digit-${idx}`} className="digit" value={d} onChange={onDigitChange(idx)} onKeyDown={onKeyDown(idx)} />
                    ))}
                  </div>
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Institution Country')}</div>
                  </div>
                  <select className="timezone-input" value={institutionCountry} onChange={(e) => { setInstitutionCountry(e.target.value); setInstitutionCountryISO(getCode(e.target.value)); }}>
                    {countries.map((v) => (
                      <option
                        key={v}
                        className="timezone-item"
                        value={v}
                      >
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('IANA Timezone (Continent/Region)')}</div>
                  </div>
                  <select className="timezone-input" defaultValue={countryTimezone} onChange={(e) => setCountryTimezone(e.target.value)}>
                    {Object.keys(countryTimezones).map((v) => (
                      <option
                        key={v}
                        className="timezone-item"
                        value={v}
                      >
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="error-message-text">{errorMessage}</div>
                <Button
                  disabled={loading}
                  type="submit"
                  status={loading ? 'loading' : null}
                  onClick={() => changePage()}
                  value={t('Next')}
                />
              </>
              )}

              {page === 2 && (
              <>
                <div className="back-button" onClick={() => setPage(1)}>
                  <Back />
                </div>
                <div className="section-title">{t('Personal Details')}</div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Given Name')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="text"
                    defaultValue={givenName}
                    onChange={(e) => {
                      setGivenName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Family Name')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="text"
                    defaultValue={familyName}
                    onChange={(e) => {
                      setFamilyName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Email')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="email"
                    defaultValue={email}
                    pattern={emailRegex}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div className="error-message-text">{errorMessage}</div>
                <Button
                  disabled={loading}
                  type="submit"
                  status={loading ? 'loading' : null}
                  onClick={() => changePage()}
                  value={t('Next')}
                />
              </>
              )}

              {page === 3 && (
              <>
                <div className="back-button" onClick={() => setPage(2)}>
                  <Back />
                </div>
                <div className="section-title">{t('Set Up Account')}</div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Username')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="text"
                    value={username}
                    minLength={5}
                    pattern={usernameRegex}
                    title="Username must be made of 5-18 alphanumeric characters"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Password')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="password"
                    defaultValue={password}
                    minLength={8}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-input-section">
                  <div className="form-input-text">
                    <div className="input-title">{t('Confirm Password')}</div>
                  </div>
                  <FormInput
                    required
                    disabled={loading}
                    type="password"
                    defaultValue={confirmPassword}
                    minLength={8}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="error-message-text">{errorMessage}</div>
                <Button
                  disabled={loading}
                  type="submit"
                  status={loading ? 'loading' : null}
                  onClick={changePage}
                  value={t('All Done!')}
                />
              </>
              )}
            </div>
          </div>
        ) : (
          <div className="success-container">
            <div className="success-box">
              <div>
                <img className="logo-image" alt="logo" src={ViviboomLogoBlack} />
                <p className="success-note">
                  {t('Thank you for signing up!')}
                </p>
                <p className="success-note">
                  {t("Please open the email we've sent you and confirm our email address to start using VIVIBOOM.")}
                </p>
                <p className="success-note">
                  {t("Don't forget our email may be hiding in your spam folder!")}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstitutionSignUp;
