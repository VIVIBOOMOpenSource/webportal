import axios from 'axios';
import Config from 'src/config';

async function get({ authToken, portfolioId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/portfolio/public/${portfolioId}`, {
    params,
  });
}

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/portfolio/public`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

export default {
  get,
  getList,
};
