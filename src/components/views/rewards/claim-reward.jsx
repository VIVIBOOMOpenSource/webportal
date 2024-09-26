import React, {
  useState, useEffect,
} from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NotificationReduxActions from 'src/redux/notification/NotificationReduxActions';
import { ReactComponent as ChevronLeft } from 'src/css/imgs/icon-chevron-left.svg';

import './claim-reward.scss';

import NaviPublic from 'src/components/navi/navi-public';

function ClaimReward() {
  const { t } = useTranslation('translation', { keyPrefix: 'reward' });
  const user = useSelector((state) => state?.user);
  const [rewardCode, setRewardCode] = useState();

  useEffect(() => {
    if (user.authToken) NotificationReduxActions.fetch();
  }, [user.authToken]);

  return (
    <div className="claim-reward">
      <div className="claim-reward-background" />
      <NaviPublic />
      <div className="reward-claim-content">
        <div className="reward-claim-main">
          <Link className="wallet-link-container" to="/wallet">
            <ChevronLeft className="wallet-link-icon" />
            {t('Back to wallet page')}
          </Link>
          <div className="reward-claim-info">
            <div className="reward-info-container">
              <p className="rewards-title">{t('Redeem Rewards')}</p>
              <div className="reward-text-container">
                <div className="rewards-subtitle">{t('Get your Reward')}</div>
                <div className="rewards-text">{t('Redeem your Promo Code to get free gifts and much more!')}</div>
                <div className="rewards-text">{t('Promo Codes are usually limited to one use per person.')}</div>
              </div>
              <div className="reward-code-container">
                <div className="reward-code-container">
                  <input className="reward-code-input" type="text" placeholder="Enter Reward Code" value={rewardCode} disabled={!user} onChange={(e) => { setRewardCode(e.target.value); }} />
                </div>
              </div>
              <div className="separator-container">
                <Link className="button" to={`/reward/${rewardCode}`}>
                  {t('Confirm')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimReward;
