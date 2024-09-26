import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import './public-event.scss';
import { toast } from 'react-toastify';
import PublicEventApi from 'src/apis/viviboom/PublicEventApi';
import { PublicAccessType } from 'src/enums/PublicAccessType';
import { EventType } from 'src/enums/EventType';
import SkeletonBox from 'src/components/common/preloader/skeleton-box';
import { ReactComponent as EventSVG } from '../../../../css/imgs/icon-event.svg';
import { ReactComponent as MembersSVG } from '../../../../css/imgs/icon-members.svg';
import DefaultWorkshopImg from '../../../../css/imgs/event-imgs/default-workshop.png';
import DefaultFreeFlowImage from '../../../../css/imgs/event-imgs/default-freeflow.png';
import PublicEventModal from './public-event-modal';
import { getBranchIdFromCode } from './public-booking';

const DEFAULT_WORKSHOP_IMAGE_SIZE = 1024;

const publicBookingAccessTypes = [PublicAccessType.BOOK, PublicAccessType.PUBLIC_ONLY];

function PublicEvent() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const eventDescription = t('Please cancel as at least 48 hours prior to your visit to enable others to have a chance to take up the slot. The link to cancel will be included in our email confirmation. Thank you!');
  const params = useParams();
  const { code, eventId } = params;
  const [isLoading, setLoading] = useState(true);
  const [eventSession, setEventSession] = useState(null);
  const [date, setDate] = useState(null);
  const [openRegisterEventModal, setOpenRegisterEventModal] = useState(false);
  const [eventImage, setEventImage] = useState()
  const history = useHistory();
  const user = useSelector((state) => state?.user);

  const getEventSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PublicEventApi.get({ id: eventId });
      setEventSession(res.data);
      setDate(new Date(res.data.startAt));
      setEventImage(res.data.type === EventType.WORKSHOP ? DefaultWorkshopImg : DefaultFreeFlowImage);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
    setLoading(false);
  }, [eventId]);

  const handleRegisterClick = async () => {
    if (publicBookingAccessTypes.includes(eventSession.publicAccessType) || user?.id) {
      setOpenRegisterEventModal(true);
    } else {
      history.push('/welcome');
    }
  };

  const handleBackClick = () => {
    history.push(`/branch/${code}/event`);
  };

  useEffect(() => {
    getEventSession();
  }, [getEventSession]);

  const isPastEvent = useMemo(() => eventSession?.bookingEndAt && new Date(eventSession?.bookingEndAt) < new Date(), [eventSession?.bookingEndAt]);

  const buttonText = useMemo(() => {
    if (!eventSession) return '';
    if (isPastEvent) return t('Event is over');
    if (publicBookingAccessTypes.includes(eventSession.publicAccessType) || user?.id) {
      if (eventSession.bookingCount < eventSession.maxSlots) return t('Register');
      return t('Event Fully Booked');
    }
    return t('Login to Register');
  }, [eventSession, isPastEvent, t, user?.id]);

  if (!isLoading && (!eventSession || getBranchIdFromCode(code) !== eventSession.branchId)) {
    return <h1 className="error-message">Oops, seems like something went wrong!</h1>;
  }

  return (
    <div className="public-event-info">
      <div className="image">
        {!isLoading ? (
          <img
            alt="workshop"
            src={eventSession.imageUri || eventImage}
            width={DEFAULT_WORKSHOP_IMAGE_SIZE}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = eventImage;
            }}
          />
        ) : <SkeletonBox />}
      </div>
      <div className="public-event-info-body">
        <div className="public-event-body-header">
          <div className="title-and-description">
            <p className="public-event-title">
              {eventSession?.title || t('Free Flow Session')}
            </p>
          </div>
          <div className="public-event-buttons">
            {!eventSession
              ? <button className="public-event-button button" id="registerButton" disabled>Loading...</button>
              : (
                <button
                  className="public-event-button button"
                  id="registerButton"
                  onClick={() => handleRegisterClick()}
                  disabled={eventSession.bookingCount >= eventSession.maxSlots || isPastEvent}
                >
                  {buttonText}
                </button>
              )}
            <button className="public-event-button button" id="backButton" onClick={() => handleBackClick()}>{t('Back to public events')}</button>
          </div>
        </div>

        <div className="decorated-feature-list">
          <div className="decorated-feature">
            <EventSVG className="decorated-feature-icon icon-events" />

            <div className="decorated-feature-info">
              <p className="decorated-feature-title">
                {DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_HUGE)}
              </p>
              <p className="decorated-feature-text">
                {eventSession?.startAt
                      && DateTime.fromISO(eventSession.startAt).toFormat('h:mm a')}
              </p>
              <p className="decorated-feature-text">
                {t('Duration')}
                :
                {' '}
                {eventSession?.duration || '-'}
                {' '}
                {t('hours')}
              </p>
            </div>
          </div>

          <div className="decorated-feature">
            <MembersSVG className="decorated-feature-icon icon-members" />

            <div className="decorated-feature-info">
              <p className="decorated-feature-title">{t('Availability')}</p>
              <p className="decorated-feature-text">
                {t('Slots left')}
                :
                {' '}
                {eventSession ? eventSession.maxSlots - eventSession.bookingCount : 0}
              </p>
            </div>
          </div>
        </div>

        {eventSession?.description && (
          <>
            <p className="public-event-subtitle">
              {t('Event description')}
              :
            </p>
            <p className="public-event-text">{eventSession?.description || ''}</p>
          </>
        )}

        {!!eventSession?.facilitators?.length && (
          <>
            <p className="facilitator-subtitle">
              {t(eventSession.institutionId === 1 ? 'Ask the crew of the day anything about' : 'Ask the facilitators of the day anything about')}
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

        <p className="public-event-subtitle">
          {t('If you are unable to make it')}
          :
        </p>
        <p className="public-event-text">{eventDescription}</p>
      </div>
      <PublicEventModal
        show={openRegisterEventModal}
        handleClose={() => setOpenRegisterEventModal(false)}
        eventSession={eventSession}
        refresh={getEventSession}
      />
    </div>
  );
}

export default PublicEvent;
