import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import {
  useHistory, Link, NavLink, useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trans, useTranslation } from 'react-i18next';

import './badge.scss';

import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import BadgeApi from 'src/apis/viviboom/BadgeApi';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import ChatApi from 'src/apis/viviboom/ChatApi';
import ProjectApi from 'src/apis/viviboom/ProjectApi';
import MyImage from 'src/components/common/MyImage';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';

import ProjectItem from '../projects/project-item';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import EmbeddedYoutubeLinkManipulator from '../../../js/editor/embeddedYoutubeLinkManipulator';

import { ReactComponent as DraftSvg } from '../../../css/imgs/icon-draft.svg';
import DefaultProfilePicture from '../../../css/imgs/boom-imgs/profile/default-profile-picture.png';
import DefaultBadgePicture from '../../../css/imgs/boom-imgs/badge/default-badge-picture.png';
import Star from '../../../css/imgs/icon-star.png';
import StarOutline from '../../../css/imgs/icon-star-outline.png';
import Clock from '../../../css/imgs/icon-clock.png';
import About from '../../../css/imgs/icon-about.png';
import BackgroundImage from '../../../css/imgs/badges-bg.jpg';
import Categories from '../../../css/imgs/icon-categories.png';
import SpeechBubble from '../../../css/imgs/icon-speech.png';
import Human from '../../../css/imgs/icon-human.png';
import ChallengeItem from '../challenges/challenge-item';
import Tools from '../../../css/imgs/icon-tools.png';
import Steps from '../../../css/imgs/icon-steps.png';
import Questions from '../../../css/imgs/icon-question.png';
import Tips from '../../../css/imgs/icon-tips.png';

// number of project/awarded user thumbnail to display for a badge
const DEFAULT_PROJECT_COUNT = 4;
const DEFAULT_AWARDED_USER_COUNT = 4;

const DEFAULT_BADGE_IMAGE_SIZE = 256;
const DEFAULT_PROFILE_IMAGE_SIZE = 128;
const DEFAULT_COVER_IMAGE_SIZE = 1024;

const DEFAULT_LIMIT = 9;
const DEFAULT_CHALLENGE_LIMIT = 3;

const TALK_TO_CREW_CHANNEL_ID = 'talk-to-crew';

const difficultyLevels = {
  BEGINNER: {
    stars: [Star, StarOutline, StarOutline],
    label: 'Beginner',
  },
  INTERMEDIATE: {
    stars: [Star, Star, StarOutline],
    label: 'Intermediate',
  },
  ADVANCED: {
    stars: [Star, Star, Star],
    label: 'Advanced',
  },
};

