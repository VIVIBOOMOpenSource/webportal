import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import './member-item.scss';

import MyImage from 'src/components/common/MyImage';
import DefaultProfileCover from 'src/css/imgs/boom-imgs/profile/default-profile-cover.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import Explorer from 'src/css/imgs/boom-imgs/profile/explorer.png';
import Vivinaut from 'src/css/imgs/boom-imgs/profile/vivinaut.png';
import { getCountryFlag } from 'src/utils/countries';

import UserApi from 'src/apis/viviboom/UserApi';

const DEFAULT_COVER_IMAGE_SIZE = 512;
const DEFAULT_PROFILE_IMAGE_SIZE = 256;

function MemberItem({ id, preloadedData }) {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(preloadedData || {});

  // API calls
  const fetchMember = useCallback(async () => {
    if (!user?.authToken) return;
    if (member?.badgeCount !== undefined || !id) return;
    setLoading(true);
    try {
      const res = await UserApi.get({ authToken: user.authToken, userId: id });
      setMember(res.data?.user);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, member?.badgeCount, user?.authToken]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  return (
    <div className="member-item">
      <Link to={`/member/${id}`}>
        <div className="member-item-cover-image">
          <MyImage
            src={member?.coverImageUri}
            alt="cover"
            defaultImage={DefaultProfileCover}
            width={DEFAULT_COVER_IMAGE_SIZE}
            isLoading={loading}
          />
        </div>
        <div className="member-item-detail">
          <div className="member-item-profile-image-container">
            <div className="member-item-profile-image">
              <MyImage
                src={member?.profileImageUri}
                alt="profile"
                defaultImage={DefaultProfilePicture}
                width={DEFAULT_PROFILE_IMAGE_SIZE}
                isLoading={loading}
              />
              <img
                className="member-item-profile-country"
                alt={member?.branch?.countryISO}
                src={getCountryFlag(member?.branch?.countryISO)}
              />
              <img
                className="member-item-profile-country status"
                alt="status"
                src={member?.status === 'VIVINAUT' ? Vivinaut : Explorer}
              />
            </div>
          </div>
          <div className="member-name">{member?.name}</div>
          <div className="project-badges-container">
            <div className="text-container">
              <p className="text-number">
                {loading ? 0 : member?.badgeCount}

              </p>
              <p className="text-badges-projects">
                {t(member?.badgeCount > 1 ? 'itemBadges' : 'Badge')}
              </p>
            </div>
            <div className="text-container">
              <p className="text-number">
                {loading ? 0 : member?.challengeCount}

              </p>
              <p className="text-badges-projects">
                {t(member?.challengeCount > 1 ? 'Challenges' : 'Challenge')}
              </p>
            </div>
            <div className="text-container">
              <p className="text-number">
                {loading ? 0 : member?.projectCount}
              </p>
              <p className="text-badges-projects">
                {t(member?.projectCount > 1 ? 'Projects' : 'Project')}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MemberItem;
