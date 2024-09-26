import './work-in-progress.scss';
import './project.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ProjectApi from 'src/apis/viviboom/ProjectApi';
import MyImage from 'src/components/common/MyImage';
import { ProjectBadgeStatusType } from 'src/enums/ProjectBadgeStatusType';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import DefaultCreatorPicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import ChatSection from '../../common/chat-section/chat-section';
import Comments from './comments';
import ProjectItem from './project-item';
import MemberItem from '../members/member-item';
import ProjectSection from './project-section';
import Loading from '../../common/loading/loading';
import Button from '../../common/button/button';
import BadgeItem from '../badges/badge-item';

const DEFAULT_PROFILE_IMAGE_SIZE = 256;

function WorkInProgress() {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const params = useParams();
  const { id } = params;

  const user = useSelector((state) => state?.user);

  // project
  const [isProjectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState(null);
  const projectAuthorsCount = project?.authorUsers?.length || 0;
  const isAuthor = !!project?.authorUsers?.find((u) => u.id === user.id);

  // random projects
  const [isRandomProjectsLoading, setRandomProjectsLoading] = useState(false);
  const [randomProjects, setRandomProjects] = useState([]);

  // project sections
  const [isProjectSectionLoading, setProjectSectionLoading] = useState(true);
  const [projectSections, setProjectSections] = useState([]);

  // project badges
  const [projectBadges, setProjectBadges] = useState([]);

  // project likes
  const [isUserLiked, setUserLiked] = useState(false);
  const [projectLikes, setProjectLikes] = useState(0);
  const [isLikeLoading, setLikeLoading] = useState(false);

  // API calls
  const fetchProject = useCallback(async () => {
    if (!user?.authToken) return;
    setProjectLoading(true);
    setProject(null);
    try {
      const res = await ProjectApi.get({ authToken: user.authToken, projectId: id, verboseAttributes: ['files', 'categories', 'badges'] });
      setProject(res.data?.project);

      const fetchedProject = res.data?.project;

      if (fetchedProject.badgeStatus === ProjectBadgeStatusType.AWARDED) setProjectBadges(fetchedProject.badges);
      setProjectLikes(fetchedProject.likes.length);

      setUserLiked(!!fetchedProject.likes.find((l) => l.userId === user.id));
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setProjectLoading(false);
  }, [id, user?.authToken, user?.id]);

  const fetchProjectSections = useCallback(async () => {
    if (!user?.authToken) return;
    setProjectSections([]);
    setProjectSectionLoading(true);
    try {
      const res = await ProjectApi.getSections({ authToken: user.authToken, projectId: id });
      setProjectSections(res.data?.projectSections);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
    setProjectSectionLoading(false);
  }, [id, user?.authToken]);

  const fetchRandomProjects = useCallback(async () => {
    if (!user?.authToken) return;
    setRandomProjects([]);
    setRandomProjectsLoading(true);
    try {
      const res = await ProjectApi.getList({ authToken: user.authToken, order: ProjectOrderType.RANDOM });
      setRandomProjects(res.data?.projects);
      // console.log(res.data?.projects);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setRandomProjectsLoading(false);
  }, [user?.authToken]);

  const handleLikeToggle = async () => {
    setLikeLoading(true);
    try {
      const res = await ProjectApi.like({ authToken: user.authToken, projectId: project?.id, isLike: !isUserLiked });
      setUserLiked(res.data?.isLike);
      setProjectLikes(res.data?.likeCount);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
    setLikeLoading(false);
  };

  // utility function
  const reloadProject = async () => {
    await fetchProject();
    await fetchProjectSections();
  };

  useEffect(() => {
    fetchProject();
    fetchProjectSections();
  }, [fetchProject, fetchProjectSections]);

  useEffect(() => {
    fetchRandomProjects();
  }, [fetchRandomProjects, project?.id]);

  const projectAuthorName = useMemo(() => {
    if (projectAuthorsCount > 1) {
      return [project?.authorUsers?.slice(0, -1).map((u) => u.name).join(', '), project?.authorUsers?.[projectAuthorsCount - 1]?.name].join(` ${t('and')} `);
    }
    return project?.authorUsers?.[0]?.name || '-';
  }, [project?.authorUsers, projectAuthorsCount, t]);

  return (
    <div className="work-in-progress">
      <Joyride sectionType={TutorialSectionType.PROJECT} />
      <div className="projects-header-container">
        <div className="projects-header-title-container">
          <p className="projects-title">{t('Projects')}</p>
          <p className="title-description">{t(user?.institutionId === 1 ? 'projectDescVivita' : 'projectDescOthers')}</p>
        </div>
      </div>
      <div className="separator-container" />

      <div className="body">
        <div className="grid">
          <div className="grid-column">
            <div className="widget-box">
              <div className="project-header">
                <div className="project-title">
                  {project?.authorUsers?.length > 1 ? (
                    <div className="project-creators">
                      <MyImage
                        src={project?.authorUsers?.[1]?.profileImageUri}
                        alt="profile"
                        defaultImage={DefaultCreatorPicture}
                        width={DEFAULT_PROFILE_IMAGE_SIZE}
                        isLoading={isProjectLoading}
                      />
                      <MyImage
                        src={project?.authorUsers?.[0]?.profileImageUri}
                        alt="profile"
                        defaultImage={DefaultCreatorPicture}
                        width={DEFAULT_PROFILE_IMAGE_SIZE}
                        isLoading={isProjectLoading}
                      />
                    </div>
                  ) : (
                    <div className="profile-image">
                      <MyImage
                        src={project?.authorUsers?.[0]?.profileImageUri}
                        alt="profile"
                        defaultImage={DefaultCreatorPicture}
                        width={DEFAULT_PROFILE_IMAGE_SIZE}
                        isLoading={isProjectLoading}
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
                        <BadgeItem preloadedData={v} id={v.id} imageOnly />
                      </li>
                    ))}
                  </ul>
                  <div className="project-badges-text">{t('Badges Awarded')}</div>
                </div>
                )}
              </div>

              <div className="widget-box-content">
                <div className="timeline-information-list">
                  <Loading show={isProjectLoading} size="24px" />
                  {project && (
                    <ProjectSection
                      isRootProject
                      isAuthor={isAuthor}
                      section={project}
                      projectId={project?.id}
                      reloadProject={reloadProject}
                    />
                  )}
                  <Loading show={isProjectSectionLoading} size="24px" />
                  {project && projectSections.map((v) => (
                    <ProjectSection
                      key={`section_${v.id}`}
                      isAuthor={isAuthor}
                      section={v}
                      projectId={project?.id}
                      reloadProject={reloadProject}
                    />
                  ))}
                  {isAuthor && (
                  <div className="add-button">
                    {t('Got an update on this project? Share it here!')}
                    <Link to={`/submit-project/${id}/section`}>
                      <Button
                        parentClassName="add-button"
                      >
                        {t('Add Project Update')}
                      </Button>
                    </Link>
                  </div>
                  )}
                </div>
              </div>
              <div className="project-likes">
                <div className="project-likes-text">
                  {t('Were you inspired? Hit the like button to let the creators know!')}
                </div>
                <div className="project-likes-wrapper">
                  <div className={`project-likes-button ${isUserLiked ? 'active' : ''}`} onClick={handleLikeToggle}>
                    <Button
                      parentClassName={
                      `like-button ${isUserLiked ? 'active' : ''}`
                    }
                      status={isLikeLoading ? 'loading' : 'thumbs-up'}
                      type="button"
                    />
                    <div className={`likes-count ${isUserLiked ? 'active' : ''}`}>
                      {' '}
                      {t('like', { count: projectLikes })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Comments projectId={id} />

            {user.institutionId === 1 && (
              <div className="widget-box chat">
                <div className="header-wrapper">
                  <div className="widget-box-chat-title">
                    {t('Chat')}
                  </div>
                  <NavLink className="chat-button" to="/chat">
                    {t('Go to chat')}
                  </NavLink>
                </div>
                <div className="comments-detail">
                  <div>{t('Type something here to ask the creators more about the project!')}</div>
                  <ChatSection targetUsers={project?.authorUsers} user={user} />
                </div>
              </div>
            )}
          </div>

          <div className="grid-column">
            <div className="member-item-container">
              {isProjectLoading && <Loading show size="40px" />}
              {!isProjectLoading && projectAuthorsCount < 2 && (
                <MemberItem parentClassName="member-item" id={project?.authorUsers?.[0]?.id} preloadedData={project?.authorUsers?.[0]} />
              )}
              {!isProjectLoading && projectAuthorsCount >= 2 && (
                <div className="author-list">
                  <div className="author-list-header">
                    <div className="author-list-title">
                      {t('Authors')}
                    </div>
                    <p className="author-count">
                      {projectAuthorsCount}
                    </p>
                  </div>
                  <div className="author-list-body">
                    {project?.authorUsers?.map((u) => (
                      <NavLink key={`author-user-${u.id}`} className="author-list-item" to={`/member/${u.id}`}>
                        <div className="author-info">
                          <MyImage
                            src={u.profileImageUri}
                            alt="profile"
                            defaultImage={DefaultCreatorPicture}
                            width={DEFAULT_PROFILE_IMAGE_SIZE}
                            isLoading={isProjectLoading}
                          />
                          <p className="author-name">{u.name}</p>
                        </div>
                        <p className="author-role">
                          {u.role}
                        </p>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid-column">
            <div className="widget-box">
              <div className="other-projects-title">
                {t('Other projects')}
              </div>
              <div className="other-projects">
                <Loading show={isRandomProjectsLoading} size="24px" />
                <ul className="project-list">
                  {randomProjects.slice(0, 2).map((v) => (
                    <li key={`random-project_${v.id}`}>
                      <ProjectItem preloadedData={v} id={v.id} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default WorkInProgress;
