import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import './welcome-sign-up.scss';

import { ReactComponent as Back } from 'src/css/imgs/icon-arrow-back.svg';
import { ReactComponent as LanguageSvg } from 'src/css/imgs/icon-language.svg';
import NaviLanguageModal from 'src/components/navi/navi-language-modal';

import StudentSignUp from '../entry/sign/student-sign-up';

function WelcomeSignUp() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const history = useHistory();
  const [showLanguages, setShowLanguages] = useState(false);

  const handleBack = () => {
    history.push('/welcome');
  };

  return (
    <div className="welcome-signup">
      <div className="welcome-signup-background" />
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
      <div className="welcome-signup-language" onClick={() => setShowLanguages(true)}>
        <span className="icon">
          <LanguageSvg />
        </span>
        <span className="text">{t('language')}</span>
      </div>
      <div className="back-button" onClick={handleBack}>
        <Back />
        <p className="back-text">{t('login')}</p>
      </div>
      <StudentSignUp />
    </div>
  );
}

export default WelcomeSignUp;