function Badge() {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });
  const params = useParams();
  const { id } = params;

  const user = useSelector((state) => state.user);
  const history = useHistory();

  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editorStateForMaterials, setEditorStateForMaterials] = useState(EditorState.createEmpty());
  const [editorStateForSteps, setEditorStateForSteps] = useState(EditorState.createEmpty());
  const [editorStateForTips, setEditorStateForTips] = useState(EditorState.createEmpty());
  const [editorStateForQuestions, setEditorStateForQuestions] = useState(EditorState.createEmpty());

  const [awardedUsers, setAwardedUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(0);

  const [dayToComplete, setDayToComplete] = useState(0);
  const [hourToComplete, setHourToComplete] = useState(0);
  const [minutesToComplete, setMinutesToComplete] = useState(0);

  const [challenges, setChallenges] = useState();

  const projectsRef = useRef();
  const challengesRef = useRef();

  const [challengesPage, setChallengesPage] = useState(1);
  const [totalChallengesPage, setTotalChallengesPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [totalProjectsPage, setTotalProjectsPage] = useState(1);

  const badgeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  const calculateDayHourMin = (timeInMinutes) => {
    let completionTime = timeInMinutes;
    if (completionTime >= 1440) {
      setDayToComplete(Math.floor(completionTime / 1440));
      completionTime -= Math.floor(completionTime / 1440) * 1440;
    }
    if (completionTime >= 60) {
      setHourToComplete(Math.floor(completionTime / 60));
      completionTime -= Math.floor(completionTime / 60) * 60;
    }
    if (completionTime < 60) setMinutesToComplete(completionTime);
  };

  const fetchBadge = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
    try {
      const res = await BadgeApi.get({ authToken: user.authToken, badgeId: id, verboseAttributes: ['awardedUsers', 'categories', 'createdByUser'] });
      setBadge(res.data?.badge);

      const fetchedBadge = res.data?.badge;
      calculateDayHourMin(fetchedBadge?.timeToComplete);

      if (fetchedBadge.content) setEditorStateForSteps(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedBadge.content))));
      if (fetchedBadge.materialContent) setEditorStateForMaterials(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedBadge.materialContent))));
      if (fetchedBadge.tipContent) setEditorStateForTips(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedBadge.tipContent))));
      if (fetchedBadge.questionContent) setEditorStateForQuestions(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedBadge.questionContent))));
      setAwardedUsers(fetchedBadge.awardedUsers);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, user?.authToken]);

  const fetchProjects = useCallback(async () => {
    if (!user.authToken) return;

    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_LIMIT,
      offset: (projectsPage - 1) * DEFAULT_LIMIT,
      badgeId: id,
      order: ProjectOrderType.LATEST,
      isPublished: true,
    };

    setLoading(true);
    setProjects([]);
    try {
      const res = await ProjectApi.getList(requestParams);
      setProjects(res.data?.projects);
      setTotalProjectsPage(res.data?.totalPages);
      setProjectCount(res.data?.count);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, projectsPage, id]);

  const fetchChallenges = useCallback(async () => {
    if (!user.authToken) return;

    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_CHALLENGE_LIMIT,
      offset: (challengesPage - 1) * DEFAULT_LIMIT,
      challengeBadgeId: id,
      order: BadgeOrderType.LATEST,
      isPublished: true,
    };

    setLoading(true);
    setChallenges([]);
    try {
      const res = await ChallengeApi.getList(requestParams);
      setChallenges(res.data?.challenges);
      setTotalChallengesPage(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, challengesPage, id]);

  useEffect(() => {
    fetchBadge();
  }, [fetchBadge]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const sendMessageToMentor = async () => {
    if (!badge.createdByUser) return;
    await ChatApi.postMessage({ authToken: user.authToken, text: `Hi there, I want to know more about this badge - ${badge.name}!`, channelId: TALK_TO_CREW_CHANNEL_ID });
    history.push('/chat');
  };

  return (
    <div className={window.isRNWebView ? 'badge-page hide-in-app' : 'badge-page'}>
      <div className="badge-header-container">
        {user.institutionId === 1 && (
          <div className="chat-container" onClick={sendMessageToMentor}>
            <img src={SpeechBubble} alt="SpeechBubble" className="speech-bubble" />
            <div className="chat-content">
              <div className="profile-image">
                <MyImage
                  src={badge?.createdByUser?.profileImageUri}
                  alt="profile"
                  defaultImage={Human}
                  width={DEFAULT_PROFILE_IMAGE_SIZE}
                />
              </div>
              <span className="button-text">{t('Talk to the creator!')}</span>
            </div>
          </div>
        )}
        <div className="cover-image">
          {badge?.coverImageUri ? (
            <MyImage
              src={badge?.coverImageUri}
              alt="cover"
              defaultImage={BackgroundImage}
              width={DEFAULT_COVER_IMAGE_SIZE}
            />
          ) : (
            <img src={BackgroundImage} alt="badge-cover" />
          )}
        </div>
        <div className="badge-details">
          <div className={`badge-image ${badge?.name.length >= 24 ? 'long-name' : ''}`}>
            <MyImage alt="badge" src={badge?.imageUri} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} isLoading={loading} params={badgeImageParams} />
          </div>
          <div className="text">
            <div className="name">{badge?.name}</div>
            <div className="desc">{`${t('Created By')}: ${badge?.createdByUser?.name || '-'}`}</div>
          </div>
          <div className="badge-descriptions">
            {badge?.difficulty && (
              <div className="text description">
                <div className="difficulty">
                  <div className="stars">
                    {badge?.difficulty && difficultyLevels[badge.difficulty].stars.map((star, index) => (
                      <img key={`star-${index.toString()}`} alt="logo" src={star} />
                    ))}
                  </div>
                  <div className="level">
                    {badge?.difficulty && difficultyLevels[badge?.difficulty].label}
                  </div>
                </div>
              </div>
            )}
            {badge?.timeToComplete && (
              <div className="text description">
                <div className="difficulty">
                  <div className="stars">
                    <img alt="logo" src={Clock} />
                  </div>
                  <div className="level">
                    {dayToComplete !== 0 && t('day', { count: dayToComplete })}
                    {hourToComplete !== 0 && t('hour', { count: hourToComplete })}
                    {minutesToComplete !== 0 && t('minute', { count: minutesToComplete })}
                  </div>
                </div>
              </div>
            )}
            {badge?.categories[0]?.name && (
              <div className="text description">
                <div className="difficulty">
                  <div className="stars">
                    <img alt="logo" src={Categories} />
                  </div>
                  <div className="level">
                    {badge?.categories[0]?.name}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={window.isRNWebView ? 'add-on hide-in-app' : 'add-on header'}>
            <div className="separator-container">
              <div className="info">
                {projectCount > 0 && (
                  <div className="info-text">
                    {t('awardProject', { count: projectCount })}
                  </div>
                )}
              </div>
              <div className="info">
                {awardedUsers.length > 0 && (
                  <div className="info-text">
                    {t('earnedBy', { count: awardedUsers.length || 0 })}
                  </div>
                )}
              </div>
            </div>
            <div className="actions">
              <Link className="action-button" to="/submit-project">
                <DraftSvg height="24px" />
                <div className="action-button-text">{t('Add project')}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={window.isRNWebView ? 'add-on hide-in-app' : 'add-on'}>
        <div className="separator-container">

          {projectCount > 0 && (
            <div className="info">
              <div className="info-list">
                {projectCount > DEFAULT_PROJECT_COUNT && (
                  <div className="info-list-profile">
                    <div className="info-list-text">
                      +
                      {projectCount - DEFAULT_PROJECT_COUNT}
                    </div>
                  </div>
                )}
                {projects.slice(-DEFAULT_PROJECT_COUNT).map((v) => (
                  <div className="info-list-profile" key={`project_${v.id}`}>
                    <MyImage src={v.images[0]?.uri} alt="project" defaultImage={DefaultProfilePicture} width={DEFAULT_PROFILE_IMAGE_SIZE} />
                  </div>
                ))}
              </div>
              <div className="info-text">
                {t('awardProject', { count: projectCount })}
              </div>
            </div>
          )}
          {awardedUsers.length > 0 && (
            <div className="info">
              <div className="info-list">
                {awardedUsers.length > DEFAULT_AWARDED_USER_COUNT && (
                <div className="info-list-profile">
                  <div className="info-list-text">
                    +
                    {awardedUsers.length - DEFAULT_AWARDED_USER_COUNT}
                  </div>
                </div>
                )}
                {awardedUsers.slice(-DEFAULT_AWARDED_USER_COUNT).map((v) => (
                  <div className="info-list-profile" key={`awarded_user_${v.id}`}>
                    <MyImage src={v.profileImageUri} alt="awarded_user" defaultImage={DefaultProfilePicture} width={DEFAULT_PROFILE_IMAGE_SIZE} />
                  </div>
                ))}
              </div>
              <div className="info-text">
                {t('earnedBy', { count: awardedUsers.length || 0 })}
              </div>
            </div>
          )}
        </div>
        <div className="actions">
          <Link className="action-button" to="/submit-project">
            <DraftSvg height="24px" />
            <div className="action-button-text">{t('Add project')}</div>
          </Link>
        </div>
      </div>

      <div className="body">
        <div className="badge-info">
          <div className="badge-info-container">
            {badge?.description && (
              <div className="badge-container">
                <div className="icon-size">
                  <img alt="logo" src={About} />
                </div>
                <div>
                  <div className="title">{t('About this badge')}</div>
                  <div className="name">{badge?.description}</div>
                </div>
              </div>
            )}
            {badge?.materialContent && (
            <div className="how-to-earn-badge">
              <div className="icon-size">
                <img alt="logo" src={Tools} />
              </div>
              <div>
                <div className="title">{t('Required Tools & Materials')}</div>
                <div>
                  <Editor
                    editorState={editorStateForMaterials}
                    toolbarClassName="toolbar"
                    wrapperClassName="wrapper"
                    editorClassName="editor"
                    toolbarHidden
                    readOnly
                    toolbar={{
                      embedded: {
                        embedCallback: EmbeddedYoutubeLinkManipulator,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            )}
            {badge?.content && (
              <div className="how-to-earn-badge">
                <div className="icon-size">
                  <img alt="logo" src={Steps} />
                </div>
                <div>
                  <div className="title">{t('Steps to earn this badge')}</div>
                  <div>
                    <Editor
                      editorState={editorStateForSteps}
                      toolbarClassName="toolbar"
                      wrapperClassName="wrapper"
                      editorClassName="editor"
                      toolbarHidden
                      readOnly
                      toolbar={{
                        embedded: {
                          embedCallback: EmbeddedYoutubeLinkManipulator,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {badge?.tipContent && (
              <div className="how-to-earn-badge">
                <div className="icon-size">
                  <img alt="logo" src={Tips} />
                </div>
                <div>
                  <div className="title">{t('Useful Tips')}</div>
                  <div>
                    <Editor
                      editorState={editorStateForTips}
                      toolbarClassName="toolbar"
                      wrapperClassName="wrapper"
                      editorClassName="editor"
                      toolbarHidden
                      readOnly
                      toolbar={{
                        embedded: {
                          embedCallback: EmbeddedYoutubeLinkManipulator,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {badge?.questionContent && (
              <div className="how-to-earn-badge">
                <div className="icon-size">
                  <img alt="logo" src={Questions} />
                </div>
                <div>
                  <div className="title">{t('Commonly Asked Questions')}</div>
                  <div>
                    <Editor
                      editorState={editorStateForQuestions}
                      toolbarClassName="toolbar"
                      wrapperClassName="wrapper"
                      editorClassName="editor"
                      toolbarHidden
                      readOnly
                      toolbar={{
                        embedded: {
                          embedCallback: EmbeddedYoutubeLinkManipulator,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              {challenges?.length > 0 && (
                <div className="badge-challenges" ref={challengesRef}>
                  <div className="mini-title">
                    {t('Challenges for this Badge')}
                  </div>
                  <Loading loading={loading} size="40px" />
                  <ul className="badges-list">
                    {challenges?.map((v) => (
                      <li key={`challenge_${v.id}`}>
                        <ChallengeItem preloadedData={v} id={v.id} />
                      </li>
                    ))}
                  </ul>
                  <div className="badge-projects-main-footer">
                    {totalChallengesPage > 1 && (
                      <Pagination page={challengesPage} totalPages={totalChallengesPage} setPage={setChallengesPage} scrollToRef={challengesRef.current} />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="badge-projects" ref={projectsRef}>
                {projects.length > 0
                  ? (
                    <>
                      <div className="mini-title">
                        {t('Projects for this badge by VIVINAUTS!')}
                      </div>
                      <Loading loading={loading} size="40px" />
                      <ul className="projects-list">
                        {projects.map((v) => (
                          <li key={`project_${v.id}`}>
                            <ProjectItem preloadedData={v} id={v.id} />
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                  : (
                    <div className="mini-title">
                      <Trans i18nKey="badges.submitProject">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        No project has been added to this badge! Be the first to <NavLink className="submit-link" strict to="/submit-project">submit!</NavLink>
                      </Trans>
                    </div>
                  )}
                <div className="badge-projects-main-footer">
                  {totalProjectsPage > 1 && (
                    <Pagination page={projectsPage} totalPages={totalProjectsPage} setPage={setProjectsPage} scrollToRef={projectsRef.current} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Badge;
