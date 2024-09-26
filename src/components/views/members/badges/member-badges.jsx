import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './member-badges.scss';

import BadgeApi from 'src/apis/viviboom/BadgeApi';

import Pagination from 'src/components/common/pagination/pagination';
import BadgeItem from 'src/components/views/badges/badge-item';

import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { BadgeOrderType } from 'src/enums/BadgeOrderType';

const DEFAULT_BADGE_LIMIT = 12;

function MembersBadges({ member, setTabId }) {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchBadges = useCallback(async () => {
    if (!user?.authToken) return;
    setBadges([]);
    const requestParams = {
      authToken: user.authToken,
      order: BadgeOrderType.LATEST,
      awardedUserId: member?.id,
      verboseAttributes: ['awardedUsers'],
      limit: DEFAULT_BADGE_LIMIT,
      offset: (page - 1) * DEFAULT_BADGE_LIMIT,
    };
    setLoading(true);
    try {
      const res = await BadgeApi.getList(requestParams);
      setBadges(res.data?.badges);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, member?.id, page]);

  const handleClickMain = () => {
    setTabId(1);
    setPage(1);
    setTotalPages(1);
  };

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return (
    <div className="member-badge">
      <Joyride sectionType={TutorialSectionType.MEMBER} />
      <div className="member-badge-content-bottom">
        <div className="profile-button-container">
          <button className="profile-button" type="button" onClick={handleClickMain}>
            {t('Back to Profile')}
          </button>
        </div>
        <div className="body">
          <div className="member-badges">
            <div className="title-container">
              <div className="header">{t('Badges')}</div>
            </div>
            {badges?.length > 0 ? (
              <ul className="badge-list">
                {badges.map((v) => (
                  <li key={`user-badge_${v.id}`}>
                    <BadgeItem id={v.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-badges">{t('No badges have been earned by this member yet')}</div>
            )}
          </div>

          <div className="member-badge-main-footer">
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersBadges;
