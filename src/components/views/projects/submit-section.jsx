/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import './submit-section.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import useInterval from 'src/hooks/useInterval';

import ProjectApi from 'src/apis/viviboom/ProjectApi';
import ProjectForm from './project-content/project-form';

const SAVE_INTERVAL = 10000;

function SubmitSection() {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const params = useParams();
  const { projectId, sectionId } = params;

  const history = useHistory();
  const authToken = useSelector((state) => state?.user?.authToken);

  // dirty flag to track if project form is modified
  const [isDirty, setDirty] = useState(false);
  const [isMediaDirty, setMediaDirty] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isMediaSaving, setMediaSaving] = useState(false);

  // regular form data
  const [id, setId] = useState(null); // projectSectionId
  const [isCompleted, setCompleted] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // array data
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);

  // copies for array patching
  const [prevImages, setPrevImages] = useState([]);
  const [prevFiles, setPrevFiles] = useState([]);

  // state to trigger project publish
  const [shouldPublish, setShouldPublish] = useState(false);

  const fetchSection = useCallback(async () => {
    if (!sectionId || !authToken) return;
    setLoading(true);
    try {
      const res = await ProjectApi.getSection({ authToken, projectSectionId: sectionId });

      const fetchedSection = res.data?.projectSection;
      setId(fetchedSection.id);
      setCompleted(fetchedSection.isCompleted);
      if (fetchedSection?.content) setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedSection?.content))));
      setImages(fetchedSection.images);
      setVideos(fetchedSection.videos);
      setFiles(fetchedSection.files);

      setPrevImages(fetchedSection.images);
      setPrevFiles(fetchedSection.files);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [authToken, sectionId]);

  const createSection = useCallback(async () => {
    if (!projectId || !authToken) return null;
    try {
      const res = await ProjectApi.postSection({ authToken, projectId });
      // this is to prevent stale state (null) leading to setting a new section
      let resId = null;
      setId((prevId) => {
        resId = prevId || res.data?.projectSectionId;
        return prevId || res.data?.projectSectionId;
      });
      return resId;
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    return null;
  }, [authToken, projectId]);

  const saveSection = useCallback(async ({ isPublished } = { isPublished: false }) => {
    if (!authToken) return;
    console.log('try saving......');
    // check if dirty
    if (!projectId) return;
    if (!isDirty && !isPublished) return;

    setSaving(true);
    // if there is no id, this is a brand new section, use post to create a new project section
    // then use patch to modify the existing project section
    try {
      if (!id) return;

      // patching
      const reqBody = {
        authToken,
        projectSectionId: id,
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        isCompleted,
      };

      if (isPublished) reqBody.isPublished = isPublished;

      await ProjectApi.patchSection(reqBody);

      // form is no longer dirty after save
      setDirty(false);
      if (isPublished) {
        toast.success(t('Yay! Your project update is posted!'));
        history.push(`/project/${projectId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.error(err);
    }
    setSaving(false);
  }, [projectId, isDirty, id, authToken, editorState, isCompleted, t, history]);

  const saveImagesAndFiles = useCallback(async () => {
    if (!authToken) return;
    console.log('try saving images and files......');
    if (!projectId) return; // only save when section has been created
    // check if dirty
    if (!isMediaDirty || isMediaSaving) return;
    setMediaSaving(true);
    try {
      if (!id) return;

      // UPDATE IMAGES
      const deletedImages = prevImages.filter((prevImg) => !images.find((img) => img.id === prevImg.id));
      const modifiedImages = images.filter((img) => prevImages.find((prevImg) => img.id === prevImg.id && img.isModified));

      // settle delete and modified first
      const promises = [
        ...deletedImages.map((img) => ProjectApi.deleteSectionImage({
          authToken, projectId, projectSectionId: id, imageId: img.id,
        })),
        ...modifiedImages.map((img) => ProjectApi.putSectionImage({
          authToken, projectId, projectSectionId: id, imageId: img.id, file: img.blob,
        })),
      ];

      await Promise.allSettled(promises);

      // then settle new images with reordering, hence must be sequential
      let insertOrder = prevImages.length + 1;
      const newImages = [...images];
      const oldId2NewImage = {};
      for (const img of newImages) {
        // reset isModified flag
        img.isModified = false;

        // check if new images
        if (!prevImages.find((prevImg) => img.id === prevImg.id)) {
          const res = await ProjectApi.postSectionImage({
            authToken, projectId, projectSectionId: id, file: img.blob, insertOrder,
          });
          oldId2NewImage[img.id] = { ...res.data?.projectSectionImage, imageBase64: img.imageBase64 };
          insertOrder += 1;
        }
      }

      // rerender by setting the current state to not modified, and new ids if it is a new image (merge with current state)
      setImages((currentImages) => currentImages.map((curImg) => oldId2NewImage[curImg.id] || { ...curImg, isModified: false }));
      // prev states must use the stale states to update, because thats where the server states at
      setPrevImages(newImages.map((img) => oldId2NewImage[img.id] || img));

      // UPDATE FILES
      const deletedFilePromises = prevFiles
        .filter((prevFile) => !files.find((file) => file.id === prevFile.id))
        .map((file) => ProjectApi.deleteSectionFile({
          authToken, projectId, projectSectionId: id, fileId: file.id,
        }));

      await Promise.allSettled(deletedFilePromises);

      // then settle new files with reordering, hence must be sequential
      insertOrder = prevFiles.length + 1;
      const newFiles = [...files];
      const oldId2NewFile = {};
      for (const file of newFiles) {
        // check if new files
        if (!prevFiles.find((prevFile) => file.id === prevFile.id)) {
          const res = await ProjectApi.postSectionFile({
            authToken, projectId, projectSectionId: id, file: file.blob, name: file.name, insertOrder,
          });
          oldId2NewFile[file.id] = res.data?.projectSectionFile;
          insertOrder += 1;
        }
      }
      setFiles((currentFiles) => currentFiles.map((curFile) => oldId2NewFile[curFile.id] || curFile));
      setPrevFiles(newFiles.map((file) => oldId2NewFile[file.id] || file));

      setMediaDirty(false);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setMediaSaving(false);
  }, [projectId, isMediaDirty, isMediaSaving, id, prevImages, images, prevFiles, files, authToken]);

  const handlePublish = async (e) => {
    e.preventDefault();
    await saveImagesAndFiles();
    setShouldPublish(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(t('DELETE! Are you absolutely certain that you want to DELETE this project?'))) return;

    // if not yet created, simply redirect
    if (!id) history.replace('/projects');

    try {
      await ProjectApi.deleteSection({ authToken, projectSectionId: id });
      toast.success(t('Section Deleted!'));
      history.replace(`/projects/${projectId}`);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  // utility function
  const markDocumentDirty = async () => {
    if (!isDirty) setDirty(true);
  };

  const markMediaDirty = async () => {
    if (!isMediaDirty) setMediaDirty(true);
  };

  // create project section if its not created
  useEffect(() => {
    if (!sectionId && !id) createSection();
  }, [id, sectionId, createSection]);

  // fetch section if exists
  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  // publish section if ready
  useEffect(() => {
    const publishSection = async () => {
      await saveSection({ isPublished: true });
      setShouldPublish(false);
    };
    if (shouldPublish) publishSection();
  }, [shouldPublish]);

  // save section images and files if dirty and untouched for 10 seconds
  const mediaTimer = useRef(null);

  useEffect(() => {
    if (mediaTimer.current) clearTimeout(mediaTimer.current);
    mediaTimer.current = setTimeout(saveImagesAndFiles, SAVE_INTERVAL);
    return () => clearTimeout(mediaTimer.current);
  }, [saveImagesAndFiles]);

  // save section periodically
  useInterval(saveSection, SAVE_INTERVAL);

  return (
    <div className="edit-section">
      <div className="projects-header-container">
        <div className="projects-header-title-container">
          <p className="projects-title">{t('Projects')}</p>
          <p className="title-description">{t('Share your project with the VIVITA community!')}</p>
        </div>
      </div>
      <div className="separator-container" />
      <div className="home-content" id="home">
        <h4>{t('Made some progress to your project?')}</h4>
        <h6>
          {t('Add Project Update')}
          {isDirty || isMediaDirty ? '*' : ''}
        </h6>
        <ProjectForm
          sectionOnly
          handlePublish={handlePublish}
          handleDelete={handleDelete}
          markDocumentDirty={markDocumentDirty}
          markMediaDirty={markMediaDirty}
          projectId={projectId}
          sectionId={id}
          images={images}
          setImages={setImages}
          videos={videos}
          setVideos={setVideos}
          files={files}
          setFiles={setFiles}
          editorState={editorState}
          setEditorState={setEditorState}
          isCompleted={isCompleted}
          setCompleted={setCompleted}
          saving={isSaving || isMediaSaving}
          loading={isLoading}
          setLoading={setLoading}
        />
        <h4>{isSaving || isMediaSaving ? `${t('Saving')} ${isMediaSaving ? t('images and files') : ''}......` : ''}</h4>
      </div>
    </div>
  );
}

export default SubmitSection;
