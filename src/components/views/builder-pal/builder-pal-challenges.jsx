import React, {
  useEffect, useState, useCallback,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Player } from '@lottiefiles/react-lottie-player';

import './builder-pal-challenges.scss';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import Loading from 'src/components/common/loading/loading';
import builderPalChallengeAnim from 'src/css/lotties/builder-pal-project.json';
import builderPalLoadingAnim from 'src/css/lotties/builder-pal-loading.json';
import builderPalNoResultAnim from 'src/css/lotties/builder-pal-no-result.json';
import { ReactComponent as HomeSVG } from 'src/css/imgs/icon-home.svg';
import Button from 'src/components/common/button/button';
import ChallengeItem from '../challenges/challenge-item';

const DEFAULT_LIMIT = 6;

export default function BuilderPalChallenges() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [isEndOfChallenges, setIsEndOfChallenges] = useState(false);
  const [challenges, setChallenges] = useState([]);

  const params = useParams();
  const history = useHistory();
  const { id } = params;

  const fetchChallenges = useCallback(async (hardRefresh = false) => {
    if (!user?.authToken || loading) return;
    if (!hardRefresh && isEndOfChallenges) return;
    setLoading(true);
    try {
      const requestParams = {
        authToken: user.authToken,
        limit: DEFAULT_LIMIT,
        offset: hardRefresh ? 0 : challenges.length,
        chatId: id,
      };
      const res = await BuilderPalApi.getChallenges(requestParams);
      if (hardRefresh) {
        setChallenges(res.data?.challenges);
      } else {
        setChallenges((prev) => [...prev, ...(res.data?.challenges || [])]);
      }
      if (res.data.challenges.length < DEFAULT_LIMIT) {
        setIsEndOfChallenges(true);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, isEndOfChallenges, loading, challenges.length, user.authToken]);

  useEffect(() => {
    fetchChallenges(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmptyResult = !challenges.length && isEndOfChallenges;

  return (
    <div className="builder-pal-challenges">
      <div className="builder-pal">
        <h3 className="title">{t('Dream with BuilderPal!')}</h3>
        <div className="builder-pal-challenge-container">
          <div className="challenge-prompt-container">
            <div className="challenge-prompt">
              {isEmptyResult && (
                <Player
                  autoplay
                  loop
                  src={builderPalNoResultAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              {!isEmptyResult && loading && (
                <Player
                  autoplay
                  loop
                  src={builderPalLoadingAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              {!isEmptyResult && !loading && (
                <Player
                  autoplay
                  loop
                  src={builderPalChallengeAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              <h4 className="guiding-title">
                {isEmptyResult ? 'Oops, no luck finding a perfect match on Viviboom. Shall we dream up some projects?' : `${loading ? 'Hang on for a sec, diving into the Viviboom challenge pool!' : 'Hey, check out these awesome challenges on Viviboom! 😊'}`}
              </h4>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/related-projects`)}>{t('Hit me with Viviboom projects')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/projects`)}>{t('Dream up some projects for me')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}`)}>{t('Uh... We should talk more')}</Button>
            </div>
            <Button parentClassName="home" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
          </div>
          <div className="challenges-container">
            <div className="challenge-list">
              {challenges.map((v) => <ChallengeItem key={`builderpal-challenge_${v.id}`} id={v.id} preloadedData={v} />)}
            </div>
            {loading && (
              <div className="loader-container">
                <Loading show size={18} />
                <p className="loader-text">{t('BuilderPal is thinking hard...')}</p>
              </div>
            )}
            {(!loading && !isEndOfChallenges) && <Button parentClassName="load-more-button" onClick={() => fetchChallenges(false)}>{t('Load More')}</Button>}
            {(!loading && isEndOfChallenges) && <p className="end-message">{t(isEmptyResult ? 'No related challenge found on Viviboom' : 'Yay! You have seen it all!')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
