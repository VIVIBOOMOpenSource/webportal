import React, {
  useEffect, useState, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './member-wip-projects.scss';

import ProjectApi from 'src/apis/viviboom/ProjectApi';

import Pagination from 'src/components/common/pagination/pagination';
import ProjectItem from 'src/components/views/projects/project-item';

import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';

const DEFAULT_PROJECT_LIMIT = 9;

function MembersWipProjects({ member, setTabId }) {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [wipProjects, setWipProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchWipProjects = useCallback(async () => {
    if (!user?.authToken) return;
    setWipProjects([]);
    const requestParams = {
      authToken: user.authToken,
      order: ProjectOrderType.LATEST,
      authorUserId: member?.id,
      isPublished: true,
      completedPrjId: false,
      isCompleted: false,
      limit: DEFAULT_PROJECT_LIMIT,
      offset: (page - 1) * DEFAULT_PROJECT_LIMIT,
    };
    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setWipProjects(res.data?.projects);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, member?.id, page]);

  const handleClickMain = () => {
    setTabId(1);
    setPage(1);
    setTotalPages(1);
  };

  useEffect(() => {
    fetchWipProjects();
  }, [fetchWipProjects]);

  return (
    <div className="member-wip">
      <Joyride sectionType={TutorialSectionType.MEMBER} />
      <div className="member-wip-content-right">
        <div className="body">
          <div className="profile-button-container" onClick={handleClickMain}>
            <button className="profile-button" type="button">
              {t('Back to Profile')}
            </button>
          </div>
          <div className="member-wip-projects">
            <div className="title-container">
              <div className="header">{t('Work-In-Progress Projects')}</div>
            </div>
            {wipProjects.length > 0 ? (
              <ul className="wip-project-list">
                {wipProjects.map((v) => (
                  <li key={`user-project+${v.id}`}>
                    <ProjectItem preloadedData={v} id={v.id} hideProfile />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-wip">{t('No projects have been created by this member yet')}</div>
            )}
          </div>

          <div className="member-wip-main-footer">
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersWipProjects;
