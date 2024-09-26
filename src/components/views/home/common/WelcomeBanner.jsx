import React from 'react';
import { useSelector } from 'react-redux';
import './WelcomeBanner.scss';

import HomeBackgroundImage from 'src/css/imgs/home-background.png';
import HomeArrow from 'src/css/imgs/home-arrow.png';
import Face from 'src/css/imgs/face.png';
import LightBulb from 'src/css/imgs/lightbulb.png';
import Scribble from 'src/css/imgs/scribble.png';
import Scribble1 from 'src/css/imgs/scribble1.png';
import Scribble2 from 'src/css/imgs/scribble2.png';
import HomeLogoImage from 'src/css/imgs/viviboom-logo-dark.png';

import { useTranslation } from 'react-i18next';

function WelcomeBanner() {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const user = useSelector((state) => state?.user);

  return (
    <div className="welcome-banner">
      <div className="home-background-container">
        <img className="home-background" src={HomeBackgroundImage} alt="background" />
        <img className="home-arrow" src={HomeArrow} alt="arrow" />
        <img className="home-lightbulb" src={LightBulb} alt="lightbulb" />
        <img className="home-face" src={Face} alt="face" />
        <img className="home-scribble" src={Scribble} alt="scribble" />
        <img className="home-scribble1" src={Scribble1} alt="scribble1" />
        <img className="home-scribble2" src={Scribble2} alt="scribble2" />
      </div>
      <div className="home-title-container">
        <h1 className="home-title">{t('Welcome To')}</h1>
        <img className="home-logo" src={HomeLogoImage} alt="logo" draggable={false} />
      </div>
      <div className="home-subtitle">{user?.institutionId === 1 ? `Vivita ${user?.branch?.name || ''}` : user?.institution?.name || ''}</div>
    </div>
  );
}

export default WelcomeBanner;
