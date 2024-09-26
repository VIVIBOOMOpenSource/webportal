import React, {
  useEffect, useState, useRef, useCallback, useMemo,
} from 'react';
import './navi.scss';
import { Link, NavLink } from 'react-router-dom';

import UserReduxActions from 'src/redux/user/UserReduxActions';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import NotificationReduxActions from 'src/redux/notification/NotificationReduxActions';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { Player } from '@lottiefiles/react-lottie-player';
import builderPalAnim from 'src/css/lotties/builder-pal-landing.json';
import Explorer from 'src/css/imgs/boom-imgs/profile/explorer.png';
import Vivinaut from 'src/css/imgs/boom-imgs/profile/vivinaut.png';

import useHeaderState from '../../store/header';

import useOutsideClick from '../../utils/use-outside-click';

import { ReactComponent as InfoSvg } from '../../css/imgs/icon-info.svg';
import { ReactComponent as ProjectSvg } from '../../css/imgs/icon-document-text.svg';
import { ReactComponent as ProjectOutlineSvg } from '../../css/imgs/icon-document-text-outline.svg';
import { ReactComponent as BadgeOutlineSvg } from '../../css/imgs/icon-medal-outline.svg';
import { ReactComponent as BadgeSvg } from '../../css/imgs/icon-medal.svg';
import { ReactComponent as BookingSvg } from '../../css/imgs/icon-calendar-outline.svg';
import { ReactComponent as ChatSvg } from '../../css/imgs/icon-chatbubble-outline.svg';
import { ReactComponent as NotificationSvg } from '../../css/imgs/icon-notifications-outline.svg';
import { ReactComponent as CoinSvg } from '../../css/imgs/icon-coin.svg';
import { ReactComponent as PuzzleSvg } from '../../css/imgs/icon-puzzle-outline.svg';
import { ReactComponent as PuzzleFilledSvg } from '../../css/imgs/icon-puzzle-filled.svg';
import { ReactComponent as PersonCircleSvg } from '../../css/imgs/icon-person-outline-circle.svg';
import { ReactComponent as RewardSvg } from '../../css/imgs/icon-gift-outline.svg';
import { ReactComponent as SettingsOutlineSvg } from '../../css/imgs/icon-gear-outline.svg';
import { ReactComponent as LogoutOutlineSvg } from '../../css/imgs/icon-logout-outline.svg';
import { ReactComponent as PersonBookingSvg } from '../../css/imgs/icon-person-calendar.svg';
import { ReactComponent as PeopleOutlineSvg } from '../../css/imgs/icon-people-outline.svg';
import { ReactComponent as ChevronDown } from '../../css/imgs/icon-chevron-down.svg';

import { app } from '../../js/utils/app';
import Confetti from '../../js/vendor/confetti';
import RandomConfetti from '../../js/vendor/randomConfetti';
import DefaultProfilePicture from '../../css/imgs/boom-imgs/profile/default-profile-picture.png';
import ViviboomLogo from '../../css/imgs/viviboom-logo.png';

import MyImage from '../common/MyImage';
import NaviLanguageModal from './navi-language-modal';
import Joyride from '../common/joyride/joyride';
import { ChatContext } from '../views/chat/context/ChatContext';
import NaviPublic from './navi-public';

const DEFAULT_PROFILE_IMAGE_SIZE = 64;
const DEFAULT_POPUP_IMAGE_SIZE = 256;

