import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Player } from '@lottiefiles/react-lottie-player';

import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import Button from 'src/components/common/button/button';
import MyImage from 'src/components/common/MyImage';
import Loading from 'src/components/common/loading/loading';
import './builder-pal-project.scss';

import builderPalProjectAnim from 'src/css/lotties/builder-pal-project.json';
import builderPalLoadingAnim from 'src/css/lotties/builder-pal-loading.json';
import DefaultBeginnerPicture from 'src/css/imgs/boom-imgs/quest/cover/03.png';
import DefaultIntermediatePicture from 'src/css/imgs/boom-imgs/quest/cover/02.png';
import DefaultAdvancedPicture from 'src/css/imgs/boom-imgs/quest/cover/01.png';
import Star from 'src/css/imgs/icon-star.png';
import StarOutline from 'src/css/imgs/icon-star-outline.png';
import { ReactComponent as ChatSVG } from 'src/css/imgs/icon-message.svg';
import { ReactComponent as CloseSVG } from 'src/css/imgs/icon-close.svg';
import { ReactComponent as BackSVG } from 'src/css/imgs/icon-arrow-back.svg';
import { ReactComponent as HomeSVG } from 'src/css/imgs/icon-home.svg';
import { ReactComponent as ForwardSVG } from 'src/css/imgs/icon-arrow-forward.svg';
import { ReactComponent as HeartSvg } from 'src/css/imgs/icon-heart-outline.svg';
import { BuilderPalChatType } from 'src/enums/BuilderPalChatType';
import ChatInterface from './chat-interface';

const DEFAULT_CHALLENGE_IMAGE_SIZE = 256;

const difficultyLevels = {
  BEGINNER: {
    stars: [Star, StarOutline, StarOutline],
    label: 'Beginner',
    defaultBackgroundImage: DefaultBeginnerPicture,
  },
  INTERMEDIATE: {
    stars: [Star, Star, StarOutline],
    label: 'Intermediate',
    defaultBackgroundImage: DefaultIntermediatePicture,
  },
  ADVANCED: {
    stars: [Star, Star, Star],
    label: 'Advanced',
    defaultBackgroundImage: DefaultAdvancedPicture,
  },
};

