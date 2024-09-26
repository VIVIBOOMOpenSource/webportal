import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './project-details.scss';

import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ProjectBadgeStatusType } from 'src/enums/ProjectBadgeStatusType';

import PublicProjectApi from 'src/apis/viviboom/PublicProjectApi';
import DefaultCreatorPicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import ProjectSection from './project-section';
import BadgeModal from './badge-modal';

const DEFAULT_PROJECT_IMAGE_WIDTH = 1024;

function Project() {
  const { t } = useTranslation('translation', { keyPrefix: 'myAccount' });
  const params = useParams();
  const { projectId, portfolioCode } = params;

  const [isProjectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState(null);
  const projectAuthorsCount = project?.authorUsers?.length || 0;
  const [isProjectSectionLoading, setProjectSectionLoading] = useState(true);
  const [projectSections, setProjectSections] = useState([]);
  const [projectBadges, setProjectBadges] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState();

  const fetchProject = useCallback(async () => {
    setProjectLoading(true);
    setProject(null);
    try {
      const res = await PublicProjectApi.get({ projectId, portfolioCode, imageWidth: 1024 });
      setProject(res.data?.project);
      const fetchedProject = res.data?.project;
      if (fetchedProject.badgeStatus === ProjectBadgeStatusType.AWARDED) setProjectBadges(fetchedProject.badges);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setProjectLoading(false);
  }, [portfolioCode, projectId]);

  const fetchProjectSections = useCallback(async () => {
    setProjectSections([]);
    setProjectSectionLoading(true);
    try {
      const res = await PublicProjectApi.getSections({ projectId, portfolioCode, imageWidth: DEFAULT_PROJECT_IMAGE_WIDTH });
      setProjectSections(res.data?.projectSections);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
    setProjectSectionLoading(false);
  }, [portfolioCode, projectId]);

  const reloadProject = async () => {
    await fetchProject();
    await fetchProjectSections();
  };

  const openBadgeModal = (badge) => {
    setOpenModal(true);
    setSelectedBadge(badge);
  };

  useEffect(() => {
    fetchProject();
    fetchProjectSections();
  }, [fetchProject, fetchProjectSections]);

  const projectAuthorName = useMemo(() => {
    if (projectAuthorsCount > 1) {
      return [project?.authorUsers?.slice(0, -1).map((u) => u.name).join(', '), project?.authorUsers?.[projectAuthorsCount - 1]?.name].join(` ${t('and')} `);
    }
    return project?.authorUsers?.[0]?.name || '-';
  }, [project?.authorUsers, projectAuthorsCount, t]);

  return (
    <div className="project-details">
      <div className="body">
        <div className="widget-box">
          <div className="project-header">
            <div className="project-title">
              {project?.authorUsers?.length > 1 ? (
                <div className="project-creators">
                  <img
                    src={project?.authorUsers?.[1]?.profileImageUri || DefaultCreatorPicture}
                    alt="no img"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultCreatorPicture;
                    }}
                  />
                  <img
                    src={project?.authorUsers?.[0]?.profileImageUri || DefaultCreatorPicture}
                    alt="no img"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultCreatorPicture;
                    }}
                  />
                </div>
              ) : (
                <div className="profile-image">
                  <img
                    src={project?.authorUsers?.[0]?.profileImageUri || DefaultCreatorPicture}
                    alt="no img"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultCreatorPicture;
                    }}
                  />
                </div>
              )}
              <div className="titles">
                <p className="title">
                  {project?.name || '-'}
                  {' '}
                  {project?.isCompleted === false && '(Work-In-Progress)'}
                </p>
                <p className="subtitle">
                  {t('Created By')}
                  :
                  {' '}
                  {projectAuthorName}
                </p>
                <p className="subtitle">
                  {t('Inspired By')}
                  :
                  {' '}
                  {project?.description}
                </p>
              </div>
            </div>
            {projectBadges.length > 0 && (
            <div className="project-badges">
              <ul>
                {projectBadges.map((v) => (
                  <li key={`project-badge_${v.id}`}>
                    <div className="badge-wrapper" onClick={() => openBadgeModal(v)}>
                      <div className="badge-img">
                        <img
                          src={v?.imageUri || DefaultCreatorPicture}
                          alt="no img"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = DefaultCreatorPicture;
                          }}
                        />
                      </div>
                      <div className="badge-name">
                        {v.name}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
          <div className="widget-box-content">
            <div className="timeline-information-list">
              {project && (
                <ProjectSection
                  isRootProject
                  section={project}
                  projectId={project?.id}
                  reloadProject={reloadProject}
                />
              )}
              {project && projectSections.map((v) => (
                <ProjectSection
                  key={`section_${v.id}`}
                  section={v}
                  projectId={project?.id}
                  reloadProject={reloadProject}
                />
              ))}
            </div>
          </div>
        </div>
        <BadgeModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
          }}
          badge={selectedBadge}
        />
      </div>
    </div>
  );
}

export default Project;
