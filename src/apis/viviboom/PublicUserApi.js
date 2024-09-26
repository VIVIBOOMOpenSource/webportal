import axios from 'axios';
import Config from 'src/config';

async function get({ userId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/user/public/${userId}`, {
    params,
  });
}

async function getList({ userId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/user/public`, {
    params,
  });
}

async function postSignUp(body) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/user/public/sign-up`, body);
}

export default {
  get,
  getList,
  postSignUp,
};
