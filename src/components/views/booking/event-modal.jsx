import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import './event-modal.scss';
import MyImage from 'src/components/common/MyImage';
import { toast } from 'react-toastify';
import BookingApi from 'src/apis/viviboom/BookingApi';
import EventApi from 'src/apis/viviboom/EventApi';
import { BookingStatusType } from 'src/enums/BookingStatusType';
import { EventType } from 'src/enums/EventType';
import { EventQuestionDestinationType } from 'src/enums/EventQuestionDestinationType';
import { ReactComponent as CrossSVG } from '../../../css/imgs/icon-cross.svg';
import { ReactComponent as EventSVG } from '../../../css/imgs/icon-event.svg';
import { ReactComponent as MembersSVG } from '../../../css/imgs/icon-members.svg';
import { ReactComponent as NewWindowSVG } from '../../../css/imgs/icon-new-window.svg';
import DefaultWorkshopImg from '../../../css/imgs/event-imgs/default-workshop.png';
import DefaultFreeFlowImg from '../../../css/imgs/event-imgs/default-freeflow.png';
import DefaultProfileImg from '../../../css/imgs/boom-imgs/profile/default-profile-picture.png';
import Loading from '../../common/loading/loading';

import Modal from '../../common/modal/modal';
import ResgistrationForm from './registration-form';

const DEFAULT_WORKSHOP_IMAGE_SIZE = 1024;
const DEFAULT_PROFILE_IMAGE_SIZE = 128;

function EventModal({
  eventSession,
  date,
  show,
  handleClose,
  refreshSessions,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const eventDescription = t('Please cancel as at least 48 hours prior to your visit to enable other members to have a chance to take up the slot. Thank you!');
  const user = useSelector((state) => state?.user);
  const userId = user.id;
  const isWorkshop = eventSession.type === EventType.WORKSHOP;
  const [hideForm, setHideForm] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const defaultEventImage = isWorkshop ? DefaultWorkshopImg : DefaultFreeFlowImg;

  const bookSession = async (responses) => {
    try {
      setLoading(true);

      let res = await BookingApi.post({ authToken: user.authToken, userId, eventId: eventSession.id });

      if (res.data?.booking?.status === BookingStatusType.APPROVED) {
        if (eventSession.type === EventType.WORKSHOP) toast.success(t('Yay you are registered for a workshop!'));
        if (eventSession.type === EventType.FREE_FLOW) toast.success(t('Yay you booked a session!'));
      } else if (res.data?.booking?.status === BookingStatusType.SUBMITTED) {
        toast.success(t('Thank you for registering, please await confirmation'));
      }

      if (responses && responses.length > 0) {
        res = await EventApi.postResponse({
          authToken: user.authToken, eventId: eventSession.id, bookingId: res.data?.booking?.id, responses,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setLoading(false);
    handleClose();
    await refreshSessions();
  };

  // if event has question, show the question forms and then perform book session request (in the form)
  const onBookClick = async () => {
    if (eventSession.eventQuestions && !!eventSession?.eventQuestions?.filter((q) => q.destination === EventQuestionDestinationType.BOOKING)?.length) {
      setHideForm(false);
    } else {
      await bookSession();
    }
  };

  return (
    <Modal
      show={show}
      className="popup-event"
      handleClose={() => {
        handleClose();
        setHideForm(true);
      }}
    >
      <div
        className="popup-close-button"
        onClick={() => {
          handleClose();
          setHideForm(true);
        }}
      >
        <CrossSVG className="popup-close-button-icon icon-cross" />
      </div>

      {hideForm ? (
        <div className="popup-event-info">
          <div className="image">
            <MyImage src={eventSession.imageUri} alt="workshop" defaultImage={defaultEventImage} width={DEFAULT_WORKSHOP_IMAGE_SIZE} />
          </div>
          <div className="popup-event-info-body">
            {isLoading
              ? <button className="popup-event-button button tertiary" id="bookButton"><Loading show={isLoading} size="16px" /></button>
              : <button className="popup-event-button button tertiary" id="bookButton" disabled={isLoading} onClick={() => onBookClick()}>{t(isWorkshop ? 'Register' : 'Book Now')}</button>}
            <p className="popup-event-title">
              {eventSession != null
                && (eventSession.title || t('Free Flow Session'))}
            </p>

            <div className="decorated-feature-list">
              <div className="decorated-feature">
                <EventSVG className="decorated-feature-icon icon-events" />

                <div className="decorated-feature-info">
                  <p className="decorated-feature-title">
                    {DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_HUGE)}
                  </p>
                  <p className="decorated-feature-text">
                    {eventSession.startAt
                      && DateTime.fromISO(eventSession.startAt).toFormat('h:mm a')}
                  </p>
                  <p className="decorated-feature-text">
                    {t('Duration')}
                    :
                    {' '}
                    {eventSession.duration}
                    {' '}
                    {t('hours')}
                  </p>
                </div>
              </div>

              {/* Do not show availability for Honolulu (branchId: 6) */}
              <div className={user?.branchId === 6 ? 'decorated-feature-none' : 'decorated-feature'}>
                <MembersSVG className="decorated-feature-icon icon-members" />
                <div className="decorated-feature-info">
                  <p className="decorated-feature-title">{t('Availability')}</p>
                  <p className="decorated-feature-text">
                    {t('Slots left')}
                    :
                    {' '}
                    {eventSession.maxSlots - eventSession.bookingCount}
                  </p>
                </div>
              </div>
            </div>

            {eventSession?.description && (
              <>
                <p className="popup-event-subtitle">
                  {t('Event description')}
                  :
                </p>
                <p className="popup-event-text">{eventSession?.description}</p>
              </>
            )}

            {!!eventSession?.facilitators?.length && (
              <>
                <p className="popup-event-subtitle">
                  {t(eventSession.institutionId === 1 ? 'crew' : 'Event facilitators')}
                  :
                </p>
                <div className="event-facilitators">
                  {eventSession.facilitators.map((facilitator) => (
                    <div
                      key={`event-facilitator_${facilitator.id}`}
                      className={facilitator.userId ? 'facilitator-item' : 'facilitator-item disabled'}
                      onClick={() => { if (facilitator.userId) window.open(`/member/${facilitator.userId}`); }}
                    >
                      <MyImage src={facilitator.profileImageUri} alt="facilitator" defaultImage={DefaultProfileImg} width={DEFAULT_PROFILE_IMAGE_SIZE} />
                      <p className="facilitator-name">{facilitator.name}</p>
                      {!!facilitator.userId && <NewWindowSVG />}
                    </div>
                  ))}
                </div>
                <p className="facilitator-subtitle">
                  {t(eventSession.institutionId === 1 ? 'Ask the crew anything about' : 'Ask the facilitators anything about')}
                  :
                </p>
                <div className="facilitator-skills">
                  {eventSession.facilitators.map((facilitator) => (
                    <div key={`facilitator-skills_${facilitator.id}`} className="skill-item">
                      <div className="skill-bullet">
                        -
                      </div>
                      <div className="skill-text">
                        {' '}
                        {facilitator.name}
                        :
                        {' '}
                        {facilitator.skills || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="popup-event-subtitle">
              {t('If you are unable to make it')}
              :
            </p>
            <p className="popup-event-text">{eventDescription}</p>
          </div>
        </div>
      ) : (
        <ResgistrationForm
          eventSession={eventSession}
          setHideForm={setHideForm}
          bookSession={bookSession}
        />
      )}
    </Modal>
  );
}

export default EventModal;
