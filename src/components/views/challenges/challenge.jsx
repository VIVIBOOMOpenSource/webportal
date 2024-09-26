import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import {
  useHistory, Link, NavLink, useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trans, useTranslation } from 'react-i18next';

import './challenge.scss';

import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import { BuilderPalChatType } from 'src/enums/BuilderPalChatType';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import BadgeApi from 'src/apis/viviboom/BadgeApi';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import ChatApi from 'src/apis/viviboom/ChatApi';
import ProjectApi from 'src/apis/viviboom/ProjectApi';
import MyImage from 'src/components/common/MyImage';
import { ReactComponent as ChatSVG } from 'src/css/imgs/icon-message.svg';
import { ReactComponent as CloseSVG } from 'src/css/imgs/icon-close.svg';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';

import ProjectItem from '../projects/project-item';
import EmbeddedYoutubeLinkManipulator from '../../../js/editor/embeddedYoutubeLinkManipulator';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ReactComponent as DraftSvg } from '../../../css/imgs/icon-draft.svg';
import DefaultProfilePicture from '../../../css/imgs/boom-imgs/profile/default-profile-picture.png';
import DefaultBadgePicture from '../../../css/imgs/boom-imgs/badge/default-badge-picture.png';
import Star from '../../../css/imgs/icon-star.png';
import StarOutline from '../../../css/imgs/icon-star-outline.png';
import Clock from '../../../css/imgs/icon-clock.png';
import Tools from '../../../css/imgs/icon-tools.png';
import Steps from '../../../css/imgs/icon-steps.png';
import Questions from '../../../css/imgs/icon-question.png';
import Tips from '../../../css/imgs/icon-tips.png';
import About from '../../../css/imgs/icon-about.png';
import BackgroundImage from '../../../css/imgs/badges-bg.jpg';
import Categories from '../../../css/imgs/icon-categories.png';
import SpeechBubble from '../../../css/imgs/icon-speech.png';
import Human from '../../../css/imgs/icon-human.png';
import BadgeItem from '../badges/badge-item';
import ChatInterface from '../builder-pal/chat-interface';

// number of project/awarded user thumbnail to display for a challenge
const DEFAULT_PROJECT_COUNT = 4;
const DEFAULT_AWARDED_USER_COUNT = 4;

const DEFAULT_CHALLENGE_IMAGE_SIZE = 256;
const DEFAULT_PROFILE_IMAGE_SIZE = 128;
const DEFAULT_COVER_IMAGE_SIZE = 1024;

const DEFAULT_LIMIT = 9;

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

