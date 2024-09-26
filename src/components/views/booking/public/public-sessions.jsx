import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import './public-sessions.scss';

// utility checks
const isFullyBooked = (eventSession) => eventSession.maxSlots <= eventSession.bookingCount;

function PublicSessions({
  selectedDay,
  freeflow,
  workshops,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const history = useHistory();

  const renderSession = (isWorkshop) => {
    const sessionList = isWorkshop ? workshops : freeflow;

    return (
      <div className="calendar-events-preview-subtitle">
        {t(isWorkshop ? 'Workshops / Events' : 'Free Flow Sessions')}
        {sessionList.length === 0 ? (
          <div className="calendar-event-preview-list empty">
            <div className="calendar-event-preview">{t('No sessions for this day')}</div>
          </div>
        ) : (
          sessionList.map((v) => (
            <div
              key={`event-session_${v.id}`}
              className={
                  `calendar-event-preview-list ${
                    isWorkshop ? 'workshop ' : 'freeflow '
                  }${isFullyBooked(v) ? 'inactive'
                    : 'active'}`
                }
              onClick={() => onSessionClick(v)}
            >
              <div className="public-calendar-event-preview">
                <div className="calendar-event-preview-start-time">
                  <p className="calendar-event-preview-start-time-title">{DateTime.fromISO(v.startAt).toFormat('h:mm')}</p>
                  <p className="calendar-event-preview-start-time-text">{DateTime.fromISO(v.startAt).toFormat('a')}</p>
                </div>

                <div className="calendar-event-preview-info">
                  {isFullyBooked(v) ? (
                    <p className="calendar-event-preview-title">{isWorkshop ? `${v.title}: ${t('Fully Booked')}` : t('Availability: Fully Booked')}</p>
                  ) : isWorkshop ? (
                    <p className="calendar-event-preview-title">{!v.title ? t('Workshop') : v.title}</p>
                  ) : (
                    <div>
                      <p className="calendar-event-preview-title">{(v.title || t('Free Flow Session'))}</p>
                      <p className="calendar-event-preview-title">
                        {t('Availability')}
                        :
                        {' '}
                        {t('slotsLeft', { count: v.maxSlots - v.bookingCount })}
                      </p>
                    </div>
                  )}
                  <p className="calendar-event-preview-time">
                    {t('Duration')}
                    :
                    <span className="bold">
                      {' '}
                      {v.duration}
                      {' '}
                      {t('hours')}
                    </span>
                  </p>
                  {!!v.facilitators?.length && (
                    <p className="calendar-event-preview-facilitator">
                      {t(v.institutionId === 1 ? 'Crew' : 'Facilitator')}
                      :
                      {' '}
                      <span className="bold">
                        {v.facilitators.map((facilitator) => facilitator.name).join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const onSessionClick = (session) => {
    const path = `/branch/${session.branch.id}/event/${session.id}`;
    history.push(path);
  };

  return (
    <div className="public-calendar-events-preview">
      <p className="calendar-events-preview-title primary">{DateTime.fromJSDate(selectedDay).toLocaleString(DateTime.DATE_HUGE)}</p>
      <p className="calendar-events-preview-title secondary">{DateTime.fromJSDate(selectedDay).toLocaleString(DateTime.DATE_HUGE)}</p>
      {renderSession(false)}
      {renderSession(true)}
    </div>
  );
}

export default PublicSessions;
