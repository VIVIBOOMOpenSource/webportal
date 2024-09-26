import './step-four.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AvatarImageCropper from 'react-avatar-image-cropper';
import { useTranslation } from 'react-i18next';

import Loading from 'src/components/common/loading/loading';
import MyImage from 'src/components/common/MyImage';
import { getBase64 } from 'src/utils/object';

import DefaultProfileCover from 'src/css/imgs/boom-imgs/profile/default-profile-cover.png';

import UserReduxActions from 'src/redux/user/UserReduxActions';
import UserApi from 'src/apis/viviboom/UserApi';

const DEFAULT_COVER_WIDTH = 1024;

function StepFour() {
  const { t } = useTranslation('translation', { keyPrefix: 'welcome' });
  const user = useSelector((state) => state?.user);

  const [editting, setEditting] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveImage = useCallback(async (imageBase64) => {
    if (editting) {
      setLoading(true);
      const { id: userId, authToken } = user;
      if (imageBase64) {
        await UserApi.putImage({
          authToken, userId, imageType: 'cover-image', file: imageBase64,
        });
      }

      await UserReduxActions.fetch();
      setLoading(false);
      toast.success(t('Cover Image saved!'));
    }
    setEditting(false);
  }, [editting, t, user]);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEditting(false);
    }
  }, []);

  const applyCover = useCallback((croppedImage) => {
    getBase64(croppedImage, (base64) => {
      saveImage(base64);
    });
  }, [saveImage]);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="step-four">
      <div className="text heading">
        <strong>{t('Add a background photo!')}</strong>
      </div>
      <div className="cover-image">
        {loading ? (
          <Loading show={loading} size="40px" />
        ) : (
          <MyImage
            src={user?.coverImageUri}
            alt="cover"
            defaultImage={DefaultProfileCover}
            preloadImage={DefaultProfileCover}
            width={DEFAULT_COVER_WIDTH}
          />
        )}
      </div>
      {editting && !loading && (
        <>
          <div className="dimmed-background" onClick={() => setEditting(false)} />
          <div className="cropper-cover">
            <AvatarImageCropper
              apply={applyCover}
              isBack
              maxsize={1024 * 1024 * 10}
              text={t('Upload photo or drag a photo here')}
            />
          </div>
        </>
      )}
      <div className="welcome-modal-image-buttons">
        <label
          className="button shake-horizontal"
          onClick={() => setEditting(true)}
        >
          {t('Add Background')}
        </label>
      </div>
    </div>
  );
}

export default StepFour;
