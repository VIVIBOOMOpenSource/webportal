import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import './challenges.scss';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import BadgeCategoryApi from 'src/apis/viviboom/BadgeCategoryApi';

import Pagination from 'src/components/common/pagination/pagination';
import Loading from 'src/components/common/loading/loading';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { ChallengeDifficultyType } from 'src/enums/ChallengeDifficultyType';
import { ChallengeOrderType } from 'src/enums/ChallengeOrderType';
import { UserStatus } from 'src/enums/UserStatusType';
import StarterCriteriaApi from 'src/apis/viviboom/StarterCriteriaApi';
import ChallengeItem from './challenge-item';

import { ReactComponent as SearchSvg } from '../../../css/imgs/icon-search.svg';

const DEFAULT_LIMIT = 15;

const challengesTabId = 1;
const requiredChallengesTabId = 2;

const ChallengeDifficultyFilters = [
  { id: 1, label: 'Beginner', difficultyType: ChallengeDifficultyType.BEGINNER },
  { id: 2, label: 'Intermediate', difficultyType: ChallengeDifficultyType.INTERMEDIATE },
  { id: 3, label: 'Advanced', difficultyType: ChallengeDifficultyType.ADVANCED },
];

const ChallengeCompletionTimeFilters = [
  {
    id: 1, label: 'Within an hour', upperLimit: 60,
  },
  {
    id: 2, label: 'Within a day', lowerLimit: 60, upperLimit: 1440,
  },
  { id: 3, label: 'More than a day', lowerLimit: 1440 },
];

const ChallengeOrder = [
  { id: 1, label: 'Latest', order: ChallengeOrderType.LATEST },
  { id: 2, label: 'Oldest', order: ChallengeOrderType.OLDEST },
];

