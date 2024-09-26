import { DateTime } from 'luxon';
import i18n from 'src/translations/i18n';

export const dateTimeSince = (dateObj) => {
  const { t } = i18n;
  if (dateObj === null || dateObj === undefined || dateObj === '') {
    return '---';
  }

  const d = new Date(dateObj);
  const time = new Date();
  const dateDiff = time.getTime() - d.getTime();

  const secondsFromD2T = dateDiff / 1000;
  const secondsBetweenDates = Math.abs(secondsFromD2T);

  if (secondsBetweenDates <= 5) {
    return t('Now');
  } if (secondsBetweenDates <= 60) {
    const seconds = Math.floor(secondsBetweenDates);
    return `${(seconds !== 1) ? `${seconds} ${t('common.Seconds')}` : `${seconds} ${t('common.Second')}`} ${t('common.Ago')}`;
  } if (secondsBetweenDates < 3600) {
    const minutes = Math.floor(secondsBetweenDates / 60);
    return `${(minutes > 1) ? `${minutes} ${t('common.Minutes')}` : `${minutes} ${t('common.Minute')}`} ${t('common.Ago')}`;
  } if (secondsBetweenDates < 86400) {
    const hours = Math.floor(secondsBetweenDates / 60 / 60);
    return `${(hours > 1) ? `${hours} ${t('common.Hours')}` : `${hours} ${t('common.Hour')}`} ${t('common.Ago')}`;
  } if (secondsBetweenDates < 604800) { // 7 days
    const days = Math.floor(secondsBetweenDates / 60 / 60 / 24);
    return `${(days > 1) ? `${days} ${t('common.Days')}` : `${days} ${t('common.Day')}`} ${t('common.Ago')}`;
  }

  return DateTime.fromJSDate(d).toLocaleString(DateTime.DATETIME_MED);
};

export const prettifyDate = (dateObj) => {
  if (dateObj === null || dateObj === undefined || dateObj === '') {
    return '---';
  }

  const d = new Date(dateObj);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
  return formattedDate;
};
