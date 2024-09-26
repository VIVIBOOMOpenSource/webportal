import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NotificationReduxActions from 'src/redux/notification/NotificationReduxActions';
import { ReactComponent as RewardSvg } from 'src/css/imgs/icon-gift-outline.svg';

import './wallet.scss';

import Vivicoin from 'src/css/imgs/v-coin.png';
import UserReduxActions from 'src/redux/user/UserReduxActions';

function Wallet() {
  const { t } = useTranslation('translation', { keyPrefix: 'reward' });
  const user = useSelector((state) => state?.user);

  useEffect(() => {
    if (user.authToken) NotificationReduxActions.fetch();
  }, [user.authToken]);

  useEffect(() => {
    UserReduxActions.fetchWallet();
  }, []);

  const getWallet = async () => {
    await UserReduxActions.fetchWallet();
  };

  return (
    <div className="claim-reward">
      <div className="reward-content">
        <div className="reward-background" />
        <div className="reward-info">
          <div className="wallet-main-container">
            <div className="reward-info-container">
              <p className="rewards-title">{t('Vivicoin Rewards')}</p>
              <p>{t('Unlock a world of rewards as new surprises await with each visit!')}</p>
              {user.wallet ? (
                <div className="vivicoin-container" onClick={getWallet}>
                  <div className="vivicoin-sub-container">
                    <div className="vivicoin-image-container">
                      <img className="vivicoin-image" alt="logo" src={Vivicoin} width={50} height={50} />
                      <div className="shade" />
                    </div>
                    <div className="vivicoin-amount-container">
                      <div className="vivicoin-amount-text">{t('VIVICOINS')}</div>
                      <div className="vivicoin-amount">{user.wallet?.balance || 0}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-wallet-container">
                  <div className="no-wallet-text">
                    {t('Oops! It seems like you do not have a wallet yet.')}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Link className="reward-claim-link-container" to="/reward">
            <div className="claim-reward-link" >
              <RewardSvg className="claim-reward-icon" />
              <div className="claim-reward-text">{t('Claim Reward')}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
