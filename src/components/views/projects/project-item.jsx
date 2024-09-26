import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trans, useTranslation } from 'react-i18next';

import './project-item.scss';
import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/default-project-picture.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import Loading from 'src/components/common/loading/loading';
import MyImage from 'src/components/common/MyImage';
import ProjectApi from 'src/apis/viviboom/ProjectApi';
import { ReactComponent as HeartSvg } from 'src/css/imgs/icon-heart.svg';
import { ReactComponent as BadgeSvg } from 'src/css/imgs/icon-badge.svg';
import { ProjectBadgeStatusType } from 'src/enums/ProjectBadgeStatusType';

const DEFAULT_PROJECT_ITEM_IMAGE_WIDTH = 512;
const DEFAULT_PROFILE_IMAGE_SIZE = 256;

function ProjectItem({ id, preloadedData, hideProfile }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState(preloadedData);

  const [isUserLiked, setUserLiked] = useState(!!project?.likes?.find((l) => l.userId === user.id));
  const [isLikeLoading, setLikeLoading] = useState(false);

  // API calls
  const fetchProject = useCallback(async () => {
    if (!user?.authToken) return;
    if ((project?.authorUsers !== undefined && project?.likes !== undefined && project?.images !== undefined && project?.badges !== undefined) || !id) return;
    setLoading(true);
    try {
      const res = await ProjectApi.get({ authToken: user.authToken, projectId: id, verboseAttributes: ['badges'] });
      setProject(res.data?.project);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, project?.authorUsers, project?.badges, project?.images, project?.likes, user?.authToken]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const likeToggle = async (e) => {
    e.preventDefault();
    setLikeLoading(true);
    try {
      const res = await ProjectApi.like({ authToken: user.authToken, projectId: project?.id, isLike: !isUserLiked });
      setUserLiked(res.data?.isLike);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
    setLikeLoading(false);
  };

  return (
    <div className="project-item">
      <Link to={`/project/${project?.id}`}>
        <div className="project-item-container">
          {!hideProfile && (
            <div className="project-item-creator-container">
              {project?.authorUsers?.length > 1 ? (
                <div className="project-item-creators">
                  <MyImage
                    src={project?.authorUsers?.[1]?.profileImageUri}
                    alt="profile"
                    defaultImage={DefaultProfilePicture}
                    width={DEFAULT_PROFILE_IMAGE_SIZE}
                    isLoading={loading}
                  />
                  <MyImage
                    src={project?.authorUsers?.[0]?.profileImageUri}
                    alt="profile"
                    defaultImage={DefaultProfilePicture}
                    width={DEFAULT_PROFILE_IMAGE_SIZE}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <div className="project-item-creator-image">
                  <MyImage
                    src={project?.authorUsers?.[0]?.profileImageUri}
                    alt="profile"
                    defaultImage={DefaultProfilePicture}
                    width={DEFAULT_PROFILE_IMAGE_SIZE}
                    isLoading={loading}
                  />
                </div>
              )}

              <div className="project-item-creator-name">
                {project?.authorUsers?.length < 2 ? `${project?.authorUsers?.[0]?.name}` : (
                  <p className="author-names">
                    <Trans i18nKey="projects.authors" name1={project?.authorUsers?.[0]?.name} name2={project?.authorUsers?.[1]?.name}>
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      {{ name1: project?.authorUsers?.[0]?.name }} <span style={{ fontWeight: '400' }}>and</span> {{ name2: project?.authorUsers?.length > 2 ? 'others' : project?.authorUsers?.[1]?.name }}
                    </Trans>
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="project-item-image">
            <MyImage
              src={project?.thumbnailUri || project?.images[0]?.uri}
              alt="project"
              width={DEFAULT_PROJECT_ITEM_IMAGE_WIDTH}
              defaultImage={DefaultProjectPicture}
              isLoading={loading}
            />
          </div>
          <Loading show={loading} size="24px" />
          <div className="project-item-details">
            <div className="project-item-title">
              {project?.name}
            </div>
            <div className={project?.description === '' ? 'no-project-item-desc' : 'project-item-desc'}>{project?.description}</div>
          </div>
          <div className="project-item-footer">
            <div className="project-item-badge">
              {project?.isCompleted && project?.badges?.length > 0 && project?.badgeStatus !== ProjectBadgeStatusType.UNSUBMITTED && project?.badgeStatus !== ProjectBadgeStatusType.REJECTED && (
                <>
                  <BadgeSvg fill="gray" />
                  <div className="badge-count">
                    {project?.badgeStatus === ProjectBadgeStatusType.AWARDED && (
                      <Trans i18nKey="projects.wins" count={project?.badges?.length || 0}>
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        Wins <strong>{{ count: project?.badges?.length || 0 }}</strong> badge
                      </Trans>
                    )}
                    {(project?.badgeStatus === ProjectBadgeStatusType.SUBMITTED || project?.badgeStatus === ProjectBadgeStatusType.RESUBMITTED) && (
                      <Trans i18nKey="projects.submitted" count={project?.badges?.length || 0}>
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        Submitted <strong>{{ count: project?.badges?.length || 0 }}</strong> badge
                      </Trans>
                    )}
                    !
                  </div>
                </>
              )}
              {!project?.isCompleted && (
                <div className="badge-count">
                  {t('Work-In-Progress')}
                </div>
              )}
            </div>
            <span className={`like-button ${isUserLiked ? 'active' : ''}`} onClick={likeToggle}>
              {isLikeLoading ? (
                <Loading size="24px" show />
              ) : (
                <>
                  <HeartSvg className="heart-button" fill={isUserLiked ? '#fff' : 'rgb(248,48,95)'} />
                  <p className="like-text">{t('Like')}</p>
                </>
              )}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectItem;
