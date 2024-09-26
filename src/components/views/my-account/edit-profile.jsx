import React, { useState, useEffect, useCallback } from 'react';
import './edit-profile.scss';

import { toast } from 'react-toastify';
import AvatarImageCropper from 'react-avatar-image-cropper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import UserReduxActions from 'src/redux/user/UserReduxActions';
import UserApi from 'src/apis/viviboom/UserApi';
import UserInfoBanner from 'src/components/common/user-info-banner/user-info-banner';
import Button from 'src/components/common/button/button';
import FormInput from '../../common/form-input/form-input';
import { getBase64 } from '../../../utils/object';

import ProfileDetails from './profile-details';

function EditProfile() {
  const { t } = useTranslation('translation', { keyPrefix: 'myAccount' });
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(false);

  const [changedDescription, setChangedDescription] = useState();
  const [profileImageToUpload, setProfileImageToUpload] = useState();
  const [coverImageToUpload, setCoverImageToUpload] = useState();

  // Not really required unless theres bugs with redux state not updated after patch
  // useEffect(() => {
  //   UserReduxActions.fetch();
  // }, []);

  const dim = useCallback((bool) => {
    if (typeof bool === 'undefined') {
      bool = true;
    }
    document.querySelector('.dimmed-background').style.display = bool
      ? 'block'
      : 'none';
  }, []);

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      const cropperAvatar = document.querySelector('.cropper-avatar');
      const cropperCover = document.querySelector('.cropper-cover');

      if (cropperAvatar && cropperCover) {
        cropperAvatar.style.visibility = 'hidden';
        cropperCover.style.visibility = 'hidden';
        dim(false);
      }
    }
  }, [dim]);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  const applyAvatar = useCallback((croppedImage) => {
    getBase64(croppedImage, (base64) => {
      setProfileImageToUpload(base64 !== null ? base64 : profileImageToUpload);
      const cropperElement = document.querySelector('.cropper-avatar');
      cropperElement.style.visibility = 'hidden';
      dim(false);
    });
  }, [dim, profileImageToUpload]);

  const applyCover = useCallback((croppedImage) => {
    getBase64(croppedImage, (base64) => {
      setCoverImageToUpload(base64 !== null ? base64 : coverImageToUpload);
      const cropperElement = document.querySelector('.cropper-cover');
      cropperElement.style.visibility = 'hidden';
      dim(false);
    });
  }, [dim, coverImageToUpload]);

  useEffect(() => {
    const fields = Array.prototype.slice.apply(
      document.querySelectorAll('.update-profile form div .form-input input'),
    );
    fields.reverse().forEach((e) => {
      e.focus();
      e.blur();
    });
  }, [loading]);

  useEffect(() => {
    document
      .querySelector('.dimmed-background')
      .addEventListener('click', () => {
        const cropperAvatar = document.querySelector('.cropper-avatar');
        const cropperCover = document.querySelector('.cropper-cover');

        if (cropperAvatar && cropperCover) {
          cropperAvatar.style.visibility = 'hidden';
          cropperCover.style.visibility = 'hidden';
          dim(false);
        }
      });
  }, [dim]);

  const onEditSavePress = useCallback(async () => {
    setLoading(true);
    const { id: userId, authToken } = user;
    if (profileImageToUpload) {
      await UserApi.putImage({
        authToken, userId, imageType: 'profile-image', file: profileImageToUpload,
      });
      setProfileImageToUpload(false);
    }
    if (coverImageToUpload) {
      await UserApi.putImage({
        authToken, userId, imageType: 'cover-image', file: coverImageToUpload,
      });
      setCoverImageToUpload(null);
    }
    if (changedDescription?.length >= 0) {
      await UserApi.patch({
        authToken, userId, description: changedDescription?.length === 0 ? null : changedDescription,
      });
      setChangedDescription(null);
    }
    await UserReduxActions.fetch();
    setLoading(false);
    toast.success(t('Profile Saved!'));
  }, [changedDescription, coverImageToUpload, profileImageToUpload, t, user]);

  return (
    <div className="update-profile">

      <div className="member-content-top">
        {user && (
          <UserInfoBanner
            member={user}
            profileImageToUpload={profileImageToUpload}
            coverImageToUpload={coverImageToUpload}
            isUpdateProfile
          />
        )}
      </div>

      <div className="buttons-container">
        <label
          className="button"
          onClick={() => {
            const cropper = document.querySelector('.cropper-avatar');
            cropper.style.visibility = 'visible';
            dim();
          }}
        >
          {t('Change Profile Image')}
        </label>
        <label
          className="button"
          onClick={() => {
            const cropper = document.querySelector('.cropper-cover');
            cropper.style.visibility = 'visible';
            dim();
          }}
        >
          {t('Change Background Image')}
        </label>
        <div className="save-button-container">
          <Button parentClassName="save-button" status={loading ? 'loading' : 'save'} onClick={onEditSavePress}>
            <p className="save-button-text">{t('Save')}</p>
          </Button>
        </div>
      </div>

      <div className="cropper-avatar">
        <AvatarImageCropper
          apply={applyAvatar}
          isBack
          maxsize={1024 * 1024 * 10}
          text={t('Upload photo or drag a photo here')}
        />
      </div>

      <div className="cropper-cover">
        <AvatarImageCropper
          apply={applyCover}
          isBack
          maxsize={1024 * 1024 * 10}
          text={t('Upload photo or drag a photo here')}
        />
      </div>

      <div className="dimmed-background" />
      <div className="profile-editor-container">
        <div className="profile-details-container">
          <div className="first-column">
            <p>{t('Name')}</p>
            <FormInput
              className="given-name-detail"
              value={user.givenName}
              type="text"
              disabled
            />
            <p>{t('Family Name')}</p>
            <FormInput
              className="family-name-detail"
              value={user.familyName}
              type="text"
              disabled
            />
            <p>{t('Username')}</p>
            <FormInput
              className="username-detail"
              value={user.username}
              type="text"
              disabled
            />
          </div>

          <div className="second-column">
            <ProfileDetails description={changedDescription} setDescription={setChangedDescription} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