function Challenges() {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const user = useSelector((state) => state.user);
  const userStatus = useSelector((state) => state?.user?.status);
  const branch = useSelector((state) => state?.user?.branch);

  const branchId = branch?.id;
  const starterChallengeRequirementCount = branch?.starterChallengeRequirementCount;
  const starterCriteriaEnabled = (
    (starterChallengeRequirementCount > 0 || branch?.starterBadgeRequirementCount > 0 || branch?.starterAttendanceRequirementCount > 0)
    && userStatus === UserStatus.EXPLORER
  );
  const [tabId, setTabId] = useState(starterCriteriaEnabled ? requiredChallengesTabId : challengesTabId);

  const [starterChallenges, setStarterChallenges] = useState([]);

  const [challenges, setChallenges] = useState([]);
  const [challengeCategories, setChallengeCategories] = useState([]);
  const [challengeCategoryId, setChallengeCategoryId] = useState(-1);
  const [difficulty, setDifficulty] = useState();
  const [difficultyId, setDifficultyId] = useState(0);
  const [timeToCompleteId, setTimeToCompleteId] = useState(0);
  const [challengeOrderId, setChallengeOrderId] = useState(1);
  const [completionTimeLowerLimit, setCompletionTimeLowerLimit] = useState();
  const [completionTimeUpperLimit, setCompletionTimeUpperLimit] = useState();

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [challengesLoading, setChallengesLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  const scrollToRef = useRef();

  const fetchChallengeCategories = useCallback(async () => {
    if (!user?.authToken) return;
    setCategoriesLoading(true);
    try {
      const res = await BadgeCategoryApi.getList({ authToken: user?.authToken });
      setChallengeCategories(res.data?.badgeCategories);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setCategoriesLoading(false);
  }, [user?.authToken]);

  const getstarterChallenges = useCallback(async () => {
    if (!user.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      branchId,
      verboseAttributes: ['awardedUsers'],
      limit: DEFAULT_LIMIT,
      isChallenge: true,
    };
    try {
      const res = await StarterCriteriaApi.getList(requestParams);
      setStarterChallenges(res.data?.badges);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user.authToken, branchId]);

  // regular challenge pagination
  const getChallenges = useCallback(async () => {
    if (!user?.authToken) return;
    setChallenges([]);

    const requestParams = {
      authToken: user?.authToken,
      verboseAttributes: ['awardedUsers'],
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
    };
    // if challengeCategoryId is undefined, fetch all challenges, else:
    if (challengeCategoryId >= 0) requestParams.badgeCategoryId = challengeCategoryId;

    if (difficulty !== null) requestParams.difficulty = difficulty;

    if (completionTimeLowerLimit !== null) requestParams.completionTimeLowerLimit = completionTimeLowerLimit;
    if (completionTimeUpperLimit !== null) requestParams.completionTimeUpperLimit = completionTimeUpperLimit;

    if (challengeOrderId > 1) requestParams.order = ChallengeOrderType.OLDEST;
    else requestParams.order = ChallengeOrderType.LATEST;

    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.keywords = searchKeywords;

    setChallengesLoading(true);
    try {
      const res = await ChallengeApi.getList(requestParams);
      setChallenges(res.data?.challenges);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setChallengesLoading(false);
  }, [user?.authToken, challengeCategoryId, challengeOrderId, completionTimeLowerLimit, completionTimeUpperLimit, difficulty, page, searchKeywords]);

  const handleResetFilterCategory = (e) => {
    e.preventDefault();

    setChallengeCategoryId(-1);

    setDifficulty(null);
    setDifficultyId(0);

    setCompletionTimeLowerLimit(null);
    setCompletionTimeUpperLimit(null);
    setTimeToCompleteId(0);

    setChallengeOrderId(1);

    setPage(1);
    setTotalPages(1);
    setSearchInput('');
    setSearchKeywords('');
  };

  const handleCategorySelect = (selectedCategoryId) => {
    if (challengeCategoryId !== selectedCategoryId) setChallengeCategoryId(selectedCategoryId);
    else setChallengeCategoryId(-1);
    setSearchKeywords('');
    setPage(1);
    setTotalPages(1);
  };

  const handleFilterSelect = (key, filterType, filterName) => {
    if (filterType === 'difficulty' && filterName === difficulty) {
      setDifficulty(null);
      setDifficultyId(0);
    } else if (filterType === 'difficulty' && filterName !== difficulty) {
      setDifficulty(filterName);
      setDifficultyId(key);
    }
    if (filterType === 'timeToComplete' && key === timeToCompleteId) {
      setTimeToCompleteId(0);
      setCompletionTimeLowerLimit(null);
      setCompletionTimeUpperLimit(null);
    } else if (filterType === 'timeToComplete' && key !== timeToCompleteId) {
      setTimeToCompleteId(key);
      const completedTimeDuration = ChallengeCompletionTimeFilters.find((v) => v.label === filterName);
      setCompletionTimeLowerLimit(completedTimeDuration.lowerLimit);
      setCompletionTimeUpperLimit(completedTimeDuration.upperLimit);
    }
    if (filterType === 'challengeOrder' && key !== challengeOrderId) {
      setChallengeOrderId(key);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (tabId !== challengesTabId) setTabId(challengesTabId);
    setChallengeCategoryId(-1);
    setSearchKeywords(searchInput);
    setPage(1);
    setSearchInput('');
  };

  useEffect(() => {
    getstarterChallenges();
  }, [getstarterChallenges]);

  useEffect(() => {
    fetchChallengeCategories();
  }, [fetchChallengeCategories]);

  useEffect(() => {
    getChallenges();
  }, [getChallenges]);

  return (
    <div className="challenges">
      <Joyride
        sectionType={starterCriteriaEnabled ? TutorialSectionType.STARTER_CRITERIA : TutorialSectionType.CHALLENGES}
      />
      <div className="challenges-header-container">
        <div className="challenges-header-title-container">
          <p className="challenges-title">{t('Challenges')}</p>
          <p className="title-description">{t('To Infinity and Beyond: Explore the VIVIBOOM Challenge Frontier!')}</p>
        </div>
      </div>

      <div className="separator-container-challenges">
        {starterCriteriaEnabled && (
        <div className="tabs-container">
          <div
            className={tabId === requiredChallengesTabId ? 'tab-active' : 'tab'}
            onClick={() => setTabId(requiredChallengesTabId)}
          >
            {t('Challenges')}
          </div>
          <div
            className={tabId === challengesTabId ? 'tab-active' : 'tab'}
            onClick={() => setTabId(challengesTabId)}
          >
            {t('All Challenges')}
          </div>
        </div>
        )}
        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <div className={`search-bar${searchKeywords === '' ? '' : ' active'}`}>
            <input type="text" id="project-search" name="project_search" placeholder={t('Search')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <button type="submit" className="search-button">
            <div className="icon"><SearchSvg className="icon-search" /></div>
          </button>
        </form>
      </div>

      <div className={starterCriteriaEnabled ? 'body starterChallenges' : 'body'} style={{ display: tabId === requiredChallengesTabId ? 'block' : 'none' }}>
        <div className={tabId === requiredChallengesTabId ? 'home-content' : 'home-content-none'}>
          <div className="headers">
            {starterCriteriaEnabled && (<h6>{t('Starter Challenges')}</h6>)}
            {starterCriteriaEnabled && starterChallenges.length === starterChallengeRequirementCount && <h4>{t('whereToStartAll')}</h4>}
            {starterCriteriaEnabled && starterChallenges.length !== starterChallengeRequirementCount && <h4>{t('whereToStart', { count: starterChallengeRequirementCount })}</h4>}
          </div>
          <div className="challenges-div">
            <div className="challenges-div-content">
              <div className="challenges-shown">
                <Loading show={challengesLoading} size="24px" />
                <div className="challenge-list">
                  {starterCriteriaEnabled && starterChallenges.map((v) => (
                    <div className="show" key={`badge-${v.id}`}>
                      <ChallengeItem
                        preloadedData={v}
                        id={v.id}
                        hideDescription
                      />
                    </div>
                  ))}
                </div>

                {starterCriteriaEnabled
                  && (
                    <div>
                      <p style={{
                        textAlign: 'center', color: '#fff', margin: '15px', fontSize: '18px',
                      }}
                      >
                        {starterChallenges.length > 0 && <b>{t('Check out the challenges you can earn once you become a VIVINAUT!')}</b>}
                      </p>
                      <button className="view-all-badges-button" type="button" onClick={() => { setTabId(challengesTabId); window.scrollTo(0, 0); }}>
                        {t('View all challenges')}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="body">
        <div className={tabId === challengesTabId ? 'home-content' : 'home-content-none'} ref={scrollToRef}>
          <h6>{t('All Challenges')}</h6>
          <h4>{t('VIVIBOOM Adventures: Each Challenge a Cosmic Victory!')}</h4>
          <div className="challenges-div">
            <div className="challenges-div-content">
              <div className="categories-filter-column">
                <div className="categories-filter-container">
                  <div className="categories-filter-title">{t('Order')}</div>
                  <Loading show={categoriesLoading} size="24px" />
                  <ul>
                    {ChallengeOrder.map((v) => (
                      <li
                        className={challengeOrderId === v.id ? 'active' : ''}
                        onClick={() => handleFilterSelect(v.id, 'challengeOrder', v.label)}
                        key={`challenge-category-${v.id}`}
                      >
                        {v.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="categories-filter-container">
                  <div className="categories-filter-title">{t('Categories')}</div>
                  <Loading show={categoriesLoading} size="24px" />
                  <ul>
                    <li
                      className={challengeCategoryId === -1 ? 'active' : 'all'}
                      onClick={() => handleCategorySelect(-1)}
                    >
                      {t('All Categories')}
                    </li>
                    {challengeCategories.map((v) => (
                      <li
                        className={challengeCategoryId === v.id ? 'active' : ''}
                        onClick={() => handleCategorySelect(v.id)}
                        key={`challenge-category-${v.id}`}
                      >
                        {v.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="categories-filter-container">
                  <div className="categories-filter-title">{t('Difficulty Level')}</div>
                  <Loading show={categoriesLoading} size="24px" />
                  <ul>
                    {ChallengeDifficultyFilters.map((v) => (
                      <li
                        className={difficultyId === v.id ? 'active' : ''}
                        onClick={() => handleFilterSelect(v.id, 'difficulty', v.difficultyType)}
                        key={`challenge-difficulty-${v.id}`}
                      >
                        {v.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="categories-filter-container">
                  <div className="categories-filter-title">{t('Time Taken to Complete')}</div>
                  <Loading show={categoriesLoading} size="24px" />
                  <ul>
                    {ChallengeCompletionTimeFilters.map((v) => (
                      <li
                        className={timeToCompleteId === v.id ? 'active' : ''}
                        onClick={() => handleFilterSelect(v.id, 'timeToComplete', v.label)}
                        key={`challenge-difficulty-${v.id}`}
                      >
                        {v.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="reset-button" onClick={handleResetFilterCategory}>{t('Clear Filter')}</div>
              </div>
              <div className="all-challenges">
                <div className="challenges-shown">
                  <Loading show={challengesLoading} size="24px" />
                  <div id="challenge-list" className="challenge-list">
                    {challenges.map((v) => (
                      <ChallengeItem
                        key={v.id}
                        preloadedData={v}
                        id={v.id}
                        hideDescription
                      />
                    ))}
                  </div>
                </div>
                <div className="challenges-main-footer">
                  {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} scrollToRef={scrollToRef.current} />}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Challenges;
