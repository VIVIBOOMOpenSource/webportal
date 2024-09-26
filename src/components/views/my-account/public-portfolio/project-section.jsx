import './project-section.scss';
import 'react-multi-carousel/lib/styles.css';

import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import Carousel from 'react-multi-carousel';
import { isDesktop, isTablet } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import { EditorState, convertFromRaw } from 'draft-js';
import { format } from 'date-fns';

import MyVideo from 'src/components/common/MyVideo';
import File from 'src/components/common/file/downloadable-file';

import EmbeddedYoutubeLinkManipulator from '../../../../js/editor/embeddedYoutubeLinkManipulator';
import DefaultProjectPicture from '../../../../css/imgs/boom-imgs/project/default-project-picture.png';

let deviceType = 'desktop';

if (!isDesktop) {
  deviceType = isTablet ? 'tablet' : 'mobile';
}

// slider component props
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const DEFAULT_PROJECT_IMAGE_WIDTH = 1024;

function ProjectSection({ isRootProject, section }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleChangeSlide = (previousSlide, { currentSlide }) => {
    if (previousSlide < section?.videos?.length) {
      const video = document.getElementById(`project-video_${section?.videos[previousSlide].id}${isRootProject ? '' : '_section'}`);
      video.pause();
      video.currentTime = 0;
      if (video.hasAttribute('controls')) video.removeAttribute('controls');
    }
    if (currentSlide < section?.videos?.length) {
      const video = document.getElementById(`project-video_${section?.videos[currentSlide].id}${isRootProject ? '' : '_section'}`);
      video.play();
      video.setAttribute('controls', 'controls');
    }
  };

  useEffect(() => {
    try {
      if (section?.content) setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(section?.content))));
    } catch (err) {
      console.log(err);
    }
  }, [section]);

  const mediaCount = (section?.images?.length || 0) + (section?.videos?.length || 0);

  return (
    <div className="timeline-information">
      <p className="timeline-information-date">{format(new Date(section?.createdAt), 'PP')}</p>
      {mediaCount > 0
        && (
        <div className="project-image">
          <Carousel
            arrows={mediaCount > 1}
            draggable={false}
            showDots={mediaCount > 1}
            responsive={responsive}
            ssr
            // infinite
            keyBoardControl
            transitionDuration={500}
            containerClass="carousel-container"
            // removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType={deviceType}
            dotListClass="custom-dot-list-style"
            itemClass={mediaCount === 1 ? 'carousel-item-project-media' : ''}
            afterChange={handleChangeSlide}
          >
            {section?.videos?.map((vid, index) => (
              <MyVideo
                key={`project-video_${vid.id}${isRootProject ? '' : '_section'}`}
                id={`project-video_${vid.id}${isRootProject ? '' : '_section'}`}
                alt="project-video"
                src={vid.uri}
                defaultImage={DefaultProjectPicture}
                params={{ width: DEFAULT_PROJECT_IMAGE_WIDTH }}
                loop
                autoplay={index === 0 && isRootProject}
                control={index === 0}
              />
            ))}
            {section?.images?.map((img) => (
              <img
                src={img?.uri || DefaultProjectPicture}
                key={`project-image_${img.id}`}
                alt="No img found"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = DefaultProjectPicture;
                }}
              />
            ))}
          </Carousel>
        </div>
        )}
      {section?.files.length > 0 && (
        <div className="project-files">
          <p className="timeline-information-title">
            {t('Project Files')}
            :
          </p>
          <ul>
            {section.files.map((v) => <File key={`project-file_${v.id}`} src={v.uri} filename={v.name} size={v.size} />)}
          </ul>
        </div>
      )}

      <Editor
        editorState={editorState}
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
  );
}

export default ProjectSection;
