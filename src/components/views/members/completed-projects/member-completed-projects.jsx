import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './member-completed-projects.scss';

import ProjectApi from 'src/apis/viviboom/ProjectApi';

import Pagination from 'src/components/common/pagination/pagination';
import ProjectItem from 'src/components/views/projects/project-item';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';

import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';

const DEFAULT_PROJECT_LIMIT = 9;

function MembersProjects({ member, setTabId }) {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchProjects = useCallback(async () => {
    if (!user?.authToken) return;
    setProjects([]);
    const requestParams = {
      authToken: user.authToken,
      order: ProjectOrderType.LATEST,
      authorUserId: member?.id,
      isPublished: true,
      isCompleted: true,
      limit: DEFAULT_PROJECT_LIMIT,
      offset: (page - 1) * DEFAULT_PROJECT_LIMIT,
    };

    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setProjects(res.data?.projects);
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
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="member-completed-projects">
      <Joyride sectionType={TutorialSectionType.MEMBER} />
      <div className="member-completed-projects-content-right">
        <div className="body">
          <div className="profile-button-container" onClick={handleClickMain}>
            <button className="profile-button" type="button">
              {t('Back to Profile')}
            </button>
          </div>
          <div className="member-completed-projects">
            <div className="title-container">
              <div className="header">{t('Completed Projects')}</div>
            </div>
            {projects?.length > 0 ? (
              <ul className="completed-projects-list">
                { projects.map((v) => (
                  <li key={`user-project+${v.id}`}>
                    <ProjectItem preloadedData={v} id={v.id} hideProfile />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-completed-projects">{t('No projects have been created by this member yet')}</div>
            )}
          </div>

          <div className="member-completed-projects-main-footer">
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersProjects;
