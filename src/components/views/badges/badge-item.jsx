import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import MyImage from 'src/components/common/MyImage';
import './badge-item.scss';

import DefaultBadgePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import BadgeEarnedIcon from 'src/css/imgs/boom-imgs/quest/completedq-s.png';
import MoreMembers from 'src/css/imgs/boom-imgs/more-members.png';

import BadgeApi from 'src/apis/viviboom/BadgeApi';
import Loading from 'src/components/common/loading/loading';

const DEFAULT_BADGE_IMAGE_SIZE = 256;
const DEFAULT_PROFILE_IMAGE_SIZE = 64;

function BadgeItem({
  id,
  preloadedData,
  disableLink,
  hideDescription,
  imageOnly,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  const [badge, setBadge] = useState(preloadedData);

  const badgeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  // API calls
  const fetchBadge = useCallback(async () => {
    if (!user.authToken) return;
    if (badge?.awardedUsers !== undefined || !id) return;
    if (imageOnly && badge?.imageUri) return;
    setLoading(true);
    try {
      const res = await BadgeApi.get({ authToken: user.authToken, badgeId: id, verboseAttributes: ['awardedUsers'] });
      setBadge(res.data?.badge);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user?.authToken, badge?.awardedUsers, badge?.imageUri, id, imageOnly]);

  useEffect(() => {
    fetchBadge();
  }, [fetchBadge]);

  if (imageOnly) {
    return (
      <Link to={`/badge/${id}`}>
        <MyImage alt="badge" src={badge.imageUri} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} isLoading={loading} params={badgeImageParams} />
      </Link>
    );
  }

  const awardedUsers = badge?.awardedUsers || [];
  const isAwarded = awardedUsers?.find((u) => u.id === user.id);

  const badgeItemSub = (
    <div className="badge-item-sub">
      <div className="badge-checkmark">&#10004;</div>
      {hideDescription && isAwarded && (
        <div className="badge-earned">
          <img src={BadgeEarnedIcon} alt="badge earned!" />
        </div>
      )}
      <div className="badge-image">
        <MyImage alt="badge" src={badge?.imageUri} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} isLoading={loading} params={badgeImageParams} />
      </div>
      <div className="badge-details">
        <div className="name">
          <div className="text">
            {badge?.name}
          </div>
        </div>
        {!hideDescription && <div className="desc">{badge?.description}</div>}
        {!hideDescription && (
          <div className="earned-badge">
            <div className={`earned${isAwarded ? '' : ' hide'}`}>
              <div className="image" />
              <div className="text">{t("Yay! You've earned this badge")}</div>
            </div>
          </div>
        )}
      </div>
      {!hideDescription && (
        <div className="earned-badge-users">
          <Loading show={loading} size="24px" />
          <ul className="user-list">
            {awardedUsers?.slice(-5).map((v) => (
              <li key={`awarded-users_${v.id}`}>
                <MyImage
                  src={v.profileImageUri}
                  alt={v.name}
                  defaultImage={DefaultProfilePicture}
                  width={DEFAULT_PROFILE_IMAGE_SIZE}
                />
              </li>
            ))}
            {awardedUsers.length > 5 && (
              <li>
                <MyImage
                  src={MoreMembers}
                  alt="More members"
                  defaultImage={DefaultProfilePicture}
                  width={DEFAULT_PROFILE_IMAGE_SIZE}
                />
              </li>
            )}
          </ul>
          {t('earnBadge', { count: awardedUsers.length })}
        </div>
      )}
    </div>
  );

  return disableLink ? (
    <div className="badge-item">{badgeItemSub}</div>
  ) : (
    <Link to={`/badge/${id}`} className="badge-item">{badgeItemSub}</Link>
  );
}

export default BadgeItem;
