import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './welcome.scss';

import { ReactComponent as LanguageSvg } from 'src/css/imgs/icon-language.svg';
import NaviLanguageModal from 'src/components/navi/navi-language-modal';
import SignIn from '../entry/sign/sign-in';
import { app } from '../../../js/utils/app';

import ViviboomLogo from '../../../css/imgs/viviboom-logo-dark.png';

function Welcome() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const [page, setPage] = useState(1);
  const [showLanguages, setShowLanguages] = useState(false);

  useEffect(() => {
    app.plugins.createTab({
      triggers: '.login-register-form-trigger',
      elements: '.login-register-form-element',
      animation: {
        type: 'slide-in-right',
      },
    });
  }, []);

  return (
    <div className="welcome">
      <div className="welcome-background" />
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
      <div className="welcome-language" onClick={() => setShowLanguages(true)}>
        <span className="icon">
          <LanguageSvg />
        </span>
        <span className="text">{t('language')}</span>
      </div>
      <div className="welcome-content">
        <div className="welcome-info">
          <h2 className="welcome-info-pretitle">{t('WELCOME TO')}</h2>
          <img className="logo-image" alt="logo" src={ViviboomLogo} />
          <div className="tab-switch">
            <p
              className={
                `tab-switch-button login-register-form-trigger${
                  page === 1 ? ' active' : ''}`
              }
            >
              {t('Login')}
            </p>
            <p
              className={
                `tab-switch-button login-register-form-trigger${
                  page === 2 ? ' active' : ''}`
              }
            >
              {t('Sign Up')}
            </p>
          </div>
        </div>
        <div className="landing-form">
          <div
            className={
              `form-box login-register-form-element${
                page === 1 ? ' active' : ''}`
            }
          >
            <SignIn isNew={false} />
          </div>

          <div
            className={
              `form-box login-register-form-element${
                page === 2 ? ' active' : ''}`
            }
          >
            <SignIn isNew />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
