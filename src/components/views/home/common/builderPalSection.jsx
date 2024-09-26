import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Player } from '@lottiefiles/react-lottie-player';

import builderPalAnim from 'src/css/lotties/builder-pal-landing.json';
import Button from 'src/components/common/button/button';

import './builderPalSection.scss';

function BuilderPalSection() {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const history = useHistory();

  return (
    <div className="home-content">
      <div className="home-builderpal-container">
        <div className="inner-container">
          <Player
            autoplay
            loop
            src={builderPalAnim}
            style={{ height: '400px', width: '400px' }}
          />
          <div className="title-container">
            <h6 className="title">{t('Build with BuilderPal')}</h6>
            <p className="subtitle">{t('builderPalSubtitle')}</p>
            <p className="subtitle">{t('Are you ready?')}</p>
            <Button parentClassName="next-button" onClick={() => history.push('/builderpal')}>{t("Let's Go!")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BuilderPalSection;
