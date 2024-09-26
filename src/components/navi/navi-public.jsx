import React, { useState } from 'react';
import './navi-public.scss';
import { Link, NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import useHeaderState from '../../store/header';

import NaviLanguageModal from './navi-language-modal';
import ViViboomLogo from '../../css/imgs/viviboom-logo.png';

function NaviPublic() {
  const { i18n } = useTranslation('translation', { keyPrefix: 'common' });
  const { header } = useHeaderState();
  const [showLanguages, setShowLanguages] = useState(false);

  const menuClass = header.menuOpen ? ' open' : ' close';

  return (
    <div className={`public-navi${menuClass}`}>
      <div className="public-navi-main">
        <div className="logo">
          <Link to="/welcome">
            <img className="logo-image" alt="logo" src={ViViboomLogo} />
          </Link>
        </div>
        <div className="public-navi-bottom">
          <nav />
          <div className="user">
            <span className="public-user-options">
              <NavLink className="navi-notifications login" to="/welcome">
                <span className="text">Login</span>
              </NavLink>
              <div className="navi-notifications lang" onClick={() => setShowLanguages(!showLanguages)}>
                <span className="lan-icon">
                  <div className="lan-code">{i18n.language.toUpperCase()}</div>
                  <div className="downward-arrow">⌄</div>
                </span>
              </div>
            </span>
          </div>
        </div>
        <span className="navi-gray-out-screen" />
      </div>
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
    </div>
  );
}

export default NaviPublic;
