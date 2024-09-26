import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './member.scss';

import UserInfoBanner from 'src/components/common/user-info-banner/user-info-banner';
import BadgeItem from 'src/components/views/badges/badge-item';
import ProjectItem from 'src/components/views/projects/project-item';
import ChatSection from 'src/components/common/chat-section/chat-section';

import Explorer from 'src/css/imgs/boom-imgs/profile/explorer.png';
import Vivinaut from 'src/css/imgs/boom-imgs/profile/vivinaut.png';

import { ReactComponent as ChevronSvg } from 'src/css/imgs/icon-chevron-right.svg';

import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import UserApi from 'src/apis/viviboom/UserApi';
import ProjectApi from 'src/apis/viviboom/ProjectApi';
import BadgeApi from 'src/apis/viviboom/BadgeApi';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import MembersProject from 'src/components/views/members/completed-projects/member-completed-projects';
import MembersWipProjects from 'src/components/views/members/member-wip-projects/member-wip-projects';
import MembersBadges from 'src/components/views/members/badges/member-badges';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import { ChallengeOrderType } from 'src/enums/ChallengeOrderType';
import ChallengeItem from '../challenges/challenge-item';
import MembersChallenges from './member-challenges.jsx/member-challenges';

const DEFAULT_PROJECT_LIMIT = 3;
const DEFAULT_BADGE_LIMIT = 4;
const DEFAULT_CHALLENGE_LIMIT = 3;

