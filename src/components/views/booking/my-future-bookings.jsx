import './my-future-bookings.scss';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import BookingApi from 'src/apis/viviboom/BookingApi';
import { BookingStatusType } from 'src/enums/BookingStatusType';
import { EventType } from 'src/enums/EventType';

import Loading from '../../common/loading/loading';
import Modal from '../../common/modal/modal';
import MyBookingItem from './my-booking-item';

import { ReactComponent as DeleteSVG } from '../../../css/imgs/icon-delete.svg';
import { ReactComponent as CrossSVG } from '../../../css/imgs/icon-cross.svg';
import { ReactComponent as CloseSVG } from '../../../css/imgs/icon-close.svg';

const DEFAULT_LIMIT = 9;

function MyFutureBookings() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [isCancelLoading, setCancelLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  const fetchLatestUpcomingBookings = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
    try {
      const requestParams = {
        authToken: user.authToken,
        userId: user.id,
        startDate: new Date().toISOString(),
        limit: DEFAULT_LIMIT,
        offset: 0,
      };
      const res = await BookingApi.getList(requestParams);
      setPage(1);
      setUpcomingBookings(res.data?.bookings);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, user.id]);

  const fetchMoreUpcomingBookings = useCallback(async () => {
    if (page < totalPages) {
      setLoading(true);
      try {
        const requestParams = {
          authToken: user.authToken,
          userId: user.id,
          startDate: new Date().toISOString(),
          limit: DEFAULT_LIMIT,
          offset: upcomingBookings.length,
        };
        const res = await BookingApi.getList(requestParams);
        setPage((p) => p + 1);
        setUpcomingBookings([...upcomingBookings, ...(res.data?.bookings || [])]);
        setTotalPages(res.data?.totalPages);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  }, [page, totalPages, user.authToken, user.id, upcomingBookings]);

  const fetchUpcomingBookings = useCallback(async () => {
    setLoading(true);
    try {
      const requestParams = {
        authToken: user.authToken,
        userId: user.id,
        startDate: new Date().toISOString(),
        limit: upcomingBookings.length,
        offset: 0,
      };
      const res = await BookingApi.getList(requestParams);
      setUpcomingBookings(res.data?.bookings);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [upcomingBookings.length, user.authToken, user.id]);

  useEffect(() => {
    fetchLatestUpcomingBookings();
  }, [fetchLatestUpcomingBookings]);

  const handleCancel = async () => {
    try {
      setCancelLoading(true);
      const res = await BookingApi.patch({ authToken: user.authToken, bookingId: selectedBooking.id, status: BookingStatusType.CANCELLED });

      if (res.data?.booking && res.data?.booking.status === BookingStatusType.CANCELLED) toast.success(t('You have successfully cancelled your booking'));
    } catch (err) {
      console.error(err);
    }

    setCancelLoading(false);
    await fetchUpcomingBookings(); // refresh

    setShowCancel(false);
    setSelectedBooking([]);
  };

  if (!loading && upcomingBookings.length === 0) return <p className="message">{t('You do not have any upcoming bookings!')}</p>;
  return (
    <>
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
      <div className="notification-box-list">
        {upcomingBookings.map((v) => {
          let status = v.status.toLowerCase();
          if (v.status === BookingStatusType.CANCELLED && v.isLateCancellation) status = 'late';

          const status2Description = {
            late: 'late cancellation',
            approved: 'booked',
            rejected: 'unsuccessful',
            submitted: 'pending confirmation',
          };

          return (
            <div key={`my-booking_${v.id}`} className={`notification-box ${status}`}>
              <div className="user-status">
                <div className="booking-item-header-container">
                  <p className="user-status-title">
                    {v.event?.type === EventType.FREE_FLOW
                      ? <span>{(v.event?.title || t('Free Flow Session'))}</span>
                      : <MyBookingItem booking={v} />}
                  </p>
                  {v.status !== BookingStatusType.CANCELLED && (
                    <div
                      className={`action-request-list ${status}`}
                      onClick={() => {
                        setShowCancel(true);
                        setSelectedBooking(v);
                      }}
                    >
                      <p className="action-request decline with-text">
                        <DeleteSVG className="action-request-icon icon-add-friend" />
                      </p>
                    </div>
                  )}
                </div>
                <div className="user-status-text">
                  {DateTime.fromISO(v.event?.startAt).toFormat('h:mm a')}
                  {' '}
                  {v.event?.branch?.name}
                </div>
                <div className="user-status-text">
                  {DateTime.fromISO(v.event?.startAt).toLocaleString(DateTime.DATE_HUGE)}
                </div>
              </div>
              <div className="booking-status-container">
                <div className={`booking-status ${status}`}>
                  {t(status2Description[status] || status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="show-more">
        {loading && <Loading show size="20px" />}
        {!loading && page < totalPages && <button type="button" onClick={fetchMoreUpcomingBookings}>{t('Show More')}</button>}
        {!loading && page === totalPages && page > 1 && <button type="button" onClick={fetchLatestUpcomingBookings}>{t('Show Less')}</button>}
      </div>
    </>
  );
}

export default MyFutureBookings;
