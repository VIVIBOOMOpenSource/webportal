import './step-one.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function StepOne() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const user = useSelector((state) => state?.user);
  // The markup for the Step 1 UI
  return (
    <div className="step-one">
      <div className="viviboom-text bounce-out-bck">
        {t('Hello')}
        {' '}
        <span className="name">{user?.givenName}</span>
        !
      </div>
      <br />
      <div className="viviboom-text bounce-in-fwd">{t('WELCOME TO VIVIBOOM!')}</div>
      <br />
      {/* <div className="text subheading">
        Check out all the cool things you can do here!
      </div> */}
    </div>
  );
}

export default StepOne;
