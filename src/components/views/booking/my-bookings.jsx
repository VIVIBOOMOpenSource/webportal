import './my-bookings.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MyFutureBookings from './my-future-bookings';
import MyPastBookings from './my-past-bookings';

function MyBookings() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  return (
    <div className="mybooking">
      <div className="mybooking-header-container">
        <div className="mybooking-header-title-container">
          <p className="mybooking-title">{t('My Bookings')}</p>
          <p className="title-description">{t('View your sessions!')}</p>
        </div>
      </div>
      <div className="separator-container">
        <Link className="button" to="/events">
          {t('Book Here!')}
        </Link>
      </div>
      <div className="body">
        <div className="header">{t('Upcoming Bookings')}</div>
        <MyFutureBookings />

        <div className="header">{t('Past Bookings')}</div>
        <MyPastBookings />

      </div>
    </div>
  );
}

export default MyBookings;
