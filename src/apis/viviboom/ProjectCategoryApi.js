import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project-category`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function post({ authToken, name, ...rest }) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project-category`, {
    name,
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  getList,
  post,
};
