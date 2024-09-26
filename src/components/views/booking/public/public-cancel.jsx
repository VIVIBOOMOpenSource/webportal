import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import './public-cancel.scss';
import { toast } from 'react-toastify';
import PublicBookingApi from 'src/apis/viviboom/PublicBookingApi';
import { EventType } from 'src/enums/EventType';
import { BookingStatusType } from 'src/enums/BookingStatusType';

import Loading from '../../../common/loading/loading';
import Modal from '../../../common/modal/modal';
import MyBookingItem from '../my-booking-item';

import { ReactComponent as DeleteSVG } from '../../../../css/imgs/icon-delete.svg';
import { ReactComponent as CrossSVG } from '../../../../css/imgs/icon-cross.svg';
import { ReactComponent as CloseSVG } from '../../../../css/imgs/icon-close.svg';

function PublicCancel() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const params = useParams();
  const { bookingToken } = params;
  const [isLoading, setLoading] = useState(true);
  const [booking, setBooking] = useState();
  const [eventSession, setEventSession] = useState();
  const [statusMessage, setStatusMessage] = useState();

  const [showCancel, setShowCancel] = useState(false);
  const [isCancelLoading, setCancelLoading] = useState(false);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PublicBookingApi.get({ bookingToken });
      setBooking(res.data.booking);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Oops, seems like something went wrong!');
    }
    setLoading(false);
  }, [bookingToken]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  useEffect(() => {
    if (!booking) return;
    setEventSession(booking.event);

    let status = booking.status.toLowerCase();
    if (booking.status === BookingStatusType.CANCELLED && booking.isLateCancellation) status = 'late';

    const status2Description = {
      late: 'late cancellation',
      approved: 'booked',
      rejected: 'unsuccessful',
      submitted: 'pending confirmation',
      cancelled: 'cancelled',
    };
    setStatusMessage(status2Description[status]);
  }, [booking]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await PublicBookingApi.patch({ bookingToken, status: BookingStatusType.CANCELLED });

      if (res.data?.booking && res.data?.booking.status === BookingStatusType.CANCELLED) toast.success(t('You have successfully cancelled your booking'));
    } catch (err) {
      console.error(err);
    }

    setCancelLoading(false);
    fetchBooking();
    setShowCancel(false);
  };

  if (!isLoading && (!booking || !eventSession)) {
    return (
      <h1 className="error-message">Oops, seems like something went wrong!</h1>
    );
  }

  return (
    <div className="public-cancel-content">
      {isLoading && (
        <div className="loading">
          <Loading show size="32px" />
        </div>
      )}
      {(booking && eventSession)
        && (
          <div className="public-cancel-container">
            <Modal show={showCancel} className="popup-event">
              <div className="popup-info">
                <p className="title bold">{t('Are you sure you want to cancel your booking?')}</p>
              </div>
              <div className="popup-actions">
                <div className="action-request accept with-text" onClick={() => setShowCancel(false)}>
                  <CloseSVG className="action-request-icon icon-add-friend" />
                  {t("Don't cancel")}
                </div>
                {isCancelLoading
                  ? (
                    <div className="action-request decline with-text">
                      <Loading show={isCancelLoading} size="16px" />
                    </div>
                  )
                  : (
                    <div className="action-request decline with-text" onClick={handleCancel}>
                      <DeleteSVG className="action-request-icon icon-add-friend" />
                      {t('Cancel booking')}
                    </div>
                  )}
              </div>
              <div className="popup-close-button" onClick={() => setShowCancel(false)}>
                <CrossSVG className="popup-close-button-icon icon-cross" />
              </div>
            </Modal>
            <div className="booking-info">
              <div className="booking-header-container">
                <p className="booking-status-title">
                  {booking.event?.type === EventType.FREE_FLOW
                    ? <span>{(booking.title || t('Free Flow Session'))}</span>
                    : <MyBookingItem booking={booking} />}
                </p>
                <div className="booking-status-container">
                  <div className={`booking-status ${booking.status}`}>
                    {t(statusMessage || booking.status)}
                  </div>
                </div>
              </div>
              <div>
                {DateTime.fromISO(booking.event?.startAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
              </div>
              {!!eventSession.description && (
                <div className="booking-description-text">
                  {eventSession.description || '-'}
                </div>
              )}
              <div className="booking-details">
                <div className="booking-details-text">
                  {t('Given name')}
                  :
                  {' '}
                  {booking.givenName}
                </div>
                <div className="booking-details-text">
                  {t('Family name')}
                  :
                  {' '}
                  {booking.familyName}
                </div>
                <div className="booking-details-text">
                  {t("Guardian's name")}
                  :
                  {' '}
                  {booking.guardianName || '-'}
                </div>
                <div className="booking-details-text">
                  {t('Email')}
                  :
                  {' '}
                  {booking.email}
                </div>
              </div>
              {(booking.status !== BookingStatusType.CANCELLED) && (
                <div className="cancel-button" onClick={() => { setShowCancel(true); }}>
                  <DeleteSVG className="cancel-icon" />
                  {t('Cancel Booking')}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default PublicCancel;
