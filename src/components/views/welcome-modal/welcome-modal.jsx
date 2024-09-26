import React, { useState } from 'react';
import './welcome-modal.scss';
import { useTranslation } from 'react-i18next';

import TutorialReduxActions from 'src/redux/tutorial/TutorialReduxActions';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import StepOne from './step-one/step-one';
import StepTwo from './step-two/step-two';
import StepThree from './step-three/step-three';
import StepFour from './step-four/step-four';
import StepFive from './step-five/step-five';

function WelcomeModal() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const [currentStep, setCurrentStep] = useState(1);

  function next() {
    let curr = currentStep;
    curr = currentStep >= 4 ? 5 : currentStep + 1;
    setCurrentStep(curr);
  }

  function previous() {
    let curr = currentStep;
    curr = currentStep <= 1 ? 1 : currentStep - 1;
    setCurrentStep(curr);
  }

  function complete() {
    TutorialReduxActions.clearTutorial(TutorialSectionType.WELCOME);
    document.querySelectorAll('#xm-popup-background').forEach((e) => e.click());
  }

  function previousButton() {
    const disableButton = currentStep <= 1;

    return (
      <button
        className={disableButton ? 'button previous-button hide-button' : 'button previous-button'}
        type="button"
        onClick={previous}
        disabled={disableButton}
      >
        {t('Back')}
      </button>
    );
  }

  function nextButton() {
    const disableButton = currentStep >= 5;

    if (!disableButton) {
      return (
        <button
          className="button previous-button"
          type="button"
          onClick={next}
        >
          {t('Next')}
        </button>
      );
    }

    return null;
  }

  function renderCompleteButton() {
    const curr = currentStep;

    if (curr === 5) {
      return (
        <button
          className="button complete-button"
          type="button"
          onClick={complete}
        >
          {t('Done!')}
        </button>
      );
    }

    return null;
  }

  function showStep() {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      default:
        return <StepFive />;
    }
  }

  return (
    <div className="welcome-modal-container">
      <div className="welcome-modal-background">
        {showStep()}
        <div className="button-container">
          {previousButton()}
          {nextButton()}
          {renderCompleteButton()}
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;
