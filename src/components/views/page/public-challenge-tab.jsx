import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import './public-challenge-tab.scss';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Pagination from 'src/components/common/pagination/pagination';
import Loading from 'src/components/common/loading/loading';
import PublicChallengeApi from 'src/apis/viviboom/PublicChallengeApi';
import { ChallengeOrderType } from 'src/enums/ChallengeOrderType';
import BadgeModal from '../my-account/public-portfolio/badge-modal';
import PublicChallengeItem from './public-challenge-item';

const DEFAULT_LIMIT = 20;

function PublicChallengeTab({ portfolio }) {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]); // for all badges

  const [challengesLoading, setChallengesLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const scrollToRef = useRef();

  // regular challenges pagination
  const fetChallenges = useCallback(async () => {
    if (!portfolio) return;
    const requestParams = {
      institutionId: portfolio?.institutionId,
      order: ChallengeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      portfolioId: portfolio.id,
    };

    setChallengesLoading(true);
    try {
      const res = await PublicChallengeApi.getList(requestParams);
      setChallenges(res.data?.challenges);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setChallengesLoading(false);
  }, [page, portfolio]);

  useEffect(() => {
    fetChallenges();
  }, [fetChallenges]);

  return (
    <div className="public-challenge-tab">
      <div className="home-content" ref={scrollToRef}>
        <h6>{portfolio.headingBadge || t('Challenges')}</h6>
        <div className="challenges-div">
          <div className="challenges-div-content">
            <div className="challenges-shown">
              <Loading show={challengesLoading} size="24px" />
              <div id="challenge-list" className="challenge-list">
                {challenges.map((v) => (
                  <div key={`challenge-${v.id}`}>
                    <PublicChallengeItem preloadedData={v} link={`/view-portfolio/${portfolio?.code}/challenge/${v?.id}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="challenges-main-footer">
              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} scrollToRef={scrollToRef.current} />}
            </div>
          </div>
        </div>
      </div>
      <BadgeModal show={!!selectedChallenge} badge={selectedChallenge} handleClose={() => setSelectedChallenge(null)} />
    </div>
  );
}

export default PublicChallengeTab;
