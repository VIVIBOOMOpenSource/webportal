import './project-form.scss';

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Button from 'src/components/common/button/button';
import EmbeddedYoutubeLinkManipulator from 'src/js/editor/embeddedYoutubeLinkManipulator';
import Joyride from 'src/components/common/joyride/joyride';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { useSelector } from 'react-redux';
import UserApi from 'src/apis/viviboom/UserApi';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import EditorApi from 'src/apis/viviboom/EditorApi';
import ProjectPhotos from './project-photos';
import ProjectFiles from './project-files';
import SelectBadges from './select-badges';
import TagInput from './tag-input';
import ScratchOption from './wysiwyg-scratch-toolbar-option';
import ProjectVideos from './project-videos';
import SelectProjectThumbnail from './select-project-thumbnail';
import ProjectAuthors from './project-authors';

function ProjectForm({
  sectionOnly,
  handlePublish,
  handleDelete,
  markDocumentDirty,
  markMediaDirty,

  projectId,
  sectionId,

  name,
  setName,

  description,
  setDescription,

  editorState,
  setEditorState,

  images,
  setImages,

  videos,
  setVideos,

  thumbnailUri,
  setThumbnailUri,

  files,
  setFiles,

  isCompleted,
  setCompleted,

  badgesAndChallenges,
  setBadgesAndChallenges,

  projectCategories,
  setProjectCategories,

  authorUserId,
  authors,
  setAuthors,

  saving,
  loading,
}) {
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const history = useHistory();
  const [showNext, setShowNext] = useState(false);
  const [joyrideRun, setJoyrideRun] = useState(false);
  const [joyrideStepIndex, setJoyrideStepIndex] = useState(0);

  async function uploadImageCallBack(image) {
    const response = await EditorApi.postImage({ authToken: user.authToken, file: image });

    return { data: { link: response.data.url } };
  }

  // handlers
  const handleClickNext = () => {
    if (!sectionOnly && !name) return toast.error(t('Please give your project a title'));
    if (!sectionOnly && videos.length > 0 && !thumbnailUri) return toast.error(t('Please select a thumbnail for your project'));
    if (sectionOnly && (images.length <= 0 && videos.length <= 0)) return toast.error(t('Please upload a video or photo of your project'));

    setShowNext(true);
    setJoyrideRun(true);
    return document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    markDocumentDirty();
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    markDocumentDirty();
  };

  const handleEditorStateChange = (e) => {
    setEditorState(e);
    markDocumentDirty();
  };

  const handleToggleComplete = (e) => {
    if (e.target.value === 'completed') {
      setCompleted(true);
      setJoyrideStepIndex(2);
      setJoyrideRun(false);
    } else setCompleted(false);
    markDocumentDirty();
  };

  const handleJoyrideCallback = async (data) => {
    const {
      action, index, status, type,
    } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setJoyrideRun(false);
      setJoyrideStepIndex(0);

      const { id, authToken } = user;
      await UserApi.patch({ userId: id, authToken, isCompletedCreateProjectTutorial: true });
      await UserReduxActions.fetch();
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setJoyrideStepIndex(nextStepIndex);
    }
  };

  return (
    <div className="project-contents">
      <Joyride
        outsideRun={joyrideRun}
        sectionType={TutorialSectionType.PROJECT_FORM}
        stepIndex={joyrideStepIndex}
        callback={handleJoyrideCallback}
        scrollOffset={100}
      />
      <form className="project-form" onSubmit={handlePublish}>
        {!showNext && (
          <div>
            {!sectionOnly && (
              <div>
                <div className="title">{t('Project Title (Required)')}</div>
                <input value={name} type="text" onChange={handleNameChange} placeholder={t('Project Title')} required />
                <div className="title">{t('What Inspired You? (Optional)')}</div>
                <textarea value={description} onChange={handleDescriptionChange} />
              </div>
            )}

            <div>
              <ProjectVideos videos={videos} setVideos={setVideos} projectId={projectId} sectionId={sectionId} />
              <ProjectPhotos images={images} setImages={setImages} markMediaDirty={markMediaDirty} />
              {!sectionOnly && <SelectProjectThumbnail videos={videos} images={images} thumbnailUri={thumbnailUri} setThumbnailUri={setThumbnailUri} markDocumentDirty={markDocumentDirty} />}
              <ProjectFiles files={files} setFiles={setFiles} markMediaDirty={markMediaDirty} />
              <div className="editor-container">
                <div className="title">
                  {!sectionOnly
                    ? t('How Did You Make This? (Optional! You can write this in your project update later)')
                    : t('What updates did you make to this project?')}
                </div>
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbar"
                  wrapperClassName="wrapper"
                  editorClassName="editor"
                  onEditorStateChange={handleEditorStateChange}
                  toolbar={{
                    embedded: {
                      embedCallback: EmbeddedYoutubeLinkManipulator,
                    },
                    image: {
                      popupClassName: 'rdw-image-popup',
                      previewImage: true,
                      uploadEnabled: true,
                      uploadCallback: uploadImageCallBack,
                    },
                  }}
                  toolbarCustomButtons={[<ScratchOption key="editor-scatch" />]}
                />
              </div>
            </div>
          </div>
        )}

        {showNext && (
          <div>
            {!sectionOnly && (
              <div className="project-categories">
                <div className="title">{t('Project Categories')}</div>
                <div>{t('To add a new category, type in your category and press Enter.')}</div>
                <TagInput
                  projectCategories={projectCategories}
                  setProjectCategories={setProjectCategories}
                  markDocumentDirty={markDocumentDirty}
                />
              </div>
            )}
            <div className="wip-buttons">
              <div className="title">
                {t(!sectionOnly ? 'Is this a work-in-progress or completed project?' : 'Is this a work-in-progress or completed project update?')}
              </div>
              <label className="container">
                <input type="radio" name="radio" value="completed" onChange={handleToggleComplete} required />
                <span className="checkmark" />
                {t('Completed')}
              </label>
              <label className="container">
                <input type="radio" name="radio" value="wip" onChange={handleToggleComplete} />
                <span className="checkmark" />
                {t('Work-In-Progress')}
              </label>
            </div>
            {isCompleted && !sectionOnly && (
              <SelectBadges
                badgesAndChallenges={badgesAndChallenges}
                setBadgesAndChallenges={setBadgesAndChallenges}
                markDocumentDirty={markDocumentDirty}
                onFinishedLoading={() => setJoyrideRun(true)}
              />
            )}
            {!sectionOnly && <ProjectAuthors authorUserId={authorUserId} authors={authors} setAuthors={setAuthors} markDocumentDirty={markDocumentDirty} />}
            <div className="project-buttons">
              <Button parentClassName="back-button" status={loading ? 'loading' : 'back'} onClick={() => setShowNext(false)}>
                {t('Back')}
              </Button>
              <Button parentClassName="delete-button" status={loading ? 'loading' : 'delete'} onClick={handleDelete}>
                {t('Delete')}
              </Button>
              <Button parentClassName="save-button" status={loading || saving ? 'loading' : 'save'} type="submit" value={t('Post')} />
            </div>
          </div>
        )}

        {showNext === false && (
          <div className="action-buttons">
            <Button parentClassName="back-button" className="back" status="back" onClick={() => history.push(projectId ? `/project/${projectId}` : '/projects')}>
              {t('Back')}
            </Button>
            <Button
              parentClassName="next-button"
              className="next"
              status="next"
              onClick={handleClickNext}
            >
              {t('Next')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProjectForm;
