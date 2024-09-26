import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import './sessions.scss';
import { isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import { BookingStatusType } from 'src/enums/BookingStatusType';
import EventModal from './event-modal';
import Modal from '../../common/modal/modal';
import { ReactComponent as InfoSvg } from '../../../css/imgs/icon-info.svg';
import { ReactComponent as CheckSVG } from '../../../css/imgs/icon-check.svg';
import { ReactComponent as CrossSVG } from '../../../css/imgs/icon-cross.svg';

// utility checks
const isFullyBooked = (eventSession) => eventSession.maxSlots <= eventSession.bookingCount;

const hasSubmittedUserBooking = (eventSession, userBookings) => (userBookings?.find((b) => b.eventId === eventSession.id && b.status === BookingStatusType.SUBMITTED) !== undefined);

const hasApprovedUserBooking = (eventSession, userBookings) => (userBookings?.find((b) => b.eventId === eventSession.id && b.status === BookingStatusType.APPROVED) !== undefined);

const hasApprovedBookingOnTheSameDay = (eventSession, userBookings) => (userBookings?.find((b) => b.status === BookingStatusType.APPROVED && isSameDay(new Date(eventSession.startAt), new Date(b.event.startAt))) !== undefined);

const isQuotaExceeded = (eventSession, weekdaysUnusedQuota, weekendsUnusedQuota) => {
  const dayOfWeek = new Date(eventSession.startAt).getDay();
  if (weekendsUnusedQuota <= 0 && dayOfWeek % 6 === 0) return true;
  if (weekdaysUnusedQuota <= 0 && dayOfWeek % 6 !== 0) return true;
  return false;
};

function Sessions({
  selectedDay,
  weekdaysUnusedQuota,
  weekendsUnusedQuota,
  weekdayQuota,
  weekendQuota,
  freeflow,
  workshops,
  userBookings,
  currentMonth,
  refreshSessions,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const user = useSelector((state) => state?.user);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentSession, setCurrentSession] = useState([]);

  const onInfoClick = () => {
    setShowInfo(true);
  };

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
                  }${hasApprovedUserBooking(v, userBookings) ? 'booked'
                    : hasSubmittedUserBooking(v, userBookings) ? 'submitted'
                      : (user?.branch?.countryISO !== 'SG' && hasApprovedBookingOnTheSameDay(v, userBookings)) || isQuotaExceeded(v, weekdaysUnusedQuota, weekendsUnusedQuota) || isFullyBooked(v) ? 'inactive'
                        : 'active'}`
                }
              onClick={() => onSessionClick(v)}
            >
              <div className="calendar-event-preview">
                <div className="calendar-event-preview-start-time">
                  <p className="calendar-event-preview-start-time-title">{DateTime.fromISO(v.startAt).toFormat('h:mm')}</p>
                  <p className="calendar-event-preview-start-time-text">{DateTime.fromISO(v.startAt).toFormat('a')}</p>
                </div>

                <div className="calendar-event-preview-info">
                  {user?.branch?.countryISO !== 'SG' && hasApprovedBookingOnTheSameDay(v, userBookings) && <CheckSVG className="icon-check" />}
                  {(user?.branch?.countryISO !== 'SG' && hasApprovedBookingOnTheSameDay(v, userBookings)) ? (
                    <p className="calendar-event-preview-title">{t(isWorkshop ? 'Registered!' : 'Booked!')}</p>
                  ) : hasSubmittedUserBooking(v, userBookings) ? (
                    <p className="calendar-event-preview-title">
                      {v.title}
                      :
                      {' '}
                      {t('Pending Confirmation')}
                    </p>
                  ) : isFullyBooked(v) ? (
                    <p className="calendar-event-preview-title">{isWorkshop ? `${v.title}: ${t('Fully Booked')}` : t('Availability: Fully Booked')}</p>
                  ) : isWorkshop ? (
                    <p className="calendar-event-preview-title">{!v.title ? t('Workshop') : v.title}</p>
                  ) : (
                    <div>
                      <p className="calendar-event-preview-title">{(v.title || t('Free Flow Session') )}</p>
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
    if (hasApprovedUserBooking(session, userBookings)) {
      toast.success(t('You have already booked this session'));
    } else if (user?.branch?.countryISO !== 'SG' && hasApprovedBookingOnTheSameDay(session, userBookings)) {
      toast.error(t('Sorry, you have booked another session for this day'));
    } else if (hasSubmittedUserBooking(session, userBookings)) {
      toast.success(t('Your registration is now pending'));
    } else if (isQuotaExceeded(session, weekdaysUnusedQuota, weekendsUnusedQuota)) {
      toast.error(t('Sorry, you have reached the booking quota'));
    } else if (isFullyBooked(session)) {
      toast.error(t('Sorry, this session is full'));
    } else {
      setCurrentSession(session);
      setShowModal(true);
    }
  };

  return (
    <div className="calendar-events-preview">
      <EventModal
        date={selectedDay}
        eventSession={currentSession}
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshSessions={refreshSessions}
      />
      <Modal show={showInfo} className="popup-event" handleClose={() => setShowInfo(false)}>
        <div className="popup-info">
          <p className="title bold">{t('Why is my booking limited?')}</p>
          <p>
            {t('To allow all members an opportunity to visit VIVISTOP, members are restricted to booking')}
            :
          </p>
          <p className="indent">
            <span className="bold">
              {t('1 session per day')}
            </span>
          </p>
          {weekdayQuota !== 999 && (
            <p className="indent">
              <span className="bold">
                {t('weekdayQuota', { weekdayQuota })}
              </span>
            </p>
          )}
          <p className="indent">
            <span className="bold">
              {t('weekendQuota', { weekendQuota })}
            </span>
            .
          </p>
          <p>
            <Trans i18nKey="booking.quotaMonth">
              {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              For the month of <span className="bold">{{ month: DateTime.fromJSDate(currentMonth).monthLong }}</span>
            </Trans>
          </p>
        </div>
        <div className="popup-close-button" onClick={() => setShowInfo(false)}>
          <CrossSVG className="popup-close-button-icon icon-cross" />
        </div>
      </Modal>
      <p className="calendar-events-preview-title primary">{DateTime.fromJSDate(selectedDay).toLocaleString(DateTime.DATE_HUGE)}</p>
      <div className="quota">
        <div className="quota-text">
          <p>
            <span className="bold">
              {t('Weekday quota')}
              :
              {' '}
            </span>
            {weekdaysUnusedQuota <= 0
              ? t('Quota reached!')
              : weekdayQuota === 999
                ? t('Unlimited')
                : t('sessionsLeft', { count: weekdaysUnusedQuota })}
          </p>
          <p>
            <span className="bold">
              {t('Weekend quota')}
              :
              {' '}
            </span>
            {weekendsUnusedQuota <= 0
              ? t('Quota reached!')
              : weekendQuota === 999
                ? t('Unlimited')
                : t('sessionsLeft', { count: weekendsUnusedQuota })}
          </p>
        </div>
        {user.institutionId === 1 && <InfoSvg className="quota-icon" onClick={onInfoClick} />}
      </div>
      <p className="calendar-events-preview-title secondary">{DateTime.fromJSDate(selectedDay).toLocaleString(DateTime.DATE_HUGE)}</p>
      {renderSession(false)}
      {renderSession(true)}
    </div>
  );
}

export default Sessions;
