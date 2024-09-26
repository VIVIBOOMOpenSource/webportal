import React from 'react';
import './user-info-banner.scss';

import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MyImage from 'src/components/common/MyImage';
import DefaultProfileCover from 'src/css/imgs/boom-imgs/profile/default-profile-cover.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import Explorer from 'src/css/imgs/boom-imgs/profile/explorer.png';
import Vivinaut from 'src/css/imgs/boom-imgs/profile/vivinaut.png';
import BirthdayHat from 'src/css/imgs/hat.png';
import { getCountryFlag } from 'src/utils/countries';
import { ReactComponent as ArrowBackSvg } from 'src/css/imgs/icon-arrow-back.svg';
import { ReactComponent as GearSvg } from 'src/css/imgs/icon-gear.svg';

const DEFAULT_COVER_IMAGE_SIZE = 512;
const DEFAULT_PROFILE_IMAGE_SIZE = 256;

function UserInfoBanner({
  member, profileImageToUpload, coverImageToUpload, isUpdateProfile, setTabId, setIsChat,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const history = useHistory();
  const user = useSelector((state) => state?.user);

  const chatButtonFunction = () => {
    setIsChat(true);
    setTabId(1);
  };

  return (
    <div className="user-info-banner">
      <div className="user-cover-image">
        <MyImage
          src={coverImageToUpload || member?.coverImageUri}
          alt="cover"
          defaultImage={DefaultProfileCover}
          width={DEFAULT_COVER_IMAGE_SIZE}
        />
      </div>
      <div className="user-profile-basic-info">
        <div className="user-profile-image-name-container">
          <div className="user-profile-image-container">
            <div className="user-profile-image">
              <MyImage
                src={profileImageToUpload || member?.profileImageUri}
                alt="profile"
                defaultImage={DefaultProfilePicture}
                width={DEFAULT_PROFILE_IMAGE_SIZE}
              />
            </div>
            {member?.id === 451 && <img src={BirthdayHat} alt="birthday-hat" className="birthday-hat" onClick={() => history.push('/happy/birthday/Rachel')} />}
            {user?.institutionId === 1 && (
              <>
                <img className="user-profile-country" alt="country" src={getCountryFlag(member?.branch?.countryISO)} />
                <img className="user-profile-country status" alt="status" src={member?.status === 'VIVINAUT' ? Vivinaut : Explorer} />
              </>
            )}
          </div>
          <div className="user-real-name">{user.id === member.id ? `${member?.givenName} ${member?.familyName}` : member?.name}</div>
        </div>
        {member && user.id !== member?.id && (
          <div className="user-data">
            <div className="data-btn">
              <div className="more-button" onClick={() => setTabId(1)}>
                {t('created', { count: member?.projectCount || 0 })}
              </div>
            </div>
            <div className="data-btn">
              <div className="more-button" onClick={() => setTabId(2)}>
                {t('earnedBadges', { count: member?.badgeCount || 0 })}
              </div>
            </div>
            <div className="data-btn">
              <div className="more-button" onClick={() => setTabId(3)}>
                {t('completedChallenges', { count: member?.challengeCount || 0 })}
              </div>
            </div>
            {user?.institution?.isChatEnabled && (
              <div className="chat-ctn">
                <button className="chat-btn" type="button" onClick={chatButtonFunction}>
                  {t('Chat')}
                </button>
              </div>
            )}
          </div>
        )}
        {!isUpdateProfile ? (
          <Link to="/edit-profile" className={member?.id === user?.id ? 'edit-button-container' : 'no-edit-button-container'}>
            <GearSvg className="edit-gear-button" />
            <label className="edit-profile-button">
              {t('Edit Profile')}
            </label>
          </Link>
        ) : (
          <Link to={`/member/${user.id}`} className={member?.id === user?.id ? 'edit-button-container' : 'no-edit-button-container'}>
            <ArrowBackSvg className="edit-button" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default UserInfoBanner;
