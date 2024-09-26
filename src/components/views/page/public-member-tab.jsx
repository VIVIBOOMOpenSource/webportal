import './public-member-tab.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import PublicUserApi from 'src/apis/viviboom/PublicUserApi';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';

import 'react-multi-carousel/lib/styles.css';
import PublicMemberItem from './public-member-item';

const DEFAULT_LIMIT = 10;

function PublicMemberTab({ portfolio }) {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = useCallback(async () => {
    const requestParams = {
      institutionId: portfolio?.institutionId,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      portfolioId: portfolio.id,
    };

    setLoading(true);
    try {
      const res = await PublicUserApi.getList(requestParams);
      setMembers(res.data?.users);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setLoading(false);
  }, [page, portfolio?.institutionId, portfolio.id]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div className="public-member-tab">
      <h6>{portfolio.headingUser || t('Creators')}</h6>
      <div className="member-container-sub">
        {loading ? (
          <div className="loading-container">
            <Loading show={loading} size="40px" />
          </div>
        ) : (
          <ul className="member-list">
            {members.map((v) => (
              <li key={`member_${v.id}`}>
                <PublicMemberItem member={v} />
              </li>
            ))}
          </ul>
        )}
        <div className="members-main-footer">
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}

export default PublicMemberTab;