function Challenge() {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const params = useParams();
  const { id } = params;

  const user = useSelector((state) => state.user);
  const history = useHistory();

  const [challenge, setChallenge] = useState(null);
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

  const [challengeBadges, setChallengeBadges] = useState([]);

  const projectsRef = useRef();
  const badgesRef = useRef();

  const [badgesPage, setBadgesPage] = useState(1);
  const [totalBadgesPage, setTotalBadgesPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [totalProjectsPage, setTotalProjectsPage] = useState(1);

  const [guidanceChatId, setGuidanceChatId] = useState();
  const [showGuidanceChat, setShowGuidanceChat] = useState(false);

  const challengeImageParams = useMemo(() => ({ suffix: 'png' }), []);

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

  const fetchChallenge = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
    try {
      const res = await ChallengeApi.get({ authToken: user.authToken, challengeId: id, verboseAttributes: ['awardedUsers', 'categories', 'createdByUser'] });
      setChallenge(res.data?.challenge);

      const fetchedChallenge = res.data?.challenge;
      calculateDayHourMin(fetchedChallenge?.timeToComplete);
      setAwardedUsers(fetchedChallenge?.awardedUsers);

      if (fetchedChallenge.content) setEditorStateForSteps(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedChallenge.content))));
      if (fetchedChallenge.materialContent) setEditorStateForMaterials(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedChallenge.materialContent))));
      if (fetchedChallenge.tipContent) setEditorStateForTips(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedChallenge.tipContent))));
      if (fetchedChallenge.questionContent) setEditorStateForQuestions(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedChallenge.questionContent))));
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, user.authToken]);

  const fetchChallengeBadges = useCallback(async () => {
    if (!user.authToken) return;

    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_LIMIT,
      offset: (badgesPage - 1) * DEFAULT_LIMIT,
      challengeId: id,
      order: BadgeOrderType.LATEST,
      isPublished: true,
    };

    setLoading(true);
    setChallengeBadges([]);
    try {
      const res = await BadgeApi.getList(requestParams);
      setChallengeBadges(res.data?.badges);
      setTotalBadgesPage(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, badgesPage, id]);

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

  const loadChat = useCallback(async () => {
    if (!id) return;
    if (user?.institutionId !== 1) return;
    try {
      const res = await BuilderPalApi.post({ authToken: user.authToken, type: BuilderPalChatType.GUIDANCE_CHALLENGE, challengeId: id });
      setGuidanceChatId(res?.data?.chatId);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [id, user.authToken]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchChallengeBadges();
  }, [fetchChallengeBadges]);

  const sendMessageToMentor = async () => {
    if (!challenge.createdByUser) return;
    await ChatApi.postMessage({ authToken: user.authToken, text: `Hi there, I want to know more about this challenge - ${challenge.name}!`, channelId: TALK_TO_CREW_CHANNEL_ID });
    history.push('/chat');
  };

  return (
    <div className={window.isRNWebView ? 'challenge-page hide-in-app' : 'challenge-page'}>
      <div className="challenge-header-container">
        {user?.institutionId === 1 && (
          <div className="chat-container" onClick={sendMessageToMentor}>
            <img src={SpeechBubble} alt="SpeechBubble" className="speech-bubble" />
            <div className="chat-content">
              <div className="profile-image">
                <MyImage
                  src={challenge?.createdByUser?.profileImageUri}
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
          {challenge?.coverImageUri ? (
            <MyImage
              src={challenge?.coverImageUri}
              alt="cover"
              defaultImage={BackgroundImage}
              width={DEFAULT_COVER_IMAGE_SIZE}
            />
          ) : (
            <img src={BackgroundImage} alt="challenge-cover" />
          )}
        </div>
        <div className="challenge-details">
          <div className="basic-challenge-info">
            <div className="challenge-image-container">
              <MyImage alt="challenge" src={challenge?.imageUri} defaultImage={DefaultBadgePicture} width={DEFAULT_CHALLENGE_IMAGE_SIZE} isLoading={loading} params={challengeImageParams} />
            </div>
            <div className="text">
              <div className="name">{challenge?.name}</div>
              <div className="desc">{`${t('Created By')}: ${challenge?.createdByUser?.name || '-'}`}</div>
            </div>
          </div>
          <div className="challenge-specs-container">
            {challenge?.difficulty && (
              <div className="challenge-spec">
                <div className="spec-icon">
                  {challenge?.difficulty && difficultyLevels[challenge.difficulty].stars.map((star, index) => (
                    <img key={`star-${index.toString()}`} alt="logo" src={star} />
                  ))}
                </div>
                <div className="spec-text">
                  {challenge?.difficulty && difficultyLevels[challenge?.difficulty].label}
                </div>
              </div>
            )}
            {challenge?.timeToComplete && (
            <div className="challenge-spec">
              <div className="spec-icon">
                <img alt="logo" src={Clock} />
              </div>
              <div className="spec-text">
                {dayToComplete !== 0 && t('day', { count: dayToComplete })}
                {hourToComplete !== 0 && t('hour', { count: hourToComplete })}
                {minutesToComplete !== 0 && t('minute', { count: minutesToComplete })}
              </div>
            </div>
            )}
            {challenge?.categories[0]?.name && (
              <div className="challenge-spec">
                <div className="spec-icon">
                  <img alt="logo" src={Categories} />
                </div>
                <div className="spec-text">
                  {challenge?.categories[0]?.name}
                </div>
              </div>
            )}
          </div>
          <div className="challenge-participation-stats-header">
            <div className="separator-container">
              <div className="info">
                {projectCount > 0 && (
                  <div className="info-text">
                    {t('awardProject', { count: projectCount })}
                  </div>
                )}
              </div>
              <div className="info">
                {awardedUsers?.length > 0 && (
                  <div className="info-text">
                    {t('earnChallenge', { count: awardedUsers?.length || 0 })}
                  </div>
                )}
              </div>
            </div>
            <div className="actions">
              <Link className="action-button" to="/submit-project">
                <DraftSvg height="24px" />
                <div className="action-button-text">{t('Attempt Challenge')}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="challenge-participation-stats">
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
                {t('awardProject', { count: projectCount || 0 })}
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
                {t('earnChallenge', { count: awardedUsers.length || 0 })}
              </div>
            </div>
          )}
        </div>
        <div className="actions">
          <Link className="action-button" to="/submit-project">
            <DraftSvg height="24px" />
            <div className="action-button-text">{t('Attempt Challenge')}</div>
          </Link>
        </div>
      </div>

      <div className="body">
        <div className="challenge-info">
          <div className="challenge-info-container">
            {challenge?.description && (
              <div className="challenge-container">
                <div className="icon-size">
                  <img alt="logo" src={About} />
                </div>
                <div>
                  <div className="title">{t('About this challenge')}</div>
                  <div className="name">{challenge?.description}</div>
                </div>
              </div>
            )}
            {challenge?.materialContent && (
              <div className="how-to-earn-challenge">
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
            {challenge?.content && (
              <div className="how-to-earn-challenge">
                <div className="icon-size">
                  <img alt="logo" src={Steps} />
                </div>
                <div>
                  <div className="title">{t('Steps to earn this challenge')}</div>
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
            {challenge?.tipContent && (
              <div className="how-to-earn-challenge">
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
            {challenge?.questionContent && (
              <div className="how-to-earn-challenge">
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
              {challengeBadges?.length > 0 && (
                <div className="challenge-badges" ref={badgesRef}>
                  <div className="mini-title">
                    {t('Potential Badges for Challenges')}
                  </div>
                  <Loading loading={loading} size="40px" />
                  <ul className="challenges-list">
                    {challengeBadges?.map((v) => (
                      <li key={`challenge_${v.id}`}>
                        <BadgeItem preloadedData={v} id={v.id} hideDescription />
                      </li>
                    ))}
                  </ul>
                  <div className="challenge-projects-main-footer">
                    {totalBadgesPage > 1 && (
                      <Pagination page={badgesPage} totalPages={totalBadgesPage} setPage={setBadgesPage} scrollToRef={badgesRef.current} />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="challenge-projects" ref={projectsRef}>
                {projects.length > 0
                  ? (
                    <>
                      <div className="mini-title">
                        {t('VIVINAUT Projects for this Challenge')}
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
                      <Trans i18nKey="challenges.submitProject">
                        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                        No project has been added to this challenge! Be the first to <NavLink className="submit-link" strict to="/submit-project">submit!</NavLink>
                      </Trans>
                    </div>
                  )}
                <div className="challenge-projects-main-footer">
                  {totalProjectsPage > 1 && (
                    <Pagination page={projectsPage} totalPages={totalProjectsPage} setPage={setProjectsPage} scrollToRef={projectsRef.current} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user?.institutionId === 1 && (
      <>
        <button type="button" className="chat-bubble" onClick={() => setShowGuidanceChat((b) => !b)}>
          <ChatSVG />
        </button>
        <div className={showGuidanceChat ? 'chat-bot active' : 'chat-bot'}>
          <ChatInterface chatId={guidanceChatId} hidePrompt />
          <button type="button" className="close-button" onClick={() => setShowGuidanceChat(false)}>
            <CloseSVG />
          </button>
        </div>
      </>
      )}
    </div>
  );
}

export default Challenge;
