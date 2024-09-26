import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './view-portfolio.scss';

import DefaultProfileCover from 'src/css/imgs/boom-imgs/profile/default-profile-cover.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/default-project-picture.png';
import Pagination from 'src/components/common/pagination/pagination';
import Loading from 'src/components/common/loading/loading';
import Modal from 'src/components/common/modal/modal';
import Button from 'src/components/common/button/button';
import { ReactComponent as CrossSVG } from 'src/css/imgs/icon-cross.svg';
import SkeletonBox from 'src/components/common/preloader/skeleton-box';
import PublicProjectApi from 'src/apis/viviboom/PublicProjectApi';
import PublicUserApi from 'src/apis/viviboom/PublicUserApi';

const DEFAULT_PROJECT_ITEM_IMAGE_WIDTH = 512;
const DEFAULT_COVER_IMAGE_SIZE = 512;
const DEFAULT_PROFILE_IMAGE_SIZE = 256;
const DEFAULT_LIMIT = 9;

function ViewPortfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'myAccount' });
  const params = useParams();
  const history = useHistory();
  const user = useSelector((state) => state?.user);
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [hideModal, setHideModal] = useState(false);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [member, setMember] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPublicPortfolioFound, setIsPublicPortfolioFound] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!member?.institutionId) return;

    const requestParams = {
      institutionId: member?.institutionId,
      authorUserId: id,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      imageWidth: DEFAULT_PROJECT_ITEM_IMAGE_WIDTH,
    };

    setLoading(true);
    try {
      const res = await PublicProjectApi.getList(requestParams);
      const projects = res.data?.projects;
      setSelectedProjects(projects);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      setIsPublicPortfolioFound(false);
    }
    setLoading(false);
  }, [id, member?.institutionId, page]);

  const fetchMember = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PublicUserApi.get({ userId: id, profileImageWidth: DEFAULT_PROFILE_IMAGE_SIZE, coverImageWidth: DEFAULT_COVER_IMAGE_SIZE });
      setMember(res.data?.user);
      if (!res.data?.user?.isPublicPortfolioActivated) setIsPublicPortfolioFound(false);
    } catch (err) {
      setIsPublicPortfolioFound(false);
    }
    setLoading(false);
  }, [id]);

  const renderModal = () => (

    <Modal
      className="set-image-popup"
      show={!!user.id && (user.id === member.id) && (!member.coverImageUri || !member.profileImageUri) && !hideModal}
    >
      <div
        className="popup-close-button"
        onClick={() => {
          setHideModal(true);
        }}
      >
        <CrossSVG className="popup-close-button-icon icon-cross" />
      </div>
      <div className="popup-title">
        {t('Profile picture or cover photo missing!')}
      </div>
      <div className="popup-text">
        {t('Your portfolio seems to be a little incomplete! You can add in a profile picture or cover photo by clicking the button below!')}
      </div>
      <div className="popup-buttons-container">
        <Button onClick={() => history.push('/edit-profile')} className="edit-button-container">
          {t('Edit Profile')}
        </Button>
      </div>
    </Modal>
  );

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return isPublicPortfolioFound ? (
    <div className="view-portfolio">
      {renderModal()}
      <div className="member-content-top">
        <div className="user-cover-image">
          {loading ? <SkeletonBox /> : (
            <img
              src={member?.coverImageUri || DefaultProfileCover}
              alt="No cover pic found"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = DefaultProfileCover;
              }}
            />
          )}
        </div>
        <div className="user-profile-basic-info">
          <div className="user-profile-image-name-container">
            <div className="user-profile-image-container">
              <div className="user-profile-image">
                {loading ? <SkeletonBox /> : (
                  <img
                    src={member?.profileImageUri || DefaultProfilePicture}
                    alt="No profile pic found"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = DefaultProfilePicture;
                    }}
                  />
                )}
              </div>
            </div>
            <div className="user-real-name">
              {loading ? '-' : member?.name}
            </div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="about-me">
          <div className="section-title">
            {t('About Me')}
          </div>
          <div className="user-description">
            {loading ? '-' : member?.description || 'No description found'}
          </div>
        </div>
        <div className="all-projects">
          <div className="section-title">
            {t('My Projects')}
          </div>
          <div className="member-projects">
            {selectedProjects?.length === 0 && <div className="no-projects">{t('No projects listed')}</div>}
            <ul className="project-list">
              {selectedProjects.map((v) => (
                <li key={`user-project+${v.id}`}>
                  <div className="project-item-container">
                    <Link to={`/view-portfolio/${member?.id}/project/${v?.id}`} className="link">
                      <div className="project-item-image">
                        <img
                          src={v?.images[0]?.uri || v?.videos[0]?.thumbnailUri || DefaultProjectPicture}
                          alt="no img"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = DefaultProjectPicture;
                          }}
                        />
                      </div>
                      <Loading show={loading} size="24px" />
                      <div className="project-item-details">
                        <div className="project-item-title">
                          {v?.name}
                        </div>
                        <div className={v?.description === '' ? 'no-project-item-desc' : 'project-item-desc'}>{v?.description}</div>
                      </div>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <div className="member-main-footer">
              {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="page-not-found">
      {t('No Public Portfolio found')}
    </div>
  );
}

export default ViewPortfolio;
