import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-multi-carousel';

import './public-about-tab.scss';

import { ReactComponent as LeftSvg } from 'src/css/imgs/left-arrow.svg';
import { ReactComponent as RightSvg } from 'src/css/imgs/right-arrow.svg';
import { ReactComponent as NextSvg } from 'src/css/imgs/icon-arrow-forward.svg';
import PublicProjectApi from 'src/apis/viviboom/PublicProjectApi';
import PublicUserApi from 'src/apis/viviboom/PublicUserApi';
import PublicBadgeApi from 'src/apis/viviboom/PublicBadgeApi';
import PublicEventApi from 'src/apis/viviboom/PublicEventApi';
import PublicChallengeApi from 'src/apis/viviboom/PublicChallengeApi';
import PublicProjectItem from './public-project-item';
import PublicBadgeItem from './public-badge-item';
import BadgeModal from '../my-account/public-portfolio/badge-modal';
import PublicEventItem from './public-event-item';
import PublicMemberItem from './public-member-item';
import PublicChallengeItem from './public-challenge-item';

function ButtonGroup({ next, previous }) {
  return (
    <div className="carousel-button-group">
      <div className="arrow-button" onClick={() => previous()}>
        <LeftSvg className="category-arrow-icon" />
      </div>
      <div className="arrow-button" onClick={() => next()}>
        <RightSvg className="category-arrow-icon" />
      </div>
    </div>
  );
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    partialVisibilityGutter: 20,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 20,
  },
};

const DEFAULT_BADGE_ITEM_IMAGE_WIDTH = 256;
const DEFAULT_PROJECT_ITEM_IMAGE_WIDTH = 512;
const DEFAULT_EVENT_ITEM_IMAGE_WIDTH = 512;
const DEFAULT_COVER_IMAGE_SIZE = 512;
const DEFAULT_PROFILE_IMAGE_SIZE = 256;
const DEFAULT_LIMIT = 5;

