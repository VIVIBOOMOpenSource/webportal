import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import './member-sign-up.scss';

import { ReactComponent as Back } from 'src/css/imgs/icon-arrow-back.svg';
import { ReactComponent as LanguageSvg } from 'src/css/imgs/icon-language.svg';
import NaviLanguageModal from 'src/components/navi/navi-language-modal';

import SignUp from '../entry/sign/sign-up';

function MemberSignUp() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const history = useHistory();
  const [showLanguages, setShowLanguages] = useState(false);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className="member-signup-container">
      <div className="member-signup-background" />
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
      <div className="member-signup-language" onClick={() => setShowLanguages(true)}>
        <span className="icon">
          <LanguageSvg />
        </span>
        <span className="text">{t('language')}</span>
      </div>
      <div className="back-button" onClick={handleBack}>
        <Back />
      </div>
      <SignUp />
    </div>
  );
}

export default MemberSignUp;