function Navi() {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'common' });
  const user = useSelector((state) => state?.user);
  const notificationsUnpresented = useSelector((state) => state?.notification?.unpresented);
  const notificationsAll = useSelector((state) => state?.notification?.all);
  const { header } = useHeaderState();
  const [notifToPresent, setNotifToPresent] = useState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const userDropDownRef = useRef();
  const [naviRoutes, setNaviRoutes] = useState();

  const availableRoutes = useMemo(() => [
    {
      name: 'badges',
      display: 'Badges',
      path: '/badges',
      icon: <BadgeOutlineSvg />,
    },
    {
      name: 'challenges',
      display: 'Challenges',
      path: '/challenges',
      icon: <PuzzleSvg />,
    },
    {
      name: 'projects',
      display: 'Projects',
      path: '/projects',
      icon: <ProjectOutlineSvg />,
    },
    {
      name: 'members',
      display: user?.institutionId === 1 ? 'Members' : 'Creators',
      path: '/members',
      icon: <PeopleOutlineSvg />,
    },
    {
      name: 'booking',
      display: 'Booking',
      path: '/events',
      icon: <BookingSvg />,
    },
    {
      name: 'rewards',
      display: 'Rewards',
      path: '/wallet',
      icon: <RewardSvg />,
    },
  ], [user?.institutionId]);

  useEffect(() => {
    if (user.authToken) NotificationReduxActions.fetch();
  }, [user.authToken]);

  useOutsideClick(userDropDownRef, () => {
    if (showDropdown) setShowDropdown(false);
  });

  const unseenNotificationCount = useMemo(() => {
    let count = 0;
    notificationsAll?.forEach((elem) => !elem.seen && count++);
    return count;
  }, [notificationsAll]);

  const onNotificationsPress = useCallback(() => {
    setShowNotifications(!showNotifications);
    const notificationIds = (notificationsAll || []).filter((notif) => !notif.seen && !notif.present).map((notif) => notif.id);
    if (notificationIds?.length) NotificationReduxActions.markSeen({ notificationIds });
  }, [notificationsAll, showNotifications]);

  const menuClass = header.menuOpen ? ' open' : ' close';

  const badgeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  // Load confetti plugin
  useEffect(() => {
    const nodes = document.querySelectorAll('#xm-popup-background');
    nodes?.forEach((node) => node.remove());

    app.plugins.createPopup({
      container: '.popup',
      trigger: '.popup-trigger',
      sticky: true,
      overlay: {
        color: '21, 21, 31',
        opacity: 0.7,
        onEsc: true,
      },
      animation: {
        type: 'translate-in-fade',
        speed: 0.3,
        translateOffset: 40,
      },
    });

    Confetti();
  }, []);

  useEffect(() => {
    document.querySelector('.popup-trigger')?.addEventListener('click', () => RandomConfetti());
  }, []);

  useEffect(() => {
    if (!notificationsUnpresented?.length) return;
    const [_notifToPresent] = notificationsUnpresented;
    if (notifToPresent?.id === _notifToPresent.id) return;
    setNotifToPresent(_notifToPresent);
    document.querySelector('.popup-trigger').click();
    const bgArr = document.querySelectorAll('#xm-popup-background');
    if (bgArr.length > 1) {
      bgArr[1].click();
    }
  }, [notificationsUnpresented, notifToPresent]);

  useEffect(() => {
    const hideConfetti = async () => {
      if (notifToPresent) {
        await NotificationReduxActions.markSeen({ notificationIds: [notifToPresent?.id] });

        const prevConfetti = document.querySelectorAll('.fetti');
        prevConfetti.forEach((fetti) => (fetti.style.visibility = 'hidden'));

        const bgArr = document.querySelectorAll('#xm-popup-background');
        if (bgArr.length > 1) {
          bgArr[1].click();
        }
      }
      setNotifToPresent(null);
    };

    document.querySelector('#xm-popup-background')?.addEventListener('click', hideConfetti);
    return () => {
      document.querySelector('#xm-popup-background')?.removeEventListener('click', hideConfetti);
    };
  }, [notifToPresent]);

  useEffect(() => {
    if (user?.branch?.allowVivicoinReward && user.authToken) UserReduxActions.fetchWallet();
  }, [showDropdown, user.authToken, user?.branch?.allowVivicoinReward]);

  useEffect(() => {
    const routesArr = availableRoutes.filter((v) => {
      if (v.path === '/wallet' && (!user?.branch?.allowVivicoinRewards || !user?.institution?.isRewardEnabled)) return null;
      if (v.path === '/events' && !user?.branch?.allowEventBooking) return null;
      return v;
    });
    if (routesArr.length === 3) {
      const tempMemberRoute = routesArr.splice(routesArr.indexOf((v) => v.path === '/members'))[0];
      routesArr.splice(1, 0, tempMemberRoute);
    }
    setNaviRoutes(routesArr);
  }, [availableRoutes, user?.branch?.allowEventBooking, user?.branch?.allowVivicoinRewards, user?.institution?.isRewardEnabled]);

  if (!user.authToken) return <NaviPublic />;

  return (
    <div className={`navi${menuClass}`}>
      <div className="popup-trigger" />
      <div className="popup">
        <figure className="popup-content">
          <MyImage
            src={notifToPresent?.badge?.imageUri || notifToPresent?.project?.imageUri || notifToPresent?.event?.imageUri}
            width={DEFAULT_POPUP_IMAGE_SIZE}
            params={badgeImageParams}
          />
          {
            notifToPresent?.type === 'BADGE_AWARD'
              ? (
                <h3 className="popup-text">
                  <Trans i18nKey="common.badgeEarned">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Woohoo! You've earned the <span className="popup-text-highlight">{{ name: notifToPresent?.badge?.name || '-' }}</span>badge!
                  </Trans>
                </h3>
              ) : null
          }
          {
            notifToPresent?.type === 'CHALLENGE_AWARD'
              ? (
                <h3 className="popup-text">
                  <Trans i18nKey="common.newChallenge">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Nice! You've just completed the <span className="popup-text-highlight">{{ name: notifToPresent?.badge?.name || '-' }}</span>challenge!
                  </Trans>
                </h3>
              ) : null
          }
          {
            notifToPresent?.type === 'PROJECT_BADGE_APPROVAL'
              ? (
                <h3 className="popup-text">
                  <Trans i18nKey="common.projectApproved">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Woohoo! Your project, <span className="popup-text-highlight">{{ name: notifToPresent?.project?.name || '-' }}</span>, has been approved!
                  </Trans>
                </h3>
              ) : null
          }
          {
            notifToPresent?.type === 'STARTER_CRITERIA_COMPLETION'
              ? (
                <div>
                  <Player
                    autoplay
                    loop
                    src={builderPalAnim}
                    style={{ height: '400px', width: '400px' }}
                  />
                  <h3 className="popup-text">
                    <Trans i18nKey="common.starterCriteriaCompleted">
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      Congratulations! You are now a VIVINAUT! Welcome to the VIVITA Family
                    </Trans>
                  </h3>
                </div>
              ) : null
          }
        </figure>
      </div>
      <div className="starter-criteria-popup">
        <figure className="popup-content" />
      </div>
      <div className="navi-main">
        {/* welcome logo with link */}
        <div className="logo">
          <Link to={user.id ? '/' : '/welcome'}>
            <img className="logo-image" alt="logo" src={ViviboomLogo} />
          </Link>
        </div>
        <Link className="profile-container-mobile" to={`/member/${user.id}`}>
          <span className="icon">
            <MyImage
              className="image"
              src={user.profileImageUri}
              alt="profile"
              defaultImage={DefaultProfilePicture}
              width={DEFAULT_PROFILE_IMAGE_SIZE}
            />
          </span>
          <div className="text-container">
            <div className="text">{user.username}</div>
            {user?.institutionId === 1 && (
            <div className="others-container">
              <div className="status-container">
                <div className="text-status">{user.status}</div>
                <img className="status-img" alt="status" src={user?.status === 'VIVINAUT' ? Vivinaut : Explorer} />
              </div>
            </div>
            )}
          </div>
        </Link>
        <div className="stats-container-mobile">
          <Link className="badges-container" to={{ pathname: `/member/${user?.id}`, state: { badgeTab: true, projectTab: false, challengeTab: false } }}>
            <div className="icon-amount-container">
              <BadgeSvg className="badges-icon" />
              <div className="stats-number">{user.badgeCount || 0}</div>
            </div>
            <div className="stats-number-unit">{t('badges', { count: user.badgeCount || 0 })}</div>
          </Link>
          <Link className="challenges-container" to={{ pathname: `/member/${user?.id}`, state: { badgeTab: false, projectTab: false, challengeTab: true } }}>
            <div className="icon-amount-container">
              <PuzzleFilledSvg className="challenges-icon" />
              <div className="stats-number">{user.challengeCount || 0}</div>
            </div>
            <div className="stats-number-unit">{t('challenges', { count: user.challengeCount || 0 })}</div>
          </Link>
          <Link className="projects-container" to={{ pathname: `/member/${user?.id}`, state: { badgeTab: false, projectTab: true, challengeTab: false } }}>
            <div className="icon-amount-container">
              <ProjectSvg className="projects-icon" />
              <div className="stats-number">{user.projectCount || 0}</div>
            </div>
            <div className="stats-number-unit">{t('projects', { count: user?.projectCount || 0 })}</div>
          </Link>
        </div>
        <hr className="divider" />
        <div className="navi-bottom">
          <nav>
            <Joyride
              sectionType={TutorialSectionType.NAVI}
              outsideRun={window.innerWidth >= 980 && window.location.pathname === '/'}
            />
            <ul className="routes-ul">
              {/* main routes section in web and mobile view */}
              <div className="routes-section">
                {naviRoutes?.map((item) => {
                  if (
                    item.admin !== undefined
                  && user?.staffRoles?.length > 0
                  ) {
                    return <li key={`navi-route_${item.name}`} className="empty" />;
                  }
                  return (
                    <li className="navi-list-item" key={`navi-route_${item.name}`}>
                      <NavLink to={item.path} className={item.name}>
                        <div className="item-container">
                          <i className="item-icon">{item.icon !== undefined ? item.icon : <InfoSvg />}</i>
                          <div className="item-title">{t(item.display)}</div>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </div>
              {/* profile routes for mobile web view */}
              <div className="routes-section">
                <li className="navi-list-item hide-on-desktop">
                  <NavLink className="my-profile" to={`/member/${user?.id}`}>
                    <i className="item-icon"><PersonCircleSvg className="mobile-icon" /></i>
                    <div className="my-profile-title">{t('My Profile')}</div>
                  </NavLink>
                </li>
                {user?.branch?.allowEventBooking && (
                  <li className="navi-list-item hide-on-desktop">
                    <NavLink className="my-bookings" to="/my-bookings">
                      <i className="item-icon"><PersonBookingSvg className="mobile-my-bookings-icon-person" /></i>
                      <div className="my-bookings-title">{t('My Bookings')}</div>
                    </NavLink>
                  </li>
                )}
                {user?.branch?.allowVivicoinRewards && (
                  <li className="navi-list-item hide-on-desktop">
                    <NavLink className="my-wallet" to="/wallet">
                      <i>
                        <CoinSvg className="item-icon" />
                      </i>
                      <div className="wallet-text-container">
                        <div className="wallet-icon-text">{t('VIVICOIN')}</div>
                        <div className="wallet-icon-text-sub">{t('coin', { count: user.wallet?.balance || 0 })}</div>
                      </div>
                    </NavLink>
                  </li>
                )}
                <li className="navi-list-item hide-on-desktop">
                  <NavLink className="my-notifications" to="/notifications">
                    <i className="item-icon"><NotificationSvg /></i>
                    <div className="my-notifications-title">{t('My Notifications')}</div>
                  </NavLink>
                </li>
                <li className="navi-list-item hide-on-desktop">
                  <ChatContext.Consumer>
                    {({ chatClient }) => !!chatClient && (
                    <NavLink className="chat" to="/chat">
                      <i className="item-icon"><ChatSvg className="mobile-icon" /></i>
                      <div className="chat-title">{t('Connect and Chat')}</div>
                    </NavLink>
                    )}
                  </ChatContext.Consumer>
                </li>
                <li className="navi-list-item hide-on-desktop">
                  <NavLink className="settings" to="/edit-profile">
                    <i className="item-icon"><SettingsOutlineSvg /></i>
                    <div className="settings-title">{t('Settings')}</div>
                  </NavLink>
                </li>
                <li className="navi-list-item hide-on-desktop">
                  <div className="logout" onClick={UserReduxActions.logout}>
                    <i className="item-icon"><LogoutOutlineSvg /></i>
                    <div className="logout-title">{t('Logout')}</div>
                  </div>
                </li>
              </div>
            </ul>
          </nav>
          <div className="user">
            <span className="user-options">
              <div className="navi-my-account" onClick={() => setShowDropdown(!showDropdown)}>
                {/* button for dropdown in website navi */}
                <div className={showDropdown ? 'my-account-dropdown-opened' : 'my-account-dropdown-closed'}>
                  <span className="icon">
                    <MyImage
                      className="image"
                      src={user.profileImageUri}
                      alt="profile"
                      defaultImage={DefaultProfilePicture}
                      width={DEFAULT_PROFILE_IMAGE_SIZE}
                    />
                  </span>
                  <span className="text">
                    {user.username}
                  </span>
                </div>
                {/* dropdown container in website navi */}
                <div className={`dropdown-content${showDropdown ? '' : ' hide'}`} ref={userDropDownRef}>
                  {/* profile section in dropdown container */}
                  <div className="dropdown-profile-info-container">
                    <Link className="profile-container" to={`/member/${user?.id}`}>
                      <span className="icon">
                        <MyImage
                          className="image"
                          src={user.profileImageUri}
                          alt="profile"
                          defaultImage={DefaultProfilePicture}
                          width={DEFAULT_PROFILE_IMAGE_SIZE}
                        />
                      </span>
                      <div className="text-container">
                        <div className="text">{user.username}</div>
                        {user?.institutionId === 1 && (
                        <div className="others-container">
                          <div className="status-container">
                            <div className="text-status">{user.status}</div>
                            <img className="status-img" alt="status" src={user?.status === 'VIVINAUT' ? Vivinaut : Explorer} />
                          </div>
                        </div>

                        )}
                      </div>
                    </Link>
                    <div className="stats-container">
                      <Link className="badges-container" to={{ pathname: `/member/${user?.id}`, state: { badgeTab: true, projectTab: false, challengeTab: false } }}>
                        <div className="icon-amount-container">
                          <BadgeSvg className="badges-icon" />
                          <div className="stats-number">{user.badgeCount || 0}</div>
                        </div>
                        <div className="stats-number-unit">{t('badges', { count: user.badgeCount || 0 })}</div>
                      </Link>
                      <Link className="challenges-container" to={{ pathname: `/member/${user?.id}`, state: { badgeTab: false, projectTab: false, challengeTab: true } }}>
                        <div className="icon-amount-container">
                          <PuzzleFilledSvg className="challenges-icon" />
                          <div className="stats-number">{user.challengeCount || 0}</div>
                        </div>
                        <div className="stats-number-unit">{t('challenges', { count: user.challengeCount || 0 })}</div>
                      </Link>
                      <Link className="projects-container" to={{ pathname: `/member/${user.id}`, state: { badgeTab: false, projectTab: true, challengeTab: false } }}>
                        <div className="icon-amount-container">
                          <ProjectSvg className="projects-icon" />
                          <div className="stats-number">{user.projectCount || 0}</div>
                        </div>
                        <div className="stats-number-unit">{t('projects', { count: user.projectCount || 0 })}</div>
                      </Link>
                    </div>
                  </div>
                  <hr className="divider" />
                  {/* options in dropdown container */}
                  <div className="dropdown-buttons-container">
                    <Link to={`/member/${user?.id}`}>
                      <div className="dropdown-button">
                        <PersonCircleSvg className="dropdown-profile-icon" />
                        <div className="dropdown-profile-icon-text">{t('My Profile')}</div>
                      </div>
                    </Link>
                    {user?.branch?.allowEventBooking && (
                      <Link to="/my-bookings">
                        <div className="dropdown-button">
                          <PersonBookingSvg className="dropdown-booking-icon" />
                          <div className="dropdown-bookings-icon-text">{t('My Bookings')}</div>
                        </div>
                      </Link>
                    )}
                    {user?.branch?.allowVivicoinRewards && (
                      <Link className="dropdown-button" to="/wallet">
                        <CoinSvg className="dropdown-coin-icon" />
                        <div className="dropdown-text-container">
                          <div className="dropdown-icon-text">{t('VIVICOIN')}</div>
                          <div className="dropdown-icon-text-sub">{t('coin', { count: user.wallet?.balance || 0 })}</div>
                        </div>
                      </Link>
                    )}
                    <Link className="dropdown-button" to="/edit-profile">
                      <SettingsOutlineSvg className="dropdown-icon" />
                      <div className="dropdown-icon-text">{t('Settings')}</div>
                    </Link>
                    <div className="dropdown-button" onClick={UserReduxActions.logout}>
                      <LogoutOutlineSvg className="dropdown-logout-icon" />
                      <div className="dropdown-logout-icon-text">{t('Logout')}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="navi-notifications" onClick={() => setShowLanguages(!showLanguages)}>
                <span className="lan-icon">
                  <div className="lan-code">{i18n.language.toUpperCase()}</div>
                  <i className="chevron-down-icon"><ChevronDown /></i>
                </span>
              </div>
              <span className="navi-notifications" onClick={onNotificationsPress}>
                <span className="notif-icon">
                  <span
                    className={
                        `badge${!unseenNotificationCount ? ' hide' : ' show'}`
                      }
                  >
                    {unseenNotificationCount}
                  </span>
                  <Link to="/notifications"><NotificationSvg /></Link>
                </span>
              </span>
              <ChatContext.Consumer>
                {({ chatClient, unreadCount }) => !!chatClient && (
                  <Link className="navi-notifications" to="/chat">
                    <span className="chat-icon">
                      <span
                        className={
                            `badge${!unreadCount ? ' hide' : ' show'}`
                          }
                      >
                        {unreadCount}
                      </span>
                      <ChatSvg />
                    </span>
                  </Link>
                )}
              </ChatContext.Consumer>
            </span>
          </div>
        </div>
        <span className="navi-gray-out-screen" />
      </div>
      <NaviLanguageModal show={showLanguages} handleClose={() => setShowLanguages(false)} />
    </div>
  );
}

export default Navi;
