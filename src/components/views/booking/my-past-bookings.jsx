import './my-past-bookings.scss';
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import BookingApi from 'src/apis/viviboom/BookingApi';
import { BookingStatusType } from 'src/enums/BookingStatusType';
import { EventType } from 'src/enums/EventType';

import Loading from '../../common/loading/loading';
import MyBookingItem from './my-booking-item';

const DEFAULT_LIMIT = 9;

function MyPastBookings() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);

  const [showPastBookings, setShowPastBookings] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pastBookings, setPastBookings] = useState([]);

  const fetchMorePastBookings = useCallback(async () => {
    if (page < totalPages) {
      setLoading(true);
      try {
        const requestParams = {
          authToken: user.authToken,
          userId: user.id,
          endDate: new Date().toISOString(),
          limit: DEFAULT_LIMIT,
          offset: pastBookings.length,
        };
        const res = await BookingApi.getList(requestParams);

        setPage((p) => p + 1);
        setPastBookings([...pastBookings, ...(res.data?.bookings || [])]);
        setTotalPages(res.data?.totalPages);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
  }, [page, totalPages, user.authToken, user.id, pastBookings]);

  if (!loading && showPastBookings && pastBookings.length === 0) return <p className="message">{t('You do not have any past bookings!')}</p>;
  return (
    <>
      <div className="notification-box-list">
        {pastBookings.map((v) => {
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
                </div>
                <div className="user-status-text">
                  {DateTime.fromISO(v.event.startAt).toFormat('h:mm a')}
                  {' '}
                  {v.event?.branch?.name}

                </div>
                <div className="user-status-text">{DateTime.fromISO(v.event.startAt).toLocaleString(DateTime.DATE_HUGE)}</div>
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
        {!loading && !showPastBookings && (
        <button
          type="button"
          onClick={() => {
            fetchMorePastBookings();
            setShowPastBookings(true);
          }}
        >
          {t('Show Past Bookings')}
        </button>
        )}
        {!loading && showPastBookings && page < totalPages && <button type="button" onClick={fetchMorePastBookings}>{t('Show More')}</button>}
        {!loading && showPastBookings && page === totalPages && (
        <button
          type="button"
          onClick={() => {
            setShowPastBookings(false);
            setPastBookings([]);
            setPage(0);
            setTotalPages(1);
          }}
        >
          {t('Hide Past Bookings')}
        </button>
        )}
      </div>
    </>
  );
}

export default MyPastBookings;
