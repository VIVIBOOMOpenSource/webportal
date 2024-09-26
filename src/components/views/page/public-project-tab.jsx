import './public-project-tab.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import PublicProjectApi from 'src/apis/viviboom/PublicProjectApi';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';

import 'react-multi-carousel/lib/styles.css';
import PublicProjectItem from './public-project-item';

const DEFAULT_LIMIT = 6;

function PublicProjectTab({ portfolio }) {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = useCallback(async () => {
    const requestParams = {
      institutionId: portfolio?.institutionId,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      portfolioId: portfolio.id,
    };

    setLoading(true);
    try {
      const res = await PublicProjectApi.getList(requestParams);
      setProjects(res.data?.projects);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setLoading(false);
  }, [page, portfolio?.institutionId, portfolio.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="public-project-tab">
      <h6>{portfolio.headingProject || t('Projects')}</h6>
      <div className="project-container-sub">
        {loading ? (
          <div className="loading-container">
            <Loading show={loading} size="40px" />
          </div>
        ) : (
          <ul className="project-list">
            {projects.map((v) => (
              <li key={`project_${v.id}`}>
                <PublicProjectItem preloadedData={v} id={v.id} link={`/page/${portfolio?.code}/project/${v?.id}`} />
              </li>
            ))}
          </ul>
        )}
        <div className="projects-main-footer">
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}

export default PublicProjectTab;
