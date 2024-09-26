import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/badge`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function get({ authToken, badgeId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/badge/${badgeId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

export default {
  getList,
  get,
};