function Member() {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const params = useParams();
  const { id } = params;
  const location = useLocation();

  const user = useSelector((state) => state?.user);

  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(false);
  const [tabId, setTabId] = useState(1);
  const [isChat, setIsChat] = useState();

  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [wipProjects, setWipProjects] = useState([]);

  const [badgeCount, setBadgeCount] = useState(0);
  const [challengeCount, setChallengeCount] = useState(0);
  const [completedProjectCount, setCompletedProjectCount] = useState(0);
  const [wipProjectCount, setWipProjectCount] = useState(0);

  const chatRef = useRef();

  // API calls
  const fetchMember = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
    setMember(null);
    const requestParams = {
      authToken: user.authToken,
      userId: id,
    };
    if (user?.id === Number(id)) requestParams.verboseAttributes = ['wallet'];
    try {
      const res = await UserApi.get(requestParams);
      setMember(res.data?.user);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, user?.id, user?.authToken]);

  const fetchProjects = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_PROJECT_LIMIT,
      order: ProjectOrderType.LATEST,
      authorUserId: id,
      isPublished: true,
      isCompleted: true,
    };

    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setProjects(res.data?.projects);
      setCompletedProjectCount(res.data?.count);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, id]);

  const fetchWipProjects = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_PROJECT_LIMIT,
      order: ProjectOrderType.LATEST,
      authorUserId: id,
      isPublished: true,
      isCompleted: false,
    };
    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setWipProjects(res.data?.projects);
      setWipProjectCount(res.data?.count);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, id]);

  const fetchBadges = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_BADGE_LIMIT,
      order: BadgeOrderType.LATEST,
      awardedUserId: id,
      verboseAttributes: ['awardedUsers'],
    };
    setLoading(true);
    try {
      const res = await BadgeApi.getList(requestParams);
      setBadges(res.data?.badges);
      setBadgeCount(res.data?.count);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, id]);

  const fetchChallenges = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_CHALLENGE_LIMIT,
      order: ChallengeOrderType.LATEST,
      awardedUserId: id,
      verboseAttributes: ['awardedUsers'],
    };
    setLoading(true);
    try {
      const res = await ChallengeApi.getList(requestParams);
      setChallenges(res.data?.challenges);
      setChallengeCount(res.data?.count);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, id]);

  const updatePublicPortfolio = async (isActivate) => {
    if (!user?.authToken) return;
    try {
      await UserApi.patch({
        userId: id,
        authToken: user.authToken,
        isPublicPortfolioActivated: isActivate,
      });
      await UserReduxActions.fetch();
      if (!isActivate) toast.success(t('You public portfolio has been disabled'));
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchWipProjects();
  }, [fetchWipProjects]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useEffect(() => {
    if (isChat) {
      document.getElementById('member-chat').focus();
    }
    setIsChat(false);
  }, [isChat]);

  useEffect(() => {
    if (location.state === undefined) return;
    if (location.state?.badgeTab) setTabId(2);
    else if (location.state?.challengeTab) setTabId(3);
    else if (location.state?.projectTab) setTabId(1);
  }, [location.state]);

  return (
    <div className="member">
      <Joyride sectionType={TutorialSectionType.MEMBER} />
      <div className="member-content-top">
        {member && <UserInfoBanner member={member} setTabId={setTabId} setIsChat={setIsChat} />}
      </div>
      {tabId === 1 && (
        <div className="member-content-bottom">
          <div className={tabId === 1 ? 'member-content-left' : 'member-content-left-none'}>
            {member?.id === user?.id && (
              <div className="content-left-section">
                <div className="header">{user?.institutionId ? t('VIVINAUT Control Panel') : t('VIVIBOOM Control Panel')}</div>
                <div className="desc-ctn">
                  <div className="new-project-button-container">
                    <Link className="new-project-button" to="/submit-project">
                      <p className="new-project-button-text-add">+</p>
                      <p className="new-project-button-text">{t('Add New Project')}</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {user?.institutionId === 1 && (
              <div className="content-left-section">
                <div className="header">{t('Status')}</div>
                <div className="desc-ctn">
                  {!member ? '-' : (
                    <>
                      <img className="user-profile-country status" alt="status" src={member?.status === 'VIVINAUT' ? Vivinaut : Explorer} />
                      <div className="description status">{member?.status === 'VIVINAUT' ? 'Vivinaut' : 'Explorer'}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="content-left-section">
              <div className="header">{t('About Me')}</div>
              <div className="desc-ctn">
                <div className="description">{(member?.description) || '-'}</div>
              </div>
            </div>
            {user?.institutionId === 1 && user?.branch?.allowVivicoinRewards && member?.id === user?.id && (
            <div className="content-left-section">
              <div className="header">{t('My Wallet')}</div>
              <div className="desc-ctn">
                {member?.wallet ? (
                  <div className="description">{t('VIVICOINWithCount', { count: member?.wallet?.balance || 0 })}</div>
                ) : (
                  <div className="description">{t('Please approach our crew to create your wallet!')}</div>
                )}
              </div>
            </div>
            )}
            {member?.id === user?.id && (
            <div className="content-left-section">
              <div className="header">{t('My Portfolio')}</div>
              <div className="desc-ctn portfolio">
                {user.isPublicPortfolioActivated ? (
                  <>
                    <Link to="/edit-portfolio" className="portfolio-button">
                      {t('Edit Public Portfolio')}
                    </Link>
                    <Link to={`/view-portfolio/${id}`} className="portfolio-button">
                      {t('View Public Portfolio')}
                    </Link>
                    <Link to={`/member/${id}`} className="portfolio-button disabled" onClick={() => updatePublicPortfolio(false)}>
                      {t('Disable Public Portfolio')}
                    </Link>
                  </>
                ) : (
                  <Link to="/edit-portfolio" className="portfolio-button" onClick={() => updatePublicPortfolio(true)}>
                    {t('Create Public Portfolio')}
                  </Link>
                )}
              </div>
            </div>
            )}
            <div ref={chatRef}>
              {member && member?.id !== user.id && (
              <div className="member-chat">
                <div className="header">{t('Talk to me')}</div>
                <ChatSection targetUsers={[member]} user={user} />
              </div>
              )}
            </div>
          </div>
          <div className="member-content-right">
            <div className="body">
              <div className="member-badges">
                <div className="title-container">
                  <div className="header">{t('Badges')}</div>
                  {badgeCount > 4 && (
                    <div className="more-button" onClick={() => setTabId(2)}>
                      <div className="more-text">{t('{{count}} more badges', { count: +badgeCount - DEFAULT_BADGE_LIMIT })}</div>
                      <ChevronSvg className="more-icon" />
                    </div>
                  )}
                </div>
                {badges.length > 0 ? (
                  <ul className="badge-list">
                    {badges.map((v) => (
                      <li key={`user-badge_${v.id}`}>
                        <BadgeItem id={v.id} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-items">{t('No badges have been earned by this member yet')}</div>
                )}
              </div>

              <div className="member-challenges">
                <div className="title-container">
                  <div className="header">{t('Challenges')}</div>
                  {challengeCount > 3 && (
                    <div className="more-button" onClick={() => setTabId(3)}>
                      <div className="more-text">{t('{{count}} more challenges', { count: +challengeCount - DEFAULT_CHALLENGE_LIMIT })}</div>
                      <ChevronSvg className="more-icon" />
                    </div>
                  )}
                </div>
                {challenges.length > 0 ? (
                  <ul className="challenge-list">
                    {challenges.map((v) => (
                      <li key={`user-challenge${v.id}`}>
                        <ChallengeItem id={v.id} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-items">{t('This member is just getting started — no challenges completed yet!')}</div>
                )}
              </div>

              <div className="member-projects">
                <div className="title-container">
                  <div className="header">{t('Completed Projects')}</div>
                  {completedProjectCount > 3 && (
                  <div className="more-button" onClick={() => setTabId(4)}>
                    <div className="more-text">{t('{{count}} more projects', { count: +completedProjectCount - DEFAULT_PROJECT_LIMIT })}</div>
                    <ChevronSvg className="more-icon" />
                  </div>
                  )}
                </div>
                {projects.length > 0 ? (
                  <ul className="projects">
                    { projects.map((v) => (
                      <li key={`user-project+${v.id}`}>
                        <ProjectItem preloadedData={v} id={v.id} hideProfile />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-items">{t('No projects have been created by this member yet')}</div>
                )}
              </div>

              <div className="member-projects">
                <div className="title-container">
                  <div className="header">{t('Work-In-Progress Projects')}</div>
                  {wipProjectCount > 3 && (
                    <div className="more-button" onClick={() => setTabId(5)}>
                      <div className="more-text">{t('{{count}} more projects', { count: +wipProjectCount - 3 })}</div>
                      <ChevronSvg className="more-icon" />
                    </div>
                  )}
                </div>
                {wipProjects.length > 0 ? (
                  <ul className="projects">
                    {wipProjects.map((v) => (
                      <li key={`user-project+${v.id}`}>
                        <ProjectItem preloadedData={v} id={v.id} hideProfile />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-items">{t('No work-in-progress projects')}</div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
      {tabId === 2 && (
        <div className="member-content-bottom">
          <MembersBadges member={member} setTabId={setTabId} />
        </div>
      )}
      {tabId === 3 && (
        <div className="member-content-bottom">
          <MembersChallenges member={member} setTabId={setTabId} />
        </div>
      )}
      {tabId === 4 && (
        <div className="member-content-bottom">
          <MembersProject member={member} setTabId={setTabId} />
        </div>
      )}
      {tabId === 5 && (
        <div className="member-content-bottom">
          <MembersWipProjects member={member} setTabId={setTabId} />
        </div>
      )}
    </div>
  );
}

export default Member;
