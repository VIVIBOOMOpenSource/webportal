import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useSelector } from 'react-redux';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import TutorialReduxActions from 'src/redux/tutorial/TutorialReduxActions';

function Joyride({
  outsideRun = true, sectionType, ...attr
}) {
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation('translation', { keyPrefix: 'joyride' });
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const tutorialState = useSelector((state) => state?.tutorial);

  const isProjectFormTutorial = sectionType === TutorialSectionType.PROJECT_FORM;

  const naviSteps = [
    {
      target: '.routes-ul',
      content: t('naviContent1'),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.user',
      content: t('naviContent2'),
      disableBeacon: true,
      placement: 'left',
    },
  ];

  const mobileNaviSteps = [
    {
      target: '.menu',
      content: t('mobileNaviContent1'),
      spotlightPadding: 0,
      spotlightClicks: true,
      disableBeacon: true,
      hideFooter: true,
      disableOverlayClose: true,
      placement: 'right',
      styles: {
        options: {
          zIndex: 1000,
        },
      },
    },
    {
      target: '.routes-section.main',
      content: t('mobileNaviContent2'),
      disableBeacon: true,
      placement: 'right',
      styles: {
        options: {
          zIndex: 1000,
        },
      },
    },
    {
      target: '.routes-section.profile',
      content: t('mobileNaviContent3'),
      disableBeacon: true,
      placement: 'right',
      styles: {
        options: {
          zIndex: 1000,
        },
      },
    },
    {
      target: '.user-options',
      content: t('mobileNaviContent4'),
      disableBeacon: true,
      placement: 'right',
      styles: {
        options: {
          zIndex: 1000,
        },
      },
    },
  ];

  const badgesSteps = [
    {
      target: 'body',
      title: t('Badges'),
      content: t('badgesContent1'),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.badge-list',
      content: t('badgesContent2'),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'top',
    },
  ];

  const challengesSteps = [
    {
      target: 'body',
      title: t('Challenges'),
      content: t('challengesContent1'),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.challenge-list',
      content: t('challengesContent2'),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'top',
    },
  ];

  const starterBadgesSteps = [
    {
      target: 'body',
      title: t('Badges'),
      content: t('starterBadgesContent1'),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.badge-list',
      content: t('starterBadgesContent2'),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'top',
    },
  ];

  const projectsSteps = [
    {
      target: 'body',
      title: t('Projects'),
      content: t('projectsContent1'),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.new-project-button-container',
      content: t('projectsContent2'),
      disableBeacon: true,
      placement: 'left',
    },
    {
      target: '.carousel-container',
      content: t('projectsContent3'),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'bottom',
    },
    {
      target: '.project-list',
      content: t('projectsContent4'),
      disableBeacon: true,
      spotlightClicks: true,
      placement: 'top',
    },
  ];

  const projectSteps = [
    {
      target: '.widget-box',
      content: t('projectContent1'),
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '.add-comment',
      content: t('projectContent2'),
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '.chat',
      content: t('projectContent3'),
      disableBeacon: true,
      placement: 'top',
    },
  ];

  const projectFormSteps = [
    {
      target: '.wip-buttons',
      content: t('projectFormContent1'),
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '.wip-buttons',
      content: t('projectFormContent2'),
      disableBeacon: true,
      spotlightClicks: true,
      disableOverlayClose: true,
      hideFooter: true,
      placement: 'top',
    },
    {
      target: '.badge-list',
      content: t('projectFormContent3'),
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '.save-button',
      content: t('projectFormContent4'),
      disableBeacon: true,
      placement: 'bottom',
    },
  ];

  const membersSteps = [
    {
      target: 'body',
      title: t('VIVINAUTS'),
      content: t('membersContent1'),
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.members-ul',
      content: t('membersContent2'),
      disableBeacon: true,
      spotlightPadding: 0,
      spotlightClicks: true,
      placement: 'top',
    },
  ];

  const memberSteps = [
    {
      target: '.member-content-right',
      content: t('memberContent1'),
      disableBeacon: true,
      spotlightPadding: 0,
      placement: 'top',
    },
    {
      target: '.member-chat',
      content: t('memberContent2'),
      disableBeacon: true,
      placement: 'right',
    },
  ];

  const bookingsSteps = [
    {
      target: 'body',
      title: t('Bookings'),
      content: t('bookingsContent1'),
      disableBeacon: true,
      placement: 'center',
    },
  ];

  const eventsSteps = [
    {
      target: 'body',
      title: t('Events'),
      content: t('eventsContent1'),
      disableBeacon: true,
      placement: 'center',
    },
  ];

  const getSteps = (type) => {
    switch (type) {
      case TutorialSectionType.NAVI:
        return naviSteps;
      case TutorialSectionType.MOBILE_NAVI:
        return mobileNaviSteps;
      case TutorialSectionType.BADGES:
        return badgesSteps;
      case TutorialSectionType.CHALLENGES:
        return challengesSteps;
      case TutorialSectionType.STARTER_CRITERIA:
        return starterBadgesSteps;
      case TutorialSectionType.PROJECTS:
        return projectsSteps;
      case TutorialSectionType.PROJECT:
        return projectSteps;
      case TutorialSectionType.PROJECT_FORM:
        return projectFormSteps;
      case TutorialSectionType.MEMBERS:
        return membersSteps;
      case TutorialSectionType.MEMBER:
        return memberSteps;
      case TutorialSectionType.BOOKINGS:
        return bookingsSteps;
      case TutorialSectionType.EVENTS:
        return eventsSteps;
      default:
        return [{}];
    }
  };

  useEffect(() => {
    if (!isProjectFormTutorial && !tutorialState[sectionType]) {
      setRun(true);
    } else if (isProjectFormTutorial) {
      setRun(!user.isCompletedCreateProjectTutorial);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const {
      action, index, status, type, size,
    } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);
      setStepIndex(0);
      if (status === STATUS.SKIPPED || (status === STATUS.FINISHED && size === 1)) {
        TutorialReduxActions.clearTutorial(sectionType);
      }
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      // Mark completion state as completed 1 step before the end to account for user switching page
      if (size > 1 && index === size - 2) {
        TutorialReduxActions.clearTutorial(sectionType);
      }
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndex(nextStepIndex);
    }
  };

  return (
    <ReactJoyride
      steps={getSteps(sectionType)}
      stepIndex={stepIndex}
      run={run && outsideRun} // Outer component can set run state, but only if tutorial is supposed to run
      callback={handleJoyrideCallback}
      continuous
      showSkipButton
      hideCloseButton
      locale={{
        back: t('Back'), last: t('Close'), next: t('Next'), skip: t('Skip'),
      }}
      floaterProps={{ disableAnimation: true }}
      styles={{
        options: {
          primaryColor: '#7353ff', // Secondary color in css colors
        },
      }}
      {...attr}
    />
  );
}

export default Joyride;
