import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './navi-mobile.scss';

import { useLocation } from 'react-router';
import Config from 'src/config';

// import {ReactComponent as LogoSvg} from '../../css/imgs/logo.svg';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import TutorialReduxActions from 'src/redux/tutorial/TutorialReduxActions';
import useHeaderState from 'src/store/header';
import { useSelector } from 'react-redux';
import Joyride from '../common/joyride/joyride';
import { ReactComponent as MenuSvg } from '../../css/imgs/icon-menu.svg';

import ViviboomLogo from '../../css/imgs/viviboom-logo.png';

function NaviMobile() {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const { toggleMenu } = useHeaderState();
  const [joyrideRun, setJoyrideRun] = useState(true);
  const [joyrideStepIndex, setJoyrideStepIndex] = useState(0);
  const tutorial = useSelector((state) => state?.tutorial);

  const location = useLocation();

  const handleMenuOpen = () => {
    if (!tutorial[TutorialSectionType.MOBILE_NAVI] && joyrideStepIndex === 0) {
      setJoyrideRun(false);
      setJoyrideStepIndex(1);
      toggleMenu();
      setTimeout(() => {
        setJoyrideRun(true);
      }, 400);
    } else {
      toggleMenu();
    }
  };

  const handleJoyrideCallback = (data) => {
    const {
      action, index, status, type,
    } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setJoyrideRun(false);
      setJoyrideStepIndex(0);
      TutorialReduxActions.clearTutorial(TutorialSectionType.MOBILE_NAVI);
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 1 && action === ACTIONS.PREV) {
        setJoyrideRun(false);
        setJoyrideStepIndex(nextStepIndex);
        toggleMenu();
        setTimeout(() => {
          setJoyrideRun(true);
        }, 400);
      } else {
        setJoyrideStepIndex(nextStepIndex);
      }
    }
  };

  return (
    <div className={window.isRNWebView ? 'navi-mobile hide-in-app' : 'navi-mobile'}>
      {/* <span className="logo"><LogoSvg/></span> */}
      <Joyride
        sectionType={TutorialSectionType.MOBILE_NAVI}
        outsideRun={window.innerWidth < 980 && location.pathname === '/' && joyrideRun}
        callback={handleJoyrideCallback}
        stepIndex={joyrideStepIndex}
      />
      <div className="logo">
        <img className="logo-image" alt="logo" src={ViviboomLogo} />
      </div>
      <button className="button menu" onClick={handleMenuOpen}>
        <MenuSvg />
      </button>
      <div className="app-button">
        <div className="open-app" onClick={() => window.open(`${Config.Common.MobileAppUrl}${location.pathname}`)}>{t('Open App')}</div>
      </div>
    </div>
  );
}

export default NaviMobile;
