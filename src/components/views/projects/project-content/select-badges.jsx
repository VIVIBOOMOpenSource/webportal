import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import './select-badges.scss';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import BadgeApi from 'src/apis/viviboom/BadgeApi';
import BadgeCategoryApi from 'src/apis/viviboom/BadgeCategoryApi';
import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import Loading from 'src/components/common/loading/loading';
import Pagination from 'src/components/common/pagination/pagination';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import BadgeItem from '../../badges/badge-item';
import ChallengeItem from '../../challenges/challenge-item';

import { ReactComponent as SearchSvg } from '../../../../css/imgs/icon-search.svg';
import { ReactComponent as ChevronDownSvg } from '../../../../css/imgs/icon-chevron-down.svg';
import { ReactComponent as ChevronUpSvg } from '../../../../css/imgs/icon-chevron-up.svg';

const DEFAULT_LIMIT = 20;

const color = [
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'nineth',
];

function SelectBadges({
  badgesAndChallenges,
  setBadgesAndChallenges,
  markDocumentDirty,
  onFinishedLoading,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const authToken = useSelector((state) => state?.user?.authToken);

  const [badgesLoading, setBadgesLoading] = useState(false);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [submitBadgeTab, setSubmitBadgeTab] = useState(false);
  const [submitChallengeTab, setSubmitChallengeTab] = useState(false);

  const [allBadges, setAllBadges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [badgeCategoryId, setBadgeCategoryId] = useState(-1);
  const [challengeCategoryId, setChallengeCategoryId] = useState(-1);
  const [badgeCategories, setBadgeCategories] = useState([]);

  const [badgePage, setBadgePage] = useState(1);
  const [totalBadgePages, setTotalBadgePages] = useState(1);
  const [challengePage, setChallengePage] = useState(1);
  const [totalChallengePages, setTotalChallengePages] = useState(1);

  const [badgeFinishedLoading, setBadgeFinishedLoading] = useState(false);
  const [challengeFinishedLoading, setChallengeFinishedLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  const scrollToRef = useRef();

  const fetchBadgeCategories = useCallback(async () => {
    if (!authToken) return;
    setCategoriesLoading(true);
    try {
      const res = await BadgeCategoryApi.getList({ authToken });
      setBadgeCategories(res.data?.badgeCategories);
      // console.log(res.data?.badgeCategories);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setCategoriesLoading(false);
  }, [authToken]);

  // regular badge pagination
  const getBadges = useCallback(async () => {
    if (!authToken) return;

    const requestParams = {
      authToken,
      verboseAttributes: ['awardedUsers'],
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: (badgePage - 1) * DEFAULT_LIMIT,
    };
    // if badgeCategoryId is undefined, fetch all badges, else:
    if (badgeCategoryId >= 0) requestParams.badgeCategoryId = badgeCategoryId;

    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.keywords = searchKeywords;

    setBadgesLoading(true);
    try {
      const res = await BadgeApi.getList(requestParams);
      setAllBadges(res.data?.badges);
      // console.log(res.data?.badges);
      setTotalBadgePages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setBadgesLoading(false);
    setBadgeFinishedLoading(true);
  }, [authToken, badgeCategoryId, badgePage, searchKeywords]);

  const getChallenges = useCallback(async () => {
    if (!authToken) return;

    const requestParams = {
      authToken,
      verboseAttributes: ['awardedUsers'],
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: (challengePage - 1) * DEFAULT_LIMIT,
    };
    // if challengeCategoryId is undefined, fetch all challenges, else:
    if (challengeCategoryId >= 0) requestParams.badgeCategoryId = challengeCategoryId;

    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.keywords = searchKeywords;

    setChallengesLoading(true);
    try {
      const res = await ChallengeApi.getList(requestParams);
      setAllChallenges(res.data?.challenges);
      // console.log(res.data?.challenges);
      setTotalChallengePages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setChallengesLoading(false);
    setChallengeFinishedLoading();
  }, [authToken, challengeCategoryId, challengePage, searchKeywords]);

  useEffect(() => {
    fetchBadgeCategories();
  }, [fetchBadgeCategories]);

  useEffect(() => {
    getBadges();
  }, [getBadges]);

  useEffect(() => {
    getChallenges();
  }, [getChallenges]);

  useEffect(() => {
    if (badgeFinishedLoading && challengeFinishedLoading) onFinishedLoading();
  }, [badgeFinishedLoading, challengeFinishedLoading])

  // handlers
  const handleBadgeToggle = (badgeId) => () => {
    if (!badgesAndChallenges.find((b) => b.id === badgeId)) {
      setBadgesAndChallenges(badgesAndChallenges.concat({ id: badgeId }));
    } else {
      setBadgesAndChallenges(badgesAndChallenges.filter((b) => b.id !== badgeId));
    }
    markDocumentDirty();
  };

  const handleSearchClick = (e) => {
    e.preventDefault();

    setBadgeCategoryId(-1);
    setChallengeCategoryId(-1);
    setSearchKeywords(searchInput);
    setBadgePage(1);
    setSearchInput('');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="select-badges" ref={scrollToRef}>
      <div className="badges-div">
        <div className="badges-div-header title">{t('Submit your challenge and earn badges here!')}</div>
        <p>
          {t('Select the relevant challenges and badges!')}
          {' '}
          {t('badgeSelected', { count: badgesAndChallenges.length })}
        </p>
        <div className={submitBadgeTab ? 'select-badge-button-opened' : 'select-badge-button-closed'} onClick={() => setSubmitBadgeTab(!submitBadgeTab)}>
          <div className="select-badge-button-text">{t('Select Badge')}</div>
          {submitBadgeTab ? (
            <ChevronUpSvg className="chevron-icon" width={30} />
          ) : (
            <ChevronDownSvg className="chevron-icon" width={30} />
          )}
        </div>
        {submitBadgeTab && (
        <div className="badges-div-content">
          <div className="search-bar-container">
            <div className={`search-bar${searchKeywords === '' ? '' : ' active'}`}>
              <input type="text" id="project-search" name="project_search" placeholder={t('Search Badges')} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} />
            </div>
            <div className="search-button" onClick={handleSearchClick}>
              <SearchSvg className="icon-search" />
            </div>
          </div>
          <div className="categories">
            <Loading show={categoriesLoading} size="24px" />
            <ul>
              <li
                className={badgeCategoryId === -1 ? 'active' : 'all'}
                onClick={() => {
                  setBadgeCategoryId(-1);
                  setSearchKeywords('');
                  setBadgePage(1);
                  setTotalBadgePages(1);
                }}
              >
                {t('All Categories')}
              </li>
              {badgeCategories.map((v, i) => (
                <li
                  className={badgeCategoryId === v.id ? 'active' : color[i % 9]}
                  onClick={() => {
                    if (badgeCategoryId === v.id) {
                      setBadgeCategoryId(-1);
                    } else {
                      setBadgeCategoryId(v.id);
                    }
                    setSearchKeywords('');
                    setBadgePage(1);
                    setTotalBadgePages(1);
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
            <ul className="badge-list">
              {allBadges.map((v) => (
                <li
                  key={`project-badge_${v.id}`}
                  className={`show ${badgesAndChallenges.find((b) => b.id === v.id) ? 'selected' : ''}`}
                  onClick={handleBadgeToggle(v.id)}
                >
                  <BadgeItem
                    preloadedData={v}
                    id={v.id}
                    disableLink
                    hideDescription
                  />
                </li>
              ))}
            </ul>
            {allBadges.length === 0 && <div className="no-badges">{t('Oops! Seems like there are no badges here')}</div>}
          </div>
          <div className="badges-main-footer">
            {totalBadgePages > 1 && <Pagination page={badgePage} totalPages={totalBadgePages} setBadgePage={setBadgePage} scrollToRef={scrollToRef.current} />}
          </div>
        </div>
        )}

        <div className={submitChallengeTab ? 'select-challenge-button-opened' : 'select-challenge-button-closed'} onClick={() => setSubmitChallengeTab(!submitChallengeTab)}>
          <div className='select-challenge-button-text'>{t('Select Challenge')}</div>
          {submitChallengeTab ? (
            <ChevronUpSvg className="chevron-icon" width={30} />
          ) : (
            <ChevronDownSvg className="chevron-icon" width={30} />
          )}
        </div>
        {submitChallengeTab && (
        <div className="challenges-div-content">
          <div className="search-bar-container">
            <div className={`search-bar${searchKeywords === '' ? '' : ' active'}`}>
              <input type="text" id="project-search" name="project_search" placeholder={t('Search Challenges')} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} />
            </div>
            <div className="search-button" onClick={handleSearchClick}>
              <SearchSvg className="icon-search" />
            </div>
          </div>
          <div className="categories">
            <Loading show={categoriesLoading} size="24px" />
            <ul>
              <li
                className={challengeCategoryId === -1 ? 'active' : 'all'}
                onClick={() => {
                  setChallengeCategoryId(-1);
                  setSearchKeywords('');
                  setChallengePage(1);
                  setTotalChallengePages(1);
                }}
              >
                {t('All Categories')}
              </li>
              {badgeCategories.map((v, i) => (
                <li
                  className={challengeCategoryId === v.id ? 'active' : color[i % 9]}
                  onClick={() => {
                    if (challengeCategoryId === v.id) {
                      setChallengeCategoryId(-1);
                    } else {
                      setChallengeCategoryId(v.id);
                    }
                    setSearchKeywords('');
                    setChallengePage(1);
                    setTotalChallengePages(1);
                  }}
                  key={`challenge-category-${v.id}`}
                >
                  {v.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="challenges-shown">
            <Loading show={challengesLoading} size="24px" />
            <ul className="challenge-list">
              {allChallenges.map((v) => (
                <li
                  key={`project-badge_${v.id}`}
                  className={`show ${badgesAndChallenges.find((b) => b.id === v.id) ? 'selected' : ''}`}
                  onClick={handleBadgeToggle(v.id)}
                >
                  <ChallengeItem
                    preloadedData={v}
                    id={v.id}
                    disableLink
                    hideDescription
                  />
                </li>
              ))}
            </ul>
            {allChallenges.length === 0 && <div className="no-challenges">{t('Oops! Seems like there are no challenges here')}</div>}
          </div>
          <div className="challenges-main-footer">
            {totalChallengePages > 1 && <Pagination page={challengePage} totalPages={totalChallengePages} setPage={setChallengePage} scrollToRef={scrollToRef.current} />}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default SelectBadges;
