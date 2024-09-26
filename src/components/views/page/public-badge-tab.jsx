import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import './public-badge-tab.scss';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { BadgeOrderType } from 'src/enums/BadgeOrderType';
import Pagination from 'src/components/common/pagination/pagination';
import Loading from 'src/components/common/loading/loading';
import PublicBadgeApi from 'src/apis/viviboom/PublicBadgeApi';
import PublicBadgeItem from './public-badge-item';
import BadgeModal from '../my-account/public-portfolio/badge-modal';

const DEFAULT_LIMIT = 20;

function PublicBadgeTab({ portfolio }) {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badges, setBadges] = useState([]); // for all badges

  const [badgesLoading, setBadgesLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const scrollToRef = useRef();

  // regular badge pagination
  const getBadges = useCallback(async () => {
    if (!portfolio) return;
    const requestParams = {
      institutionId: portfolio?.institutionId,
      order: BadgeOrderType.LATEST,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      portfolioId: portfolio.id,
    };

    setBadgesLoading(true);
    try {
      const res = await PublicBadgeApi.getList(requestParams);
      setBadges(res.data?.badges);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setBadgesLoading(false);
  }, [page, portfolio]);

  useEffect(() => {
    getBadges();
  }, [getBadges]);

  return (
    <div className="public-badge-tab">
      <div className="home-content" ref={scrollToRef}>
        <h6>{portfolio.headingBadge || t('Badges')}</h6>
        <div className="badges-div">
          <div className="badges-div-content">
            <div className="badges-shown">
              <Loading show={badgesLoading} size="24px" />
              <div id="badge-list" className="badge-list">
                {badges.map((v) => (
                  <div key={`badge-${v.id}`}>
                    <PublicBadgeItem preloadedData={v} onClick={() => setSelectedBadge(v)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="badges-main-footer">
              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} scrollToRef={scrollToRef.current} />}
            </div>
          </div>
        </div>
      </div>
      <BadgeModal show={!!selectedBadge} badge={selectedBadge} handleClose={() => setSelectedBadge(null)} />
    </div>
  );
}

export default PublicBadgeTab;
