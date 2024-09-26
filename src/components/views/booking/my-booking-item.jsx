import React from 'react';
import { useTranslation } from 'react-i18next';

function MyBookingItem({ booking }) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  return (
    <span className="bold">
      {t('Workshop')}
      :
      {' '}
      {booking.event.title}
    </span>
  );
}

export default MyBookingItem;