function PublicAboutTab({ portfolio, setTab, setTabs }) {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const [selectedBadge, setSelectedBadge] = useState(null);

  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const fetchBadges = useCallback(async () => {
    if (!portfolio?.id) return;
    try {
      const res = await PublicBadgeApi.getList({
        institutionId: portfolio?.institutionId,
        limit: DEFAULT_LIMIT,
        imageWidth: DEFAULT_BADGE_ITEM_IMAGE_WIDTH,
        portfolioId: portfolio.id,
      });
      setBadges(res.data?.badges);
      if (res.data?.badges?.length > 0) setTabs((tab) => ({ ...tab, Badges: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  }, [portfolio?.institutionId, portfolio.id, setTabs]);

  const fetchChallenges = useCallback(async () => {
    if (!portfolio?.id) return;
    try {
      const res = await PublicChallengeApi.getList({
        institutionId: portfolio?.institutionId,
        limit: DEFAULT_LIMIT,
        imageWidth: DEFAULT_BADGE_ITEM_IMAGE_WIDTH,
        portfolioId: portfolio.id,
      });
      setChallenges(res.data?.challenges);
      if (res.data?.challenges?.length > 0) setTabs((tab) => ({ ...tab, Challenges: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  }, [portfolio?.institutionId, portfolio.id, setTabs]);

  const fetchProjects = useCallback(async () => {
    if (!portfolio?.id) return;
    try {
      const res = await PublicProjectApi.getList({
        institutionId: portfolio?.institutionId,
        limit: DEFAULT_LIMIT,
        imageWidth: DEFAULT_PROJECT_ITEM_IMAGE_WIDTH,
        portfolioId: portfolio.id,
      });
      setProjects(res.data?.projects);
      if (res.data?.projects?.length > 0) setTabs((tab) => ({ ...tab, Projects: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  }, [portfolio?.institutionId, portfolio.id, setTabs]);

  const fetchEvents = useCallback(async () => {
    if (!portfolio?.id) return;
    try {
      const res = await PublicEventApi.getList({
        institutionId: portfolio?.institutionId,
        limit: 3,
        imageWidth: DEFAULT_EVENT_ITEM_IMAGE_WIDTH,
        portfolioId: portfolio.id,
      });
      setEvents(res.data?.events);
      if (res.data?.events?.length > 0) setTabs((tab) => ({ ...tab, Events: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  }, [portfolio?.institutionId, portfolio.id, setTabs]);

  const fetchMembers = useCallback(async () => {
    if (!portfolio?.id) return;
    try {
      const res = await PublicUserApi.getList({
        institutionId: portfolio?.institutionId,
        profileImageWidth: DEFAULT_PROFILE_IMAGE_SIZE,
        coverImageWidth: DEFAULT_COVER_IMAGE_SIZE,
        portfolioId: portfolio.id,
        limit: 4,
      });
      setMembers(res.data?.users);
      if (res.data?.users?.length > 0) setTabs((tab) => ({ ...tab, Creators: true }));
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  }, [portfolio?.institutionId, portfolio.id, setTabs]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <>
      <div className="public-about-tab">
        <div className="about-me">
          <p className="portfolio-description">
            {portfolio?.description || '-'}
          </p>
        </div>
        {!!badges.length && (
          <div className="all-badges">
            <div className="section-title">
              {portfolio?.headingBadge || t('Badges')}
            </div>
            <div className="portfolio-badges-container">
              <div className="portfolio-badges">
                {badges.map((v) => (
                  <div key={`public-${portfolio?.id}-badge-${v.id}`} className="badge-item-container">
                    <PublicBadgeItem preloadedData={v} onClick={() => setSelectedBadge(v)} />
                  </div>
                ))}
              </div>
              <div className="portfolio-show-more" onClick={() => setTab('Badges')}>
                <div className="show-more-text">
                  {t('Show all badges')}
                </div>
                <NextSvg />
              </div>
            </div>
          </div>
        )}
        {!!challenges.length && (
          <div className="all-challenges">
            <div className="section-title">
              {portfolio?.headingChallenge || t('Challenges')}
            </div>
            <div className="portfolio-challenges-container">
              <div className="portfolio-challenges">
                {challenges.map((v) => (
                  <div key={`public-${portfolio?.id}-challenge-${v.id}`} className="challenge-item-container">
                    <PublicChallengeItem preloadedData={v} link={`/page/${portfolio?.code}/challenge/${v?.id}`} />
                  </div>
                ))}
              </div>
              <div className="portfolio-show-more" onClick={() => setTab('Challenges')}>
                <div className="show-more-text">
                  {t('Show all challenges')}
                </div>
                <NextSvg />
              </div>
            </div>
          </div>
        )}
        {!!projects.length && (
          <div className="all-projects">
            <div className="section-title">
              {portfolio?.headingProject || t('Projects')}
            </div>
            <div className="portfolio-projects-container">
              <div className="portfolio-projects">
                <Carousel
                  partialVisible
                  draggable={false}
                  showDots
                  renderButtonGroupOutside
                  transitionDuration={500}
                  keyBoardControl
                  arrows={false}
                  customButtonGroup={<ButtonGroup />}
                  responsive={responsive}
                  containerClass="project-horizontal-list"
                  removeArrowOnDeviceType={['tablet', 'mobile']}
                >
                  {projects.map((v) => (
                    <div key={`portfolio-project+${v.id}`}>
                      <PublicProjectItem id={v.id} preloadedData={v} link={`/page/${portfolio?.code}/project/${v?.id}`} />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="portfolio-show-more" onClick={() => setTab('Projects')}>
                <div className="show-more-text">
                  {t('Show all projects')}
                </div>
                <NextSvg />
              </div>
            </div>
          </div>
        )}
        {!!events.length && (
          <div className="all-events">
            <div className="section-title">
              {portfolio?.headingEvent || t('Events')}
            </div>
            <div className="portfolio-events-container">
              <div className="portfolio-events">
                {events.map((v) => (
                  <div key={`public-${portfolio?.id}-event-${v.id}`}>
                    <PublicEventItem eventSession={v} />
                  </div>
                ))}
              </div>
              <div className="portfolio-show-more" onClick={() => setTab('Events')}>
                <div className="show-more-text">
                  {t('Show all events')}
                </div>
                <NextSvg />
              </div>
            </div>
          </div>
        )}
        {!!members.length && (
          <div className="all-members">
            <div className="section-title">
              {portfolio?.headingUser || t('Creators')}
            </div>
            <div className="portfolio-members-container">
              <ul className="portfolio-members">
                {members.map((v) => (
                  <li key={`public-${portfolio?.id}-member-${v.id}`}>
                    <PublicMemberItem member={v} />
                  </li>
                ))}
              </ul>
              <div className="portfolio-show-more">
                <div className="show-more-text" onClick={() => setTab('Creators')}>
                  {t('Show all creator portfolios')}
                </div>
                <NextSvg />
              </div>
            </div>
          </div>
        )}
      </div>
      <BadgeModal show={!!selectedBadge} badge={selectedBadge} handleClose={() => setSelectedBadge(null)} />
    </>
  );
}

export default PublicAboutTab;
