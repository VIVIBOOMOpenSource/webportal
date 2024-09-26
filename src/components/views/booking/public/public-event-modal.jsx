import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { DateTime } from 'luxon';
import './public-event-modal.scss';
import PublicBookingApi from 'src/apis/viviboom/PublicBookingApi';
import { EventType } from 'src/enums/EventType';
import { BookingStatusType } from 'src/enums/BookingStatusType';
import { EventQuestionDestinationType } from 'src/enums/EventQuestionDestinationType';
import Config from 'src/config';
import Loading from 'src/components/common/loading/loading';
import { ReactComponent as CrossSVG } from '../../../../css/imgs/icon-cross.svg';
import Modal from '../../../common/modal/modal';
import ResgistrationForm from '../registration-form';

function PublicEventModal({
  show,
  handleClose,
  eventSession,
  refresh,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });

  const [hideForm, setHideForm] = useState(true);

  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [isLoading, setLoading] = useState(false);

  const recaptchaRef = useRef();

  const resetState = () => {
    setFamilyName('');
    setGivenName('');
    setGuardianName('');
    setPhone('');
    setEmail('');
    setLoading(false);
  };

  const handleSubmit = async (responses) => {
    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      const body = {
        familyName,
        givenName,
        guardianName,
        phone,
        email,
        eventId: eventSession.id,
        recaptchaToken,
      };

      if (responses && responses.length > 0) body.responses = responses;

      const res = await PublicBookingApi.post(body);
      if (res.data?.booking?.status === BookingStatusType.APPROVED) {
        if (eventSession.type === EventType.WORKSHOP) toast.success(t('Yay you are registered for a workshop!'));
        if (eventSession.type === EventType.FREE_FLOW) toast.success(t('Yay you booked a session!'));
      } else if (res.data?.booking?.status === BookingStatusType.SUBMITTED) {
        toast.success(t('Thank you for registering, please await confirmation'));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Someone has already signed up with this email');
    }
    handleClose();
    resetState();
    refresh();
  };

  const hasEventQuestion = useMemo(
    () => eventSession?.eventQuestions && !!eventSession?.eventQuestions?.filter((q) => q.destination === EventQuestionDestinationType.BOOKING)?.length,
    [eventSession?.eventQuestions],
  );

  // if event has question, show the question forms and then perform book session request (in the form)
  const onBookClick = async (e) => {
    e.preventDefault();
    if (hasEventQuestion) {
      setHideForm(false);
    } else {
      setLoading(true);
      await handleSubmit();
      setLoading(false);
    }
  };

  return (
    <div className="public-event">
      <Modal
        show={show}
        className="popup-event"
        handleClose={() => {
          handleClose();
        }}
      >
        <div
          className="popup-close-button"
          onClick={() => {
            resetState();
            handleClose();
          }}
        >
          <CrossSVG className="popup-close-button-icon icon-cross" />
        </div>
        {hideForm ? (
          <div className="popup-event-info-body">
            <p className="popup-event-title">{eventSession?.title}</p>
            <p className="popup-event-subtitle">{DateTime.fromISO(eventSession?.startAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</p>
            <form onSubmit={onBookClick}>
              <div>
                <label>
                  {t('Given name')}
                </label>
                <input
                  className="text-input"
                  type="text"
                  value={givenName}
                  onChange={(event) => setGivenName(event.target.value)}
                  required
                />
              </div>
              <div>
                <label>
                  {t('Family name')}
                </label>
                <input
                  className="text-input"
                  type="text"
                  value={familyName}
                  onChange={(event) => setFamilyName(event.target.value)}
                  required
                />
              </div>
              <div>
                <label>
                  {t("Guardian's name")}
                </label>
                <input
                  className="text-input"
                  type="text"
                  value={guardianName}
                  onChange={(event) => setGuardianName(event.target.value)}
                />
              </div>
              <div>
                <label>
                  {t("Guardian's Contact number")}
                </label>
                <input
                  className="text-input"
                  type="number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
              <div>
                <label>
                  {t("Guardian's email")}
                </label>
                <input
                  className="text-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="register-btn-container">
                <button className="register-btn" type="submit" disabled={isLoading}>{isLoading ? <Loading show size="24px" /> : t(hasEventQuestion ? 'Next' : 'Register')}</button>
              </div>
            </form>
          </div>
        ) : (
          <ResgistrationForm
            eventSession={eventSession}
            setHideForm={setHideForm}
            bookSession={handleSubmit}
          />
        )}
      </Modal>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={Config.Common.ReCaptchaSiteKey}
        size="invisible"
        className="booking-recaptcha"
      />
    </div>
  );
}

export default PublicEventModal;
