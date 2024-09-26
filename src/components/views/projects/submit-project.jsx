/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import './submit-project.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useInterval from 'src/hooks/useInterval';

import ProjectApi from 'src/apis/viviboom/ProjectApi';

import { ProjectAuthorRoleType } from 'src/enums/ProjectAuthorRoleType';
import ProjectForm from './project-content/project-form';

const SAVE_INTERVAL = 10000;

function SubmitProject() {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const params = useParams();
  const { projectId } = params;

  const history = useHistory();
  const user = useSelector((state) => state?.user);
  const authToken = user?.authToken;
  const initialAuthor = { ...user, role: ProjectAuthorRoleType.MAKER };

  // dirty flag to track if project form is modified, similar flag for image and files
  const [isDirty, setDirty] = useState(false);
  const [isMediaDirty, setMediaDirty] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isMediaSaving, setMediaSaving] = useState(false);

  // regular form data
  const [id, setId] = useState(null);
  const [authorUserId, setAuthorUserId] = useState(initialAuthor.id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState();
  const [isCompleted, setCompleted] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // array data
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [badgesAndChallenges, setBadgesAndChallenges] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);
  const [authors, setAuthors] = useState([initialAuthor]);

  // copies for array patching
  const [prevImages, setPrevImages] = useState([]);
  const [prevFiles, setPrevFiles] = useState([]);
  const [prevBadges, setPrevBadges] = useState([]);
  const [prevProjectCategories, setPrevProjectCategories] = useState([]);
  const [prevAuthors, setPrevAuthors] = useState([initialAuthor]);

  // state to trigger project publish
  const [shouldPublish, setShouldPublish] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!projectId || !authToken) return;
    setLoading(true);
    try {
      const res = await ProjectApi.get({ authToken, projectId, verboseAttributes: ['files', 'categories', 'badges'] });

      const fetchedProject = res.data?.project;
      setId(fetchedProject.id);
      setAuthorUserId(fetchedProject.authorUserId);
      setName(fetchedProject.name || '');
      setDescription(fetchedProject.description || '');
      setCompleted(fetchedProject.isCompleted);
      setImages(fetchedProject.images);
      setVideos(fetchedProject.videos);
      setThumbnailUri(fetchedProject.thumbnailUri);
      setFiles(fetchedProject.files);
      setBadgesAndChallenges(fetchedProject.badges);
      setProjectCategories(fetchedProject.categories);
      setAuthors(fetchedProject.authorUsers);

      setPrevImages(fetchedProject.images);
      setPrevFiles(fetchedProject.files);
      setPrevBadges(fetchedProject.badges);
      setPrevProjectCategories(fetchedProject.categories);
      setPrevAuthors(fetchedProject.authorUsers);
      if (fetchedProject?.content) setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedProject?.content))));
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [authToken, projectId]);

  const createProject = useCallback(async () => {
    if (!authToken) return null;
    console.log('create project......');
    try {
      const res = await ProjectApi.post({ authToken });
      // this is to prevent stale state (null) leading to setting a new section
      let resId = null;
      setId((prevId) => {
        resId = prevId || res.data?.projectId;
        return prevId || res.data?.projectId;
      });
      return resId;
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    return null;
  }, [authToken]);

  const saveProject = useCallback(async ({ isPublished } = { isPublished: false }) => {
    if (!authToken) return;
    console.log('try saving......');
    // check if dirty
    if (!isDirty && !isPublished) return;

    setSaving(true);
    // if there is no id, this is a brand new project, use post to create a new project
    // then use patch to modify the existing project
    try {
      if (!id) return;

      // patching
      const reqBody = {
        authToken,
        projectId: id,
        name,
        description,
        thumbnailUri: thumbnailUri || images?.[0]?.uri,
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        isCompleted,
        badges: getArrayForUpdate(prevBadges, badgesAndChallenges),
        projectCategories: getArrayForUpdate(prevProjectCategories, projectCategories),
        authorUsers: getArrayForUpdateWithEdit(prevAuthors, authors),
      };

      if (isPublished) reqBody.isPublished = isPublished;

      await ProjectApi.patch(reqBody);

      // update previous arrays after server sync
      setPrevBadges(badgesAndChallenges);
      setPrevProjectCategories(projectCategories);

      // form is no longer dirty after save
      setDirty(false);
      if (isPublished) {
        history.push(`/project/${id}`);
        toast.success(t('Yay! Your project is posted!'));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      console.error(err);
    }
    setSaving(false);
  }, [authToken, isDirty, id, name, description, thumbnailUri, images, editorState, isCompleted, prevBadges, badgesAndChallenges, prevProjectCategories, projectCategories, prevAuthors, authors, history, t]);

  const saveImagesAndFiles = useCallback(async () => {
    if (!authToken) return;
    console.log('try saving images and files......');
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
        ...deletedImages.map((img) => ProjectApi.deleteProjectImage({ authToken, projectId: id, imageId: img.id })),
        ...modifiedImages.map((img) => ProjectApi.putProjectImage({
          authToken, projectId: id, imageId: img.id, file: img.blob,
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
          const res = await ProjectApi.postProjectImage({
            authToken, projectId: id, file: img.blob, insertOrder,
          });
          oldId2NewImage[img.id] = { ...res.data?.projectImage, imageBase64: img.imageBase64 };
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
        .map((file) => ProjectApi.deleteProjectFile({ authToken, projectId: id, fileId: file.id }));

      await Promise.allSettled(deletedFilePromises);

      // then settle new files with reordering, hence must be sequential
      insertOrder = prevFiles.length + 1;
      const newFiles = [...files];
      const oldId2NewFile = {};
      for (const file of newFiles) {
        // check if new files
        if (!prevFiles.find((prevFile) => file.id === prevFile.id)) {
          const res = await ProjectApi.postProjectFile({
            authToken, projectId: id, file: file.blob, name: file.name, insertOrder,
          });
          oldId2NewFile[file.id] = res.data?.projectFile;
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
  }, [isMediaDirty, isMediaSaving, id, prevImages, images, prevFiles, files, authToken]);

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
      await ProjectApi.deleteProject({ authToken, projectId: id });
      toast.success(t('Project Deleted!'));
      history.replace('/projects');
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

  // create project if its not created
  useEffect(() => {
    if (!projectId && !id) createProject();
  }, [projectId, id, createProject]);

  // fetch project if exists
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // publish project if ready
  useEffect(() => {
    const publishProject = async () => {
      await saveProject({ isPublished: true });
      setShouldPublish(false);
    };
    if (shouldPublish) publishProject();
  }, [shouldPublish]);

  // save project images and files if dirty and untouched for 10 seconds
  const mediaTimer = useRef(null);

  useEffect(() => {
    if (mediaTimer.current) clearTimeout(mediaTimer.current);
    mediaTimer.current = setTimeout(saveImagesAndFiles, SAVE_INTERVAL);
    return () => clearTimeout(mediaTimer.current);
  }, [saveImagesAndFiles]);

  // save project periodically
  useInterval(saveProject, SAVE_INTERVAL);

  return (
    <div className="submit-project">
      <div className="projects-header-container">
        <div className="projects-header-title-container">
          <p className="projects-title">{t('Projects')}</p>
          <p className="title-description">{t('Share your project with the VIVITA community!')}</p>
        </div>
      </div>
      <div className="separator-container" />

      <div className="home-content" id="home">
        <h4>{t('Showcase what you have created')}</h4>
        <h6>
          {t('Post a Project')}
          {isDirty || isMediaDirty ? '*' : ''}
        </h6>
        <ProjectForm
          handlePublish={handlePublish}
          handleDelete={handleDelete}
          markDocumentDirty={markDocumentDirty}
          markMediaDirty={markMediaDirty}
          projectId={id}
          sectionId={null}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          badgesAndChallenges={badgesAndChallenges}
          setBadgesAndChallenges={setBadgesAndChallenges}
          images={images}
          videos={videos}
          thumbnailUri={thumbnailUri}
          setVideos={setVideos}
          setImages={setImages}
          setThumbnailUri={setThumbnailUri}
          files={files}
          setFiles={setFiles}
          editorState={editorState}
          setEditorState={setEditorState}
          isCompleted={isCompleted}
          setCompleted={setCompleted}
          projectCategories={projectCategories}
          setProjectCategories={setProjectCategories}
          authorUserId={authorUserId}
          authors={authors}
          setAuthors={setAuthors}
          saving={isSaving || isMediaSaving}
          loading={isLoading}
          setLoading={setLoading}
        />
        <h4>{isSaving || isMediaSaving ? `${t('Saving')} ${isMediaSaving ? t('images and files') : ''}......` : ''}</h4>
      </div>
    </div>
  );
}

function getArrayForUpdate(prevArr, arr) {
  return [
    // new items
    ...arr.filter((item1) => !prevArr.find((item2) => item1.id === item2.id)).map((item) => ({ id: item.id })),
    // deleted items
    ...prevArr.filter((item1) => !arr.find((item2) => item1.id === item2.id)).map((item) => ({ id: item.id, isDelete: true })),
  ];
}

function getArrayForUpdateWithEdit(prevArr, arr) {
  return [
    // new items
    ...arr.filter((item1) => !prevArr.find((item2) => item1.id === item2.id)).map((item) => ({ id: item.id, role: item.role })),
    // edit items
    ...arr.filter((item1) => prevArr.find((item2) => item1.id === item2.id && item1.role !== item2.role)).map((item) => ({ id: item.id, role: item.role })),
    // deleted items
    ...prevArr.filter((item1) => !arr.find((item2) => item1.id === item2.id)).map((item) => ({ id: item.id, isDelete: true })),
  ];
}

export default SubmitProject;
