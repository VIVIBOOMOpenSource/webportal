import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Carousel from 'react-multi-carousel';
import { isDesktop, isTablet } from 'react-device-detect';

import WorkshopItem from 'src/components/views/booking/workshop-item';
import EventApi from 'src/apis/viviboom/EventApi';
import { DateTime } from 'luxon';
import { EventType } from 'src/enums/EventType';
import { EventOrderType } from 'src/enums/EventOrderType';
import { PublicAccessType } from 'src/enums/PublicAccessType';

let deviceType = 'desktop';

if (!isDesktop) {
  deviceType = isTablet ? 'tablet' : 'mobile';
}

function EventsAndWorkshopsSection() {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const history = useHistory();
  const user = useSelector((state) => state?.user);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 0,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 0,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 0,
    },
  };

  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchWorkshops = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
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
    setLoading(false);
  }, [user?.authToken, user?.branchId]);

  const onMoreClick = useCallback((btn) => {
    const text = btn.closest('div.text');

    if (btn.innerText === t('Read more')) {
      text.querySelectorAll('p').forEach((p) => p.classList.add('show'));
      btn.innerText = t('Read less');
    } else {
      text.querySelectorAll('p').forEach((p) => p.classList.remove('show'));
      btn.innerText = t('Read more');
    }
    text.closest('div.home-navi-sub').scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  if (!workshops) return null;

  return (
    <div className="home-content">
      <h4>{t('Upcoming Events')}</h4>
      <h6>{t('Events and Workshops')}</h6>

      {!workshops?.length ? (
        <div className="no-workshop">
          {isLoading ? <div className="dot-flashing" /> : <h1>{t('There are no upcoming workshops at the moment. Check back soon!')}</h1>}
        </div>
      ) : (
        <Carousel
          ssr
          draggable={false}
          partialVisbile
          renderButtonGroupOutside
          showDots={workshops?.length > (deviceType === 'desktop' ? 3 : 1)}
          autoPlay
          autoPlaySpeed={3000}
          transitionDuration={1000}
          deviceType={deviceType}
          containerClass="carousel-ctn"
          keyBoardControl
          responsive={responsive}
          removeArrowOnDeviceType={['tablet', 'mobile']}
        >
          {workshops.map((v) => (
            <WorkshopItem
              key={`home-event-${v.id}`}
              eventSession={v}
              onWorkshopClick={() => history.push('/events')}
              showReadMore
              onShowMoreClick={(e) => onMoreClick(e.target)}
            />
          ))}
        </Carousel>
      )}

      <div className="button-container">
        <Link className="button" to="/events">
          {t('Book a Workshop')}
        </Link>
      </div>
    </div>
  );
}
export default EventsAndWorkshopsSection;
