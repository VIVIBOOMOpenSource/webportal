import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import NotificationReduxActions from 'src/redux/notification/NotificationReduxActions';

import successfulReward from 'src/css/lotties/successful-reward.json';
import failReward from 'src/css/lotties/failed-reward.json';

import './reward-results.scss';

import VivicoinApi from 'src/apis/viviboom/VivicoinApi';

import NaviPublic from 'src/components/navi/navi-public';
import UserReduxActions from 'src/redux/user/UserReduxActions';

function RewardResults() {
  const { t } = useTranslation('translation', { keyPrefix: 'reward' });
  const params = useParams();
  const { rewardCode } = params;
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState();
  const [transaction, setTransaction] = useState();
  const [transactionId, setTransactionId] = useState();
  const [isSuccessful, setIsSuccessful] = useState();

  useEffect(() => {
    if (user.authToken) {
      NotificationReduxActions.fetch();
    }
  }, [user.authToken]);

  const rewardClaim = useCallback(async () => {
    if (!rewardCode) {
      toast.error('Please enter a reward code to proceed');
      return;
    }
    setLoading(true);
    const requestParams = {
      authToken: user?.authToken,
      code: rewardCode,
    };
    try {
      const res = await VivicoinApi.claimReward(requestParams);
      setIsSuccessful(true);
      setTransactionId(res?.data?.transactionId);
    } catch (err) {
      console.error(err);
      setIsSuccessful(false);
      toast.error(err.response?.data?.message ?? err.message);
    }
    setLoading(false);
  }, [rewardCode, user?.authToken]);

  const fetchTransaction = useCallback(async () => {
    const requestParams = {
      authToken: user?.authToken,
      transactionId,
    };
    try {
      const res = await VivicoinApi.getTransaction(requestParams);
      setTransaction(res.data?.transaction);
    } catch (err) {
      console.error(err);
    }
  }, [transactionId, user?.authToken]);

  useEffect(() => {
    if (user?.authToken) rewardClaim();
  }, []);

  useEffect(() => {
    if (isSuccessful) {
      fetchTransaction();
      UserReduxActions.fetchWallet();
    }
  }, [transactionId, isSuccessful]);

  return (
    <div className="claim-reward">
      <div className="claim-reward-background" />
      <NaviPublic />
      <div className="reward-claim-content">
        {!isSuccessful && !loading && (
          <div className="reward-claim-info">
            <div className="reward-info-container">
              <div className="reward-titles-container">
                <div className="rewards-failed-title">{t('Oops! Something went wrong...')}</div>
                <div className="rewards-failed-subtitle">{t('Please try again later')}</div>
              </div>
              <div className="rewards-successful-text-container">
                <Player
                  autoplay
                  loop
                  src={failReward}
                  style={{ height: '300px', width: '300px' }}
                />
              </div>
            </div>
          </div>
        )}
        {isSuccessful && !loading && (
          <div className="reward-claim-info">
            <div className="reward-info-container">
              <div className="reward-titles-container">
                <div className="rewards-successful-title">
                  {t('CONGRATULATIONS')}
                  {' '}
                  { user?.username }
                </div>
                <div className="rewards-successful-subtitle">
                  {t('You have successfully redeemed')}
                  {' '}
                </div>
                {loading ? (
                  <div className="rewards-successful-text">
                    {t('fetching rewards from space station...')}
                  </div>
                ) : (
                  <div className="rewards-successful-title">
                    {t('VIVICOIN', { count: transaction?.amount || 0 })}
                  </div>
                )}
              </div>
              <div className="rewards-successful-text-container">
                <Player
                  autoplay
                  loop
                  src={successfulReward}
                  style={{ height: '300px', width: '300px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RewardResults;
