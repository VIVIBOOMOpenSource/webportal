import axios from 'axios';
import Config from 'src/config';

async function getList({ ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/challenge/public`, {
    params,
  });
}

async function get({ challengeId, ...params }) {
  return axios.get(
    `${Config.Common.ApiBaseUrl}/v2/challenge/public/${challengeId}`,
    {
      params,
    },
  );
}

export default {
  getList,
  get,
};
