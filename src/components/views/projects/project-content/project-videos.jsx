import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import './project-videos.scss';

import * as NumberUtil from 'src/utils/number';

import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/default-project-picture.png';
import { ReactComponent as DeleteSvg } from 'src/css/imgs/icon-close.svg';
import ProjectApi from 'src/apis/viviboom/ProjectApi';
import MyImage from 'src/components/common/MyImage';
import MyVideo from 'src/components/common/MyVideo';
import Loading from 'src/components/common/loading/loading';
import ProgressBar from 'src/components/common/progress-bar/progress-bar';

const MAX_SIZE = 80 * 1024 * 1024;
const MAX_COUNT = 5;

const DEFAULT_THUMBNAIL_PREVIEW_WIDTH = 256;

function ProjectVideos({
  videos, setVideos, projectId, sectionId,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const authToken = useSelector((state) => state?.user?.authToken);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // video preview (by id)
  const [selectedVideoId, setSelectedVideoId] = useState(-1);

  // handlers
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(t('deleteVideo'))) return;

    setDeleteLoading(true);
    try {
      if (projectId && !sectionId) {
        await ProjectApi.deleteProjectVideo({ authToken, projectId, videoId: selectedVideoId });
      } else if (projectId && sectionId) {
        await ProjectApi.deleteSectionVideo({
          authToken, projectId, projectSectionId: sectionId, videoId: selectedVideoId,
        });
      }
      setVideos(videos.filter((vid) => vid.id !== selectedVideoId));
    } catch (err) {
      toast.error(err.response?.data?.message);
      console.error(err.response?.data?.message);
    }
    setDeleteLoading(false);
  };

  const handleAddVideo = async (e) => {
    const file = e.currentTarget.files.length >= 1 ? e.currentTarget.files[0] : null;
    e.target.value = null;
    if (file.size > MAX_SIZE) {
      toast.error(t('fileTooLarge', { size: NumberUtil.numberWithCommas(file.size), maxSize: NumberUtil.numberWithCommas(MAX_SIZE) }));
    } else {
      setLoading(true);
      try {
        let newId;
        if (projectId && !sectionId) {
          const res = await ProjectApi.postProjectVideo({
            authToken, projectId, insertOrder: videos.length ? videos[videos.length - 1].order + 1 : 1, file,
          });
          setVideos(videos.concat(res.data.projectVideo));
          newId = res.data?.projectVideo?.id;
        } else if (projectId && sectionId) {
          const res = await ProjectApi.postSectionVideo({
            authToken, projectId, projectSectionId: sectionId, insertOrder: videos.length ? videos[videos.length - 1].order + 1 : 1, file,
          });
          setVideos(videos.concat(res.data.projectSectionVideo));
          newId = res.data?.projectSectionVideo?.id;
        }
        setSelectedVideoId(newId);
        console.log('video upload success');
      } catch (err) {
        toast.error(err.response?.data?.message);
        console.error(err.response?.data?.message);
      }
      setLoading(false);
    }
  };

  const handleThumbnailClick = (videoId) => () => {
    if (selectedVideoId === videoId) setSelectedVideoId(-1);
    else setSelectedVideoId(videoId);
  };

  const showVideo = videos.find((v) => v.id === selectedVideoId);

  return (
    <div className="project-videos">
      <div className="title">{t('Project Videos')}</div>
      <p>
        {t('videoLimit', { limit: MAX_SIZE / 1024 / 1024, countLimit: MAX_COUNT })}
      </p>
      <div className="item-row">
        {videos?.length > 0 && (
          <ul className="photos-upload-container">
            {videos.map((v) => (
              <li key={`project-video_${v.id}`} onClick={handleThumbnailClick(v.id)}>
                <MyImage
                  src={v.thumbnailUri}
                  alt={`project-video-thumbnail_${v.id}`}
                  defaultImage={DefaultProjectPicture}
                  width={DEFAULT_THUMBNAIL_PREVIEW_WIDTH}
                />
                {v.id === selectedVideoId && (
                  <button type="button" className="delete-button" onClick={handleDelete}>
                    <DeleteSvg />
                  </button>
                )}
                {v.id !== selectedVideoId && <div className="non-active-cover" />}
              </li>
            ))}
          </ul>
        )}
        <div className="add-video">
          {deleteLoading ? <Loading show size="24px" /> : (
            <>
              <label className={videos?.length === MAX_COUNT ? 'add-button greyed' : 'add-button'}>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime"
                  onChange={handleAddVideo}
                  disabled={loading}
                />
                <div className="text">
                  {!loading ? `+ ${t('Add Video')}` : t('Uploading')}
                </div>
              </label>
              {videos?.length === MAX_COUNT && (
                <p style={{ textAlign: 'center', color: 'red', marginTop: 5 }}>
                  {t('Only 5 videos can be added')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {!loading && showVideo && (
        <div className="video-preview">
          <MyVideo
            alt={`project-video_${showVideo.id}`}
            src={showVideo.localUri || showVideo.uri}
            defaultImage={DefaultProjectPicture}
            control
            // width={DEFAULT_VIDEO_WIDTH}
          />
        </div>
      )}
      {loading && (
        <>
          <ProgressBar />
          <div className="video-uploading">
            <Loading show size="24px" />
            <h3>
              {t('Uploading Video')}
              {' '}
              ...
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
export default ProjectVideos;
