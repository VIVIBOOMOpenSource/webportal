/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import './select-project-thumbnail.scss';

import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/project-image-placeholder.png';
import MyImage from 'src/components/common/MyImage';

const DEFAULT_THUMBNAIL_PREVIEW_WIDTH = 256;

function SelectProjectThumbnail({
  videos, images, thumbnailUri, setThumbnailUri, markDocumentDirty,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });

  const covers = useMemo(() => [
    ...videos.map((v) => ({ uri: v.animatedImageUri, key: `project-cover-animated_${v.id}` })),
    ...videos.map((v) => ({ uri: v.thumbnailUri, key: `project-cover-thumbnail_${v.id}` })),
    ...images.map((v) => ({ uri: v.uri, key: `project-cover-image_${v.id}` })),
  ], [images, videos]);

  useEffect(() => {
    if (!covers.find((c) => c.uri === thumbnailUri) && covers.length > 0) setThumbnailUri(covers[0].uri);
  }, [covers, setThumbnailUri, thumbnailUri]);

  return videos?.length > 0 && (
    <div className="project-covers">
      <div className="title">{t('Project Thumbnail (Required)')}</div>
      <p>{t('selectThumbnail')}</p>
      <div className="item-row">
        <ul className="photos-upload-container">
          {covers.map((v) => (
            <li
              key={v.key}
              className={thumbnailUri === v.uri ? 'selected-cover' : ''}
              onClick={() => { setThumbnailUri(v.uri); markDocumentDirty(); }}
            >
              <MyImage
                src={v.uri}
                alt={v.key}
                defaultImage={DefaultProjectPicture}
                width={DEFAULT_THUMBNAIL_PREVIEW_WIDTH}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default SelectProjectThumbnail;
