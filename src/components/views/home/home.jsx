import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './home.scss';

import EventApi from 'src/apis/viviboom/EventApi';
import { EventType } from 'src/enums/EventType';
import { EventOrderType } from 'src/enums/EventOrderType';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { DateTime } from 'luxon';
import { PublicAccessType } from 'src/enums/PublicAccessType';
import WelcomeModal from '../welcome-modal/welcome-modal';

import { app } from '../../../js/utils/app';
import Confetti from '../../../js/vendor/confetti';
import RandomConfetti from '../../../js/vendor/randomConfetti';

import HomeSg from './home-sg';
import HomePh from './home-ph';
import HomeEe from './home-ee';
import HomeLt from './home-lt';
import HomeJp from './home-jp';
import HomeUs from './home-us';
import HomeNz from './home-nz';
import HomeDefault from './home-default';
import WelcomeBanner from './common/WelcomeBanner';

function Home() {
  const user = useSelector((state) => state?.user);
  // Persisted redux state of completion of all tutorials
  const tutorialState = useSelector((state) => state?.tutorial);
  const [workshops, setWorkshops] = useState([]);

  const fetchWorkshops = useCallback(async () => {
    if (!user?.authToken) return;
    try {
      const res = await EventApi.getList({
        authToken: user.authToken,
        startDate: DateTime.now().startOf('day').toISO(),
        category: EventType.WORKSHOP,
        order: EventOrderType.OLDEST,
        branchId: user.branchId,
        isBeforeBookingEnd: true,
        publicAccessTypes: [PublicAccessType.NONE, PublicAccessType.VIEW, PublicAccessType.BOOK],
      });
      setWorkshops(res.data?.events);
    } catch (e) {
      console.error(e);
    }
  }, [user?.authToken, user?.branchId]);

  useEffect(() => {
    Confetti();

    document.querySelector('.modal-trigger').addEventListener('click', () => {
      setTimeout(() => {
        RandomConfetti();
      }, 1500);
      setTimeout(() => {
        RandomConfetti();
      }, 2000);
    });

    fetchWorkshops();
  }, [fetchWorkshops]);

  useEffect(() => {
    Confetti();

    setTimeout(() => {
      app.plugins.createPopup({
        container: '.welcome-modal',
        trigger: '.modal-trigger',
        sticky: true,
        overlay: {
          color: '21, 21, 31',
          opacity: 1,
          onEsc: false,
        },
        animation: {
          type: 'translate-in-fade',
          speed: 0.3,
          translateOffset: 40,
        },
      });

      if (!tutorialState[TutorialSectionType.WELCOME]) {
        document.querySelector('.modal-trigger').click();
      }
    }, 2000);
  }, [user?.id, tutorialState]);

  const getHomeContent = () => {
    if (user?.institutionId === 1) {
      switch (user.branchId) {
        case 1:
          return <HomeSg workshops={workshops} />;
        case 2:
          return <HomePh workshops={workshops} />;
        case 3:
          return <HomeEe workshops={workshops} />;
        case 4:
          return <HomeLt workshops={workshops} />;
        case 5:
          return <HomeJp workshops={workshops} />;
        case 6:
          return <HomeUs workshops={workshops} />;
        case 7:
          return <HomeNz workshops={workshops} />;
        default:
          return <HomeDefault workshops={workshops} />;
      }
    } else {
      return <HomeDefault workshops={workshops} />;
    }
  };

  return (
    <div className={window.isRNWebView ? 'home-page hide-in-app' : 'home-page'}>
      <WelcomeBanner />
      <div className="modal-trigger" />
      {(!tutorialState[TutorialSectionType.WELCOME]) && <WelcomeModal id={user.id} />}
      {getHomeContent()}
    </div>
  );
}

export default Home;
