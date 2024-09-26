import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './member-challenges.scss';

import Pagination from 'src/components/common/pagination/pagination';

import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { ChallengeOrderType } from 'src/enums/ChallengeOrderType';
import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import ChallengeItem from '../../challenges/challenge-item';

const DEFAULT_CHALLENGE_LIMIT = 12;

function MembersChallenges({ member, setTabId }) {
  const { t } = useTranslation('translation', { keyPrefix: 'members' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchChallenges = useCallback(async () => {
    if (!user?.authToken) return;
    setChallenges([]);
    const requestParams = {
      authToken: user.authToken,
      order: ChallengeOrderType.LATEST,
      awardedUserId: member?.id,
      verboseAttributes: ['awardedUsers'],
      limit: DEFAULT_CHALLENGE_LIMIT,
      offset: (page - 1) * DEFAULT_CHALLENGE_LIMIT,
    };
    setLoading(true);
    try {
      const res = await ChallengeApi.getList(requestParams);
      setChallenges(res.data?.challenges);
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
    fetchChallenges();
  }, [fetchChallenges]);

  return (
    <div className="member-challenge">
      <Joyride sectionType={TutorialSectionType.MEMBER} />
      <div className="member-challenge-content-bottom">
        <div className="profile-button-container">
          <button className="profile-button" type="button" onClick={handleClickMain}>
            {t('Back to Profile')}
          </button>
        </div>
        <div className="body">
          <div className="member-challenges">
            <div className="title-container">
              <div className="header">{t('Challenges')}</div>
            </div>
            {challenges?.length > 0 ? (
              <ul className="challenge-list">
                {challenges.map((v) => (
                  <li key={`user-challenge${v.id}`}>
                    <ChallengeItem id={v.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-challenges">{t('This member is just getting started — no challenges completed yet!')}</div>
            )}
          </div>

          <div className="member-challenge-main-footer">
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersChallenges;
