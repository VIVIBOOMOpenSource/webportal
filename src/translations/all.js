import badges from './views/badges';
import booking from './views/booking';
import email from './views/email';
import entry from './views/entry';
import home from './views/home';
import members from './views/members';
import myAccount from './views/my-account';
import notifications from './views/notifications';
import projects from './views/projects';
import publicPortfolio from './views/public-portfolio';
import welcome from './views/welcome';
import common from './views/common';
import joyride from './common/joyride/joyride';
import reward from './views/reward';
import challenges from './views/challenges';

// TODO @Trevor
// In the event a translation is not there, it will display nothing. Implement a fallback language feature.
const convertToSingularLocale = (messages, locale) => {
  const singleLocale = { ...messages };

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const property in singleLocale) {
    if (property === locale) {
      return singleLocale[property];
    }
    if (typeof singleLocale[property] === 'object') {
      singleLocale[property] = convertToSingularLocale(singleLocale[property], locale);
    }
  }

  return singleLocale;
};

const translations = {
  general: {
    languageAbbreviation: {
      de: 'de',
      es: 'es',
      en: 'en',
      et: 'et',
      ja: 'ja',
      fr: 'fr',
      zh: 'zh',
      ch: 'ch',
      lt: 'lt',
      ph: 'ph',
    },
  },

  badges,
  challenges,
  booking,
  email,
  entry,
  home,
  members,
  myAccount,
  notifications,
  projects,
  publicPortfolio,
  welcome,
  common,
  joyride,
  reward,
};

export const english = convertToSingularLocale(translations, 'en');
export const japanese = convertToSingularLocale(translations, 'ja');
export const estonian = convertToSingularLocale(translations, 'et');
export const chinese = convertToSingularLocale(translations, 'ch');
export const lithuanian = convertToSingularLocale(translations, 'lt');
export const tagalog = convertToSingularLocale(translations, 'ph');

export const availableLanguages = [
  { name: 'English', nativeName: 'English', code: 'en' },
  { name: 'Japanese', nativeName: '日本語', code: 'ja' },
  { name: 'Estonian', nativeName: 'Eesti', code: 'et' },
  { name: 'Lithuanian', nativeName: 'Lietuvių', code: 'lt' },
  // { name: 'Tagalog', nativeName: 'Tagalog', code: 'ph' },
  // { name: 'Chinese', nativeName: '华语', code: 'ch' },
];
