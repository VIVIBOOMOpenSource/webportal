import React from 'react';
import { useHistory } from 'react-router-dom';

import { DateTime } from 'luxon';

import './public-event-item.scss';

import DefaultWorkshopPicture from 'src/css/imgs/event-imgs/default-workshop.png';
import { PublicAccessType } from 'src/enums/PublicAccessType';
import Button from 'src/components/common/button/button';
import { useTranslation } from 'react-i18next';

function PublicEventItem({ eventSession, showReadMore }) {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const startTime = DateTime.fromISO(eventSession?.startAt);
  const isMembersOnly = eventSession?.publicAccessType === PublicAccessType.VIEW;
  const history = useHistory();

  return (
    <div className="public-event-item" onClick={() => history.push(`/branch/${eventSession?.branchId}/event/${eventSession?.id}`)}>
      <div className="home-navi-sub">
        <div className="workshop-image">
          <img
            className="image"
            alt="workshop"
            src={eventSession?.imageUri || DefaultWorkshopPicture}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DefaultWorkshopPicture;
            }}
          />
        </div>
        <div className="date-sticker">
          <div className="date-sticker-day">{startTime?.day}</div>
          <div className="date-sticker-month">{startTime?.monthShort}</div>
        </div>
        <div className="text">
          <p className="event-title">
            {eventSession?.title}
            {isMembersOnly ? ' (Members Only)' : ''}
          </p>
          {showReadMore ? (
            <div className="workshop-desc">
              <p>{eventSession?.description}</p>
              <div className="button-element-container">
                <div className="gap-fill" />
                <Button parentClassName="more-button">
                  {t('Find Out More')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="description">
              {eventSession?.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicEventItem;
