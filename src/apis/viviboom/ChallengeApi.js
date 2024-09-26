import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/challenge`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function get({ authToken, challengeId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/challenge/${challengeId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

export default {
  getList,
  get,
};
