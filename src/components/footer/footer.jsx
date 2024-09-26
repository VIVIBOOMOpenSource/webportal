import React from 'react';
import { useTranslation } from 'react-i18next';

import './footer.scss';
import VivitaLogo from '../../css/imgs/boom-imgs/vivitalogo.png';

function Footer() {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  return (
    <div className="footer">
      <div className="footer-main">
        <div className="terms">
          <span><a href="https://www.privacypolicies.com/live/c9a19128-a695-4660-8114-6185cdbc92c6" title="Terms Of Service">{t('Terms of Service')}</a></span>
          <br />
          <span><a href="https://www.privacypolicies.com/live/f674d17e-cfdf-40ec-9218-ec11549cc4a8" title="Privacy Policy">{t('Privacy Policy')}</a></span>
        </div>
        <div className="logo"><img alt="logo" src={VivitaLogo} /></div>
        <div className="copyright">
          {t('Copyright')}
          {' '}
          &copy;
          {' '}
          {new Date().getFullYear()}
          {' '}
          VIVITA Singapore Pte. Ltd.
          {' '}
          {t('All Rights Reserved.')}
          <br />
          <span>
            {t('Icons made by')}
            {' '}
            {' '}
            <a href="https://www.freepik.com" title="Freepik">Freepik</a>
            {' '}
            <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          </span>
        </div>
        <div className="credit" />
      </div>
    </div>
  );
}

export default Footer;
