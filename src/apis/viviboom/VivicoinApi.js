import axios from 'axios';
import Config from 'src/config';

async function getWallet({ authToken, walletId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/wallet/${walletId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function claimReward({ authToken, code }) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/reward/claim`, { code }, { headers: { 'auth-token': authToken } });
}

async function getTransaction({ authToken, transactionId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/transaction/${transactionId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function postWallet({
  authToken, userId, status,
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/wallet`, {
    userId,
    status,
  }, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  getWallet,
  claimReward,
  getTransaction,
  postWallet,
};
