import axios from 'axios';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import * as NumberUtil from 'src/utils/number';
import { getBase64 } from 'src/utils/object';

import Button from 'src/components/common/button/button';
import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/default-project-picture.png';
import MyImage from 'src/components/common/MyImage';

const MAX_SIZE = 8 * 1024 * 1024;
const MAX_COUNT = 10;

const DEFAULT_PHOTO_PREVIEW_WIDTH = 1024;

function ProjectPhotos({ images, setImages, markMediaDirty }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const authToken = useSelector((state) => state?.user?.authToken);

  // for id assignment of new images
  const [newImageCount, setNewImageCount] = useState(1);

  // handlers
  const handleDelete = (imageId) => () => {
    setImages(images.filter((img) => img.id !== imageId));
    markMediaDirty();
  };

  const handleRotate = (imageId) => async () => {
    const imageIdx = images.findIndex((img) => img.id === imageId);
    const newImages = [...images];

    // fetch image if not fetched yet
    if (!newImages[imageIdx].imageBase64) {
      try {
        const res = await axios.get(newImages[imageIdx].uri, {
          headers: { 'auth-token': authToken },
          params: { width: DEFAULT_PHOTO_PREVIEW_WIDTH },
          responseType: 'blob',
        });
        newImages[imageIdx].imageBase64 = URL.createObjectURL(res.data);
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || err.message);
        return;
      }
    }

    // creating environment for rotation
    const img = new Image();
    img.src = newImages[imageIdx].imageBase64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = Math.max(img.height, img.width);
      const ctx = canvas.getContext('2d');

      canvas.width = maxDim;
      canvas.height = maxDim;

      // rotation
      ctx.setTransform(1, 0, 0, 1, maxDim / 2, maxDim / 2);
      ctx.rotate(90 * (Math.PI / 180));
      ctx.drawImage(img, -maxDim / 2, -maxDim / 2);

      // crop
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = img.height;
      croppedCanvas.height = img.width;
      croppedCanvas.getContext('2d').drawImage(canvas, Math.max(img.width - img.height, 0), 0, img.height, img.width, 0, 0, img.height, img.width);

      // update imageBase64 locally and blob for upload
      croppedCanvas.toBlob((blob) => {
        if (blob.size > MAX_SIZE) {
          toast.error(t('fileRotateTooLarge', { size: NumberUtil.numberWithCommas(blob.size), maxSize: NumberUtil.numberWithCommas(MAX_SIZE) }));
        } else {
          newImages[imageIdx].blob = blob;
          newImages[imageIdx].imageBase64 = croppedCanvas.toDataURL('image/jpeg');
          newImages[imageIdx].isModified = true;
          setImages(newImages);
          markMediaDirty();
        }
      });
    };
  };

  const handleAddImage = (e) => {
    const file = e.currentTarget.files.length >= 1 ? e.currentTarget.files[0] : null;
    // console.log(e.currentTarget.files[0]);
    e.target.value = null;
    getBase64(file, (base64) => {
      if (base64) {
        if (file.size > MAX_SIZE) {
          toast.error(t('fileTooLarge', { size: NumberUtil.numberWithCommas(file.size), maxSize: NumberUtil.numberWithCommas(MAX_SIZE) }));
        } else {
          setImages(images.concat({
            imageBase64: base64,
            blob: file, // for server upload
            id: -newImageCount, // negative ids to avoids key conflicts, will be updated after save
          }));
          setNewImageCount(newImageCount + 1);
          markMediaDirty();
        }
      }
    });
  };

  return (
    <div className="project-photos">
      <div className="title">{t('Project Photos')}</div>
      <p>
        {t('imageLimit', { limit: MAX_SIZE / 1024 / 1024, countLimit: MAX_COUNT })}
      </p>
      <div className="item-row">
        {images?.length > 0 && (
          <ul className="photos-upload-container">
            {images.map((v) => (
              <li key={`project-photo_${v.id}`}>
                <MyImage
                  alt={`project-photo_${v.id}`}
                  src={v.imageBase64 || v.uri}
                  defaultImage={DefaultProjectPicture}
                  width={DEFAULT_PHOTO_PREVIEW_WIDTH}
                />
                <div className="op-buttons">
                  <Button
                    parentClassName="delete"
                    type="button"
                    status="delete"
                    onClick={handleDelete(v.id)}
                  />
                  <Button
                    parentClassName="rotate"
                    type="button"
                    status="rotate"
                    onClick={handleRotate(v.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="add-file">
          <label className={images?.length === MAX_COUNT ? 'add-button greyed' : 'add-button'}>
            <input
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={handleAddImage}
            />
            <div className="text">
              +
              {' '}
              {t('Add Image')}
            </div>
          </label>
          {images?.length === MAX_COUNT && (
          <p style={{ textAlign: 'center', color: 'red', marginTop: 5 }}>
            {t('Only 10 images can be added')}
          </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProjectPhotos;
