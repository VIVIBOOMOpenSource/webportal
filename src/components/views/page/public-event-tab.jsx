import './public-event-tab.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import PublicEventApi from 'src/apis/viviboom/PublicEventApi';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';

import 'react-multi-carousel/lib/styles.css';
import PublicEventItem from './public-event-item';

const DEFAULT_LIMIT = 4;

function PublicEventTab({ portfolio }) {
  const { t } = useTranslation('translation', { keyPrefix: 'publicPortfolio' });
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async () => {
    const requestParams = {
      institutionId: portfolio?.institutionId,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      portfolioId: portfolio.id,
    };

    setLoading(true);
    try {
      const res = await PublicEventApi.getList(requestParams);
      setEvents(res.data?.events);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
    setLoading(false);
  }, [page, portfolio?.institutionId, portfolio.id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="public-event-tab">
      <h6>{portfolio.headingEvent || t('Events')}</h6>
      <div className="event-container-sub">
        {loading ? (
          <div className="loading-container">
            <Loading show={loading} size="40px" />
          </div>
        ) : (
          <ul className="event-list">
            {events.map((v) => (
              <li key={`event_${v.id}`}>
                <PublicEventItem eventSession={v} showReadMore />
              </li>
            ))}
          </ul>
        )}
        <div className="events-main-footer">
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}

export default PublicEventTab;
