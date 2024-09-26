import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DateTime } from 'luxon';

import './workshop-item.scss';

import Button from 'src/components/common/button/button';
import MyImage from 'src/components/common/MyImage';
import DefaultWorkshopPicture from 'src/css/imgs/event-imgs/default-workshop.png';
import { PublicAccessType } from 'src/enums/PublicAccessType';

const DEFAULT_WORKSHOP_IMAGE_SIZE = 512;

function WorkshopItem({
  eventSession, onWorkshopClick, showReadMore, onShowMoreClick,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const user = useSelector((state) => state?.user);
  const startTime = DateTime.fromISO(eventSession.startAt);
  const endTime = DateTime.fromISO(eventSession.startAt).plus({ hours: eventSession.duration });
  const isMembersOnly = (!user.id && (eventSession.publicAccessType === PublicAccessType.VIEW));

  return (
    <div className="home-page-event">
      <div className="home-navi-sub">
        <div onClick={onWorkshopClick}>
          <div className="workshop-image">
            {user.authToken ? (
              <MyImage alt="workshop" src={eventSession.imageUri} defaultImage={DefaultWorkshopPicture} width={DEFAULT_WORKSHOP_IMAGE_SIZE} />
            ) : (
              <img
                className="image"
                alt="workshop"
                src={eventSession.imageUri || DefaultWorkshopPicture}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = DefaultWorkshopPicture;
                }}
                width={DEFAULT_WORKSHOP_IMAGE_SIZE}
              />
            )}
          </div>
          <div className="date-sticker">
            <div className="date-sticker-day">{startTime.day}</div>
            <div className="date-sticker-month">{startTime.monthShort}</div>
          </div>
          <div className="text">
            <h3>{eventSession.title}</h3>
            {isMembersOnly && <span>(Members Only)</span>}
            <div className="duration">
              {startTime.weekdayShort}
              ,
              {' '}
              <strong>{startTime.toFormat('h:mm a')}</strong>
              {' – '}
              <strong>{endTime.toFormat('h:mm a')}</strong>
            </div>
          </div>
        </div>

        {showReadMore
        && (
        <div className="text workshop-desc">
          <p>{eventSession.description}</p>
          <div className="button-element-container">
            <div className="gap-fill" />
            <Button parentClassName="more-button" onClick={onShowMoreClick}>
              {t('Read more')}
            </Button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default WorkshopItem;
