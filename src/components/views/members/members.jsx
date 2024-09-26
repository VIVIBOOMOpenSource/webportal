import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import './members.scss';

import Loading from 'src/components/common/loading/loading';
import Pagination from 'src/components/common/pagination/pagination';
import { CountryFlagType, getCountryFlag } from 'src/utils/countries';

import BranchApi from 'src/apis/viviboom/BranchApi';
import UserApi from 'src/apis/viviboom/UserApi';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import MemberItem from './member-item';

const DEFAULT_LIMIT = 9;

function Members() {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [branchId, setBranchId] = useState(user?.branchId || -1);
  const [branches, setBranches] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  // const [order, setOrder] = useState('ASC');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const scrollToRef = useRef();

  // API calls
  const fetchBranches = useCallback(async () => {
    if (!user?.authToken) return;
    setBranchesLoading(true);
    try {
      const res = await BranchApi.getList({ authToken: user.authToken });
      const fetchedBranches = res.data?.branches.map((branch) => ({
        ...branch,
        countryFlag: getCountryFlag(branch.countryISO, CountryFlagType.EMOJI),
      }));

      const userBranch = fetchedBranches.find((b) => b.id === user.branchId);
      const remainingBranches = fetchedBranches
        .filter((b) => b.id !== user.branchId)
        .sort((b1, b2) => {
          const compareResult = b1.countryISO.localeCompare(b2.countryISO);
          if (compareResult === 0) return b1.name.localeCompare(b2.name);
          return compareResult;
        });
      setBranches([userBranch, ...remainingBranches]);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setBranchesLoading(false);
  }, [user?.authToken, user?.branchId]);

  const fetchMembers = useCallback(async () => {
    if (!user?.authToken) return;
    setMembers([]);

    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
    };
    // if branch is selected (id > 0)
    if (branchId > 0) requestParams.branchId = branchId;
    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.username = searchKeywords;

    setLoading(true);
    try {
      const res = await UserApi.getList(requestParams);
      setMembers(res.data?.users);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [branchId, page, searchKeywords, user?.authToken]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // handlers
  const handleSearchClick = async (e) => {
    e.preventDefault();

    setBranchId(-1);
    setSearchKeywords(searchInput);
    setPage(1);
    setTotalPages(1);
    setSearchInput('');
  };

  const handleBranchChange = (id) => () => {
    setBranchId(id);
    setSearchKeywords('');
    setPage(1);
    setTotalPages(1);
  };

  return (
    <div className="members">
      <Joyride sectionType={TutorialSectionType.MEMBERS} />
      <div className="members-header-container">
        <div className="members-header-title-container">
          <p className="members-title">{t('Members')}</p>
          <p className="title-description">{t(user?.institutionId === 1 ? 'memberDescRoot' : 'memberDescNonRoot')}</p>
        </div>
      </div>
      <div className="separator-container">
        <div className="countries" ref={scrollToRef}>
          <Loading show={branchesLoading} size="24px" />
          <ul>
            {branches
              .map((v) => (
                <li
                  className={branchId === v.id ? 'active' : ''}
                  onClick={handleBranchChange(v.id)}
                  key={`branch-${v.id}`}
                >
                  {`${v.name} ${v.countryFlag}`}
                </li>
              ))}
            <li
              className={branchId < 0 ? 'active' : ''}
              onClick={handleBranchChange(-1)}
            >
              {t('All Members')}
            </li>
          </ul>
        </div>
      </div>

      <div className="members-list">
        <div className="title-search-container">
          <div className="member-list-title">{t('Discover All Creators')}</div>
          <Loading show={loading} size="24px" />
          <div className="search-container">
            <form
              onSubmit={handleSearchClick}
            >
              <input
                className="search-bar"
                placeholder={t('Search members')}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="button-container" onClick={handleSearchClick}>
                <div className="search-button">{t('Search')}</div>
              </div>
            </form>
          </div>
        </div>

        {!loading && (
        <ul className="members-ul">
          {members.map((v) => (
            <li key={`member-${v.id}`} className="members-li ">
              <MemberItem preloadedData={v} id={v.id} />
            </li>
          ))}
        </ul>
        )}
      </div>

      <div className="members-main-footer">
        {!totalPages ? (<h3>{t('Please refresh to view members!')}</h3>)
          : totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} scrollToRef={scrollToRef.current} />
          )}
      </div>
    </div>
  );
}

export default Members;
