import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import './badges.scss';

import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';

import { BuilderComponent } from '@builder.io/react';
import '@builder.io/widgets';

import BadgeApi from 'src/apis/viviboom/BadgeApi';
import BadgeCategoryApi from 'src/apis/viviboom/BadgeCategoryApi';
import StarterCriteriaApi from 'src/apis/viviboom/StarterCriteriaApi';

import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import { getBadgeBuilderModelName } from 'src/utils/countries';
import Pagination from 'src/components/common/pagination/pagination';
import Loading from 'src/components/common/loading/loading';
import { shuffle } from 'src/utils/object';
import { UserStatus } from 'src/enums/UserStatusType';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import BadgeRandomizer from './badge-randomizer';
import BadgeItem from './badge-item';

import { ReactComponent as SearchSvg } from '../../../css/imgs/icon-search.svg';

const DEFAULT_LIMIT = 20;

const rouletteTabId = 1;
const badgesTabId = 2;
const guidesTabId = 3;

function Badges() {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });
  const user = useSelector((state) => state.user);
  const userStatus = useSelector((state) => state?.user?.status);
  const branch = useSelector((state) => state?.user?.branch);

  const branchId = branch?.id;
  const starterBadgeRequirementCount = branch?.starterBadgeRequirementCount;
  const starterCriteriaEnabled = (
    (starterBadgeRequirementCount > 0 || branch?.starterChallengeRequirementCount > 0 || branch?.starterAttendanceRequirementCount > 0)
    && userStatus === UserStatus.EXPLORER
  );

  const [tabId, setTabId] = useState(rouletteTabId);
  const [randomizerBadges, setRandomizerBadges] = useState([]);
  const [badges, setBadges] = useState([]); // for all badges
  const [randomBadges, setRandomBadges] = useState([]);
  const [badgeCategories, setBadgeCategories] = useState([]);
  const [badgeCategoryId, setBadgeCategoryId] = useState(-1);

  const [starterBadges, setStarterBadges] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [randomizerLoading, setRandomizerLoading] = useState(false);
  const [badgesLoading, setBadgesLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [scroll, setScroll] = useState(1); // for infinite scroll
  const [totalScrolls, setTotalScrolls] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  const scrollToRef = useRef();

  const fetchBadgeCategories = useCallback(async () => {
    if (!user.authToken) return;
    setCategoriesLoading(true);
    try {
      const res = await BadgeCategoryApi.getList({ authToken: user.authToken });
      setBadgeCategories(res.data?.badgeCategories);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setCategoriesLoading(false);
  }, [user.authToken]);

  const getStarterBadges = useCallback(async () => {
    if (!user.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      branchId,
      limit: DEFAULT_LIMIT,
      isChallenge: false,
    };
    try {
      const res = await StarterCriteriaApi.getList(requestParams);
      setStarterBadges(res.data?.badges);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user.authToken, branchId]);

  const getRandomBadges = useCallback(async () => {
    if (!user.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      verboseAttributes: ['awardedUsers'],
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
    };

    setBadgesLoading(true);
    try {
      const res = await BadgeApi.getList(requestParams);
      setRandomBadges(shuffle(res.data?.badges));
      setTotalScrolls(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setBadgesLoading(false);
  }, [user.authToken]);

  const fetchMoreBadges = useCallback(async () => {
    if (!user.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      verboseAttributes: ['awardedUsers'],
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: randomBadges.length,
    };

    try {
      const res = await BadgeApi.getList(requestParams);
      setRandomBadges([...randomBadges, ...shuffle(res.data?.badges || [])]);
      setScroll((p) => p + 1);
      setTotalScrolls(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user.authToken, randomBadges]);

  // regular badge pagination
  const getBadges = useCallback(async () => {
    if (!user.authToken) return;
    setBadges([]);

    const requestParams = {
      authToken: user.authToken,
      verboseAttributes: ['awardedUsers'],
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
    };
    // if badgeCategoryId is undefined, fetch all badges, else:
    if (badgeCategoryId >= 0) requestParams.badgeCategoryId = badgeCategoryId;

    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.keywords = searchKeywords;

    setBadgesLoading(true);
    try {
      const res = await BadgeApi.getList(requestParams);
      setBadges(res.data?.badges);
      // console.log(res.data?.badges);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setBadgesLoading(false);
  }, [user.authToken, badgeCategoryId, page, searchKeywords]);

  // random badges for badge randomizer
  const getRandomizerBadges = useCallback(async () => {
    if (!user.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      order: BadgeOrderType.RANDOM,
    };

    setRandomizerLoading(true);
    try {
      const badgeRes = await BadgeApi.getList(requestParams);
      const challengeRes = await ChallengeApi.getList(requestParams);
      const badgeChallengesRes = [...badgeRes.data.badges, ...challengeRes.data.challenges];
      setRandomizerBadges(badgeChallengesRes);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setRandomizerLoading(false);
  }, [user.authToken]);

  useEffect(() => {
    getStarterBadges();
  }, [getStarterBadges]);

  useEffect(() => {
    fetchBadgeCategories();
  }, [fetchBadgeCategories]);

  useEffect(() => {
    getRandomizerBadges();
  }, [getRandomizerBadges]);

  useEffect(() => {
    getBadges();
  }, [getBadges]);

  useEffect(() => {
    getRandomBadges();
  }, [getRandomBadges]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (tabId !== badgesTabId) setTabId(badgesTabId);
    setBadgeCategoryId(-1);
    setSearchKeywords(searchInput);
    setPage(1);
    setSearchInput('');
  };

  return (
    <div className="badges">
      <Joyride
        sectionType={starterCriteriaEnabled ? TutorialSectionType.STARTER_CRITERIA : TutorialSectionType.BADGES}
      />
      <div className="badges-header-container">
        <div className="badges-header-title-container">
          <p className="badges-title">{t('Badges')}</p>
          <p className="title-description">{t('Earn a badge from the VIVIBOOM Universe!')}</p>
        </div>
      </div>

      <div className="separator-container">
        <div className="tabs-container">
          <div
            className={tabId === rouletteTabId ? 'tab-active' : 'tab'}
            onClick={() => setTabId(rouletteTabId)}
          >
            {t('Badges')}
          </div>
          <div
            className={tabId === badgesTabId ? 'tab-active' : 'tab'}
            onClick={() => setTabId(badgesTabId)}
          >
            {t('All Badges')}
          </div>
          {user?.institutionId === 1 && (
          <div
            className={tabId === guidesTabId ? 'tab-active' : 'tab'}
            onClick={() => setTabId(guidesTabId)}
          >
            {t('Guides')}
          </div>
          )}
        </div>
        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <div className={`search-bar${searchKeywords === '' ? '' : ' active'}`}>
            <input type="text" id="project-search" name="project_search" placeholder={t('Search Badges')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <button type="submit" className="search-button">
            <SearchSvg className="icon-search" />
          </button>
        </form>
      </div>

      <div className={starterCriteriaEnabled ? 'body starterBadges' : 'body'} style={{ display: tabId === 1 ? 'block' : 'none' }}>
        <div className={tabId === rouletteTabId ? 'home-content' : 'home-content-none'}>

          <div className="headers">
            {starterCriteriaEnabled ? <h6>{t('Starter Badges')}</h6> : <h6>{t('Badges')}</h6>}
            {starterCriteriaEnabled && starterBadges.length === starterBadgeRequirementCount && <h4>{t('whereToStartAll')}</h4>}
            {starterCriteriaEnabled && starterBadges.length !== starterBadgeRequirementCount && <h4>{t('whereToStart', { count: starterBadgeRequirementCount })}</h4>}
            {!starterCriteriaEnabled && <h4>{t('Browse through random badges here!')}</h4>}
          </div>
          <div className="badges-div">
            <div className="badges-div-content">
              <div className="badges-shown">
                <Loading show={badgesLoading || randomizerLoading} size="24px" />
                <InfiniteScroll
                  className="badge-list"
                  dataLength={randomBadges.length}
                  next={fetchMoreBadges}
                  hasMore={scroll < totalScrolls}
                  loader={<Loading show size="40px" />}
                >
                  {starterCriteriaEnabled && starterBadges.map((v) => (
                    <div className="show" key={`badge-${v.id}`}>
                      <BadgeItem
                        preloadedData={v}
                        id={v.id}
                        hideDescription
                      />
                    </div>
                  ))}
                  {!starterCriteriaEnabled && randomBadges.map((v) => (
                    <div className="show" key={`badge-${v.id}`}>
                      <BadgeItem
                        preloadedData={v}
                        id={v.id}
                        hideDescription
                      />
                    </div>
                  ))}

                </InfiniteScroll>
                {starterCriteriaEnabled
                  ? (
                    <div>
                      <p style={{
                        textAlign: 'center', color: '#fff', margin: '15px', fontSize: '18px',
                      }}
                      >
                        {starterBadges.length > 0 && <b>{t('Check out the badges you can earn once you become a VIVINAUT!')}</b>}
                      </p>
                      <button className="view-all-badges-button" type="button" onClick={() => { setTabId(badgesTabId); window.scrollTo(0, 0); }}>
                        {t('View all badges')}
                      </button>
                    </div>
                  )
                  : (
                    <div className="end-message">
                      <p style={{ textAlign: 'center' }}>
                        {randomBadges.length > 0 && <b>{t('Yay! You have seen it all')}</b>}
                      </p>
                    </div>
                  )}
              </div>
              {!starterCriteriaEnabled && (
              <div className="randomizer-ctn">
                <BadgeRandomizer badges={randomizerBadges} />
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="body" style={{ display: tabId === 1 ? 'none' : '' }}>
        <div className={tabId === badgesTabId ? 'home-content' : 'home-content-none'} ref={scrollToRef}>

          <h6>{t('All Badges')}</h6>
          <h4>{t("Let's add to your badge collection here!")}</h4>
          <div className="badges-div">
            <div className="badges-div-content">
              <div className="categories">
                <Loading show={categoriesLoading} size="24px" />
                <ul>
                  <li
                    className={badgeCategoryId === -1 ? 'active' : 'all'}
                    onClick={() => {
                      setBadgeCategoryId(-1);
                      setSearchKeywords('');
                      setPage(1);
                      setTotalPages(1);
                    }}
                  >
                    {t('All Categories')}
                  </li>
                  {badgeCategories.map((v) => (
                    <li
                      className={badgeCategoryId === v.id ? 'active' : ''}
                      onClick={() => {
                        if (badgeCategoryId === v.id) {
                          setBadgeCategoryId(-1);
                        } else {
                          setBadgeCategoryId(v.id);
                        }
                        setSearchKeywords('');
                        setPage(1);
                        setTotalPages(1);
                      }}
                      key={`badge-category-${v.id}`}
                    >
                      {v.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="badges-shown">
                <Loading show={badgesLoading} size="24px" />
                <div id="badge-list" className="badge-list">
                  {badges.map((v) => (
                    <div className="show" key={`badge-${v.id}`}>
                      <BadgeItem
                        preloadedData={v}
                        id={v.id}
                        hideDescription
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="badges-main-footer">
                {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} scrollToRef={scrollToRef.current} />}
              </div>
            </div>
          </div>
        </div>
        <div className={tabId === guidesTabId ? 'home-content' : 'home-content-none'}>
          {user?.institutionId === 1 && <BuilderComponent model={getBadgeBuilderModelName(user?.branch?.countryISO)} />}
        </div>
      </div>
    </div>
  );
}

export default Badges;