function BuilderPalProject() {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const user = useSelector((state) => state.user);

  const params = useParams();
  const history = useHistory();
  const { chatId, chatProjectId } = params;

  const [project, setProject] = useState();
  const [loading, setLoading] = useState();

  const [guidanceChatId, setGuidanceChatId] = useState();

  const [showGuidanceChat, setShowGuidanceChat] = useState(false);

  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);

  const [isUserSaved, setUserSaved] = useState(project?.isSaved);

  const fetchProject = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);
    try {
      const res = await BuilderPalApi.getProject({
        authToken: user.authToken, chatId, chatProjectId, shouldGenerateProjectDetails: true,
      });
      setProject(res.data?.project);
      setUserSaved(!!res.data?.project?.isSaved);
      if (res.data?.project?.guidanceChatId) {
        setGuidanceChatId(res.data?.project?.guidanceChatId);
      } else {
        const guidanceChatResult = await BuilderPalApi.post({ authToken: user.authToken, type: BuilderPalChatType.GUIDANCE, chatProjectId });
        setGuidanceChatId(guidanceChatResult.data?.chatId);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [chatId, chatProjectId, user.authToken]);

  const saveToggle = async (e) => {
    e.preventDefault();
    try {
      await BuilderPalApi.patchProject({
        authToken: user.authToken, chatId, projectId: project?.id, isSaved: !isUserSaved,
      });
      if (!isUserSaved) toast.success('Project Added to Favorites!');
      setUserSaved((b) => !b);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const { day: dayToComplete, hour: hourToComplete, minute: minutesToComplete } = useMemo(() => {
    let day = 0;
    let hour = 0;
    let minute = 0;

    let completionTime = project?.timeToComplete;
    if (completionTime >= 1440) {
      day = Math.floor(completionTime / 1440);
      completionTime -= Math.floor(completionTime / 1440) * 1440;
    }
    if (completionTime >= 60) {
      hour = Math.floor(completionTime / 60);
      completionTime -= Math.floor(completionTime / 60) * 60;
    }
    if (completionTime < 60) minute = completionTime;

    return { day, hour, minute };
  }, [project?.timeToComplete]);

  const isLastStep = currentInstructionIndex + 1 === (project?.instructions?.length ?? -1);

  return (
    <div className="builder-pal-project">
      <div className="builder-pal">
        <h3 className="title">Build with BuilderPal!</h3>
        <div className="builder-pal-project-container">
          <div className="project-prompt-container">
            <div className="project-prompt">
              {loading ? (
                <Player
                  autoplay
                  loop
                  src={builderPalLoadingAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              ) : (
                <Player
                  autoplay
                  loop
                  src={builderPalProjectAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              <h4 className="guiding-title">
                {loading ? 'Hold up a sec, tweaking project details in my mind!' : 'Check out the details of the project. Ready to kick off the creative journey?'}
              </h4>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${chatId}/projects`)}>Show me the other projects</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${chatId}`)}>Uh... We should talk more</Button>
              <p className="guiding-hint">Psst! Wanna chat? Hit the button in the bottom right corner anytime!</p>
            </div>
            <Button parentClassName="home" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
          </div>
          {!loading && currentInstructionIndex === -1 && (
            <div className="project-detail">
              <div className="project-card">
                <MyImage alt="builderpal-project" src={project?.imageUri} defaultImage={difficultyLevels[project?.difficulty]?.defaultBackgroundImage} width={DEFAULT_CHALLENGE_IMAGE_SIZE} />
                <div className="project-card-detail">
                  <p className="title">{project?.title}</p>
                  <p className="description">{project?.description}</p>
                  <div className="project-card-info">
                    <div className="info-container">
                      <p className="info-text">{project?.difficulty}</p>
                      <p className="info-title">Difficulty</p>
                    </div>
                    <div className="separator" />
                    <div className="info-container">
                      <p className="info-text">
                        {dayToComplete !== 0 && t('day', { count: dayToComplete })}
                        {hourToComplete !== 0 && t('hour', { count: hourToComplete })}
                        {minutesToComplete !== 0 && t('minute', { count: minutesToComplete })}
                      </p>
                      <p className="info-title">Duration</p>
                    </div>
                    <div className="separator" />
                    <div className="info-container">
                      <p className="info-text">{project?.categories?.[0]?.name}</p>
                      <p className="info-title">Category</p>
                    </div>
                  </div>
                </div>
                <span className={`like-button ${isUserSaved ? 'active' : ''}`} onClick={saveToggle}>
                  <HeartSvg className="heart-button" />
                  <div className="text">{isUserSaved ? 'Marked as Favorite' : 'Add to Favorites!'}</div>
                </span>
                <Button parentClassName="back-button" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
              </div>
              <div className="project-card">
                <div className="project-resource">
                  <p className="title">Materials & Resources</p>
                  {project?.resources?.map((resource) => (
                    <div key={resource.name} className="checkbox-line">
                      <input type="checkbox" />
                      <p className="resource">{resource.name}</p>
                    </div>
                  ))}
                  <p className="tags">
                    Tags:
                    {' '}
                    {project?.categories?.map((category) => category.name)?.join(', ')}
                  </p>
                </div>
              </div>
              <div className="project-card">
                <div className="project-steps">
                  <p className="title">Steps Overview</p>
                  {project?.instructions?.map((instruction, index) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div key={instruction.title} className="timeline" onClick={() => setCurrentInstructionIndex(index)}>
                      <p className="step">{instruction.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Button parentClassName="next-button" onClick={() => setCurrentInstructionIndex(0)}>Let&apos;s Start Building!</Button>
            </div>
          )}
          {!loading && currentInstructionIndex >= 0 && (
            <div className="project-detail">
              <div className="project-card">
                <MyImage alt="builderpal-project" src={project?.imageUri} defaultImage={difficultyLevels[project?.difficulty]?.defaultBackgroundImage} width={DEFAULT_CHALLENGE_IMAGE_SIZE} />
                <div className="project-step-detail">
                  <p className="title">{project?.instructions?.[currentInstructionIndex]?.title}</p>
                  <p className="description">{project?.instructions?.[currentInstructionIndex]?.content}</p>
                </div>
              </div>
              <div className="nav-buttons">
                <Button parentClassName={currentInstructionIndex === 0 ? 'nav-button home' : 'nav-button'} onClick={() => setCurrentInstructionIndex((i) => i - 1)}>
                  <BackSVG style={{ marginRight: '8px' }} />
                  <p>{currentInstructionIndex === 0 ? 'Project Detail' : 'Back'}</p>
                </Button>
                <Button disabled={isLastStep} parentClassName="nav-button" onClick={() => setCurrentInstructionIndex((i) => i + 1)}>
                  <p>{isLastStep ? 'This is the last step' : 'Next'}</p>
                  {!isLastStep && <ForwardSVG style={{ marginLeft: '8px' }} />}
                </Button>
              </div>
            </div>
          )}
          {loading && (
            <div className="project-detail">
              <div className="loader-container">
                <Loading show size={18} />
                <p className="loader-text">BuilderPal is thinking hard...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <button type="button" className="chat-bubble" onClick={() => setShowGuidanceChat((b) => !b)}>
        <ChatSVG />
      </button>
      <div className={showGuidanceChat ? 'chat-bot active' : 'chat-bot'}>
        <ChatInterface chatId={guidanceChatId} hidePrompt />
        <button type="button" className="close-button" onClick={() => setShowGuidanceChat(false)}>
          <CloseSVG />
        </button>
      </div>
    </div>
  );
}

export default BuilderPalProject;
