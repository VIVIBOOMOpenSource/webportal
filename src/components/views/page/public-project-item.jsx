import React, { useState, useEffect, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import './public-project-item.scss';
import DefaultProjectPicture from 'src/css/imgs/event-imgs/default-workshop.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import Loading from 'src/components/common/loading/loading';
import { getCountryFlag } from 'src/utils/countries';
import PublicProjectApi from 'src/apis/viviboom/PublicProjectApi';

function PublicProjectItem({ id, preloadedData, link }) {
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState(preloadedData);

  // API calls
  const fetchProject = useCallback(async () => {
    if (!user?.authToken) return;
    if (project?.images !== undefined || !id) return;
    setLoading(true);
    try {
      const res = await PublicProjectApi.get({ projectId: id });
      setProject(res.data?.project);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, project?.images, user?.authToken]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <div className="public-project-item-container">
      <Link to={link || `/view-portfolio/${project?.authorUsers?.[0]?.id}/project/${project?.id}`} className="link">
        {!!project?.authorUsers && (
          <div className="project-item-creator-container">
            <div className="project-item-creator-info">
              {project?.authorUsers?.length > 1 ? (
                <div className="project-item-creators">
                  <img
                    src={project?.authorUsers?.[1]?.profileImageUri || DefaultProfilePicture}
                    alt="profile"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultProfilePicture;
                    }}
                  />
                  <img
                    src={project?.authorUsers?.[0]?.profileImageUri || DefaultProfilePicture}
                    alt="profile"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultProfilePicture;
                    }}
                  />
                </div>
              ) : (
                <div className="project-item-creator-image">
                  <img
                    src={project?.authorUsers?.[0]?.profileImageUri || DefaultProfilePicture}
                    alt="profile"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultProfilePicture;
                    }}
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
            {project?.branch && (
              <div className="project-item-country-image">
                <img alt="country" src={getCountryFlag(project?.branch?.countryISO)} />
              </div>
            )}
          </div>
        )}
        <div className="project-item-image">
          <img
            src={project?.images[0]?.uri || project?.videos[0]?.thumbnailUri || DefaultProjectPicture}
            alt="project"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DefaultProjectPicture;
            }}
          />
        </div>
        <Loading show={loading} size="24px" />
        <div className="project-item-details">
          <div className="project-item-title">
            {project?.name}
          </div>
          <div className={project?.description === '' ? 'no-project-item-desc' : 'project-item-desc'}>{project?.description}</div>
        </div>
      </Link>
    </div>
  );
}

export default PublicProjectItem;
