import './notifications.scss';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NotificationItem from './notification-item';

function Notifications() {
  const { t } = useTranslation('translation', { keyPrefix: 'notifications' });
  const notificationsAll = useSelector((state) => state?.notification?.all);

  const [seenNotifs, setSeenNotifs] = useState([]);
  const [unSeenNotifs, setUnseenNotifs] = useState([]);

  useEffect(() => {
    setSeenNotifs((notificationsAll || []).filter((notif) => notif.seen).map((notif) => notif));
    setUnseenNotifs((notificationsAll || []).filter((notif) => !notif.seen).map((notif) => notif));
  }, [notificationsAll]);

  return (
    <div className="notifications">
      <p className="section-title">{t('New Notifications')}</p>
      <div className="notif-items-section">
        {unSeenNotifs.length === 0
          ? <p className="section-text">{t('There are no new notifications!')}</p>
          : unSeenNotifs.map((v) => <NotificationItem notification={v} key={`notif-${v.id}`} />)}
      </div>
      <p className="section-title">{t('Other Notifications')}</p>
      <div className="notif-items-section">
        {seenNotifs.length === 0
          ? <p className="section-text">{t('There are no notifications!')}</p>
          : seenNotifs.map((v) => <NotificationItem notification={v} key={`notif-${v.id}`} />)}
      </div>
    </div>
  );
}

export default Notifications;
