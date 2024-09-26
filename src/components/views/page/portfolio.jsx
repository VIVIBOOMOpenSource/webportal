import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import './portfolio.scss';

import DefaultBackground from 'src/css/imgs/background.jpg';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/badge/placeholder-square-s.jpeg';
import SkeletonBox from 'src/components/common/preloader/skeleton-box';
import PortfolioApi from 'src/apis/viviboom/PortfolioApi';
import PublicAboutTab from './public-about-tab';
import PublicBadgeTab from './public-badge-tab';
import PublicProjectTab from './public-project-tab';
import PublicEventTab from './public-event-tab';
import PublicMemberTab from './public-member-tab';
import PublicChallengeTab from './public-challenge-tab';

function Portfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const params = useParams();
  const { code } = params;
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState({
    About: true, Badges: false, Challenges: false, Projects: false, Events: false, Creators: false,
  });
  const [tab, setTab] = useState('About');

  const [portfolio, setPortfolio] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PortfolioApi.getList({ code, coverImageWidth: 1024 });
      if (res.data.portfolios.length > 0) {
        setPortfolio(res.data?.portfolios[0]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setLoading(false);
  }, [code]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  if (!loading && !portfolio) {
    return (
      <div className="page-not-found">
        {t('No Public Portfolio found')}
      </div>
    );
  }

  return (
    <div className="portfolio">
      <div className="portfolio-content-top">
        <div className="portfolio-cover-image">
          {loading ? <SkeletonBox /> : (
            <img
              src={portfolio?.coverImageUri || DefaultBackground}
              alt="No cover pic found"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = DefaultBackground;
              }}
            />
          )}
        </div>
        <div className="portfolio-basic-info">
          <div className="portfolio-profile-image-container">
            <div className="portfolio-profile-image">
              <img
                src={portfolio?.profileImageUri || DefaultProfilePicture}
                alt="profile"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = DefaultProfilePicture;
                }}
              />
            </div>
          </div>
          <div className="portfolio-title">
            {portfolio?.title || '-'}
          </div>
        </div>
        <div className="tab-container">
          <div className="tabs">
            {Object.keys(tabs).filter((key) => tabs[key]).map((key) => (
              <div key={key} className={`tab${tab === key ? ' selected' : ''}`} onClick={() => setTab(key)}>
                <div className="tab-text">
                  {t(key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {tab === 'About' && !loading && <PublicAboutTab portfolio={portfolio} setTab={setTab} setTabs={setTabs} />}
      {tab === 'Badges' && <PublicBadgeTab portfolio={portfolio} />}
      {tab === 'Challenges' && <PublicChallengeTab portfolio={portfolio} />}
      {tab === 'Projects' && <PublicProjectTab portfolio={portfolio} />}
      {tab === 'Events' && <PublicEventTab portfolio={portfolio} />}
      {tab === 'Creators' && <PublicMemberTab portfolio={portfolio} />}
    </div>
  );
}

export default Portfolio;
