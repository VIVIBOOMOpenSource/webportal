import React from 'react';
import { useTranslation } from 'react-i18next';

import './step-two.scss';
import StepTwo1 from '../../../../css/imgs/boom-imgs/step-two-1.jpg';
import StepTwo2 from '../../../../css/imgs/boom-imgs/step-two-2.png';
import StepTwo3 from '../../../../css/imgs/boom-imgs/step-two-3.jpg';

function StepTwo() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  return (
    <div className="step-two">
      <div className="text heading">
        <strong>{t('Some of the cool stuff you can do!')}</strong>
      </div>
      <div className="step-two-items">
        <div className="step-two-item first bounce-in-right-one">
          <div className="step-two-image">
            <img src={StepTwo1} alt="left" />
          </div>
          <div className="step-two-text">{t('Share your projects!')}</div>
        </div>
        <div className="step-two-item second bounce-in-right-two">
          <div className="step-two-image">
            <img src={StepTwo2} alt="middle" />
          </div>
          <div className="step-two-text">{t('Earn shiny badges!')}</div>
        </div>
        <div className="step-two-item third bounce-in-right-three">
          <div className="step-two-image">
            <img src={StepTwo3} alt="right" />
          </div>
          <div className="step-two-text">{t('Pick up new skills!')}</div>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
