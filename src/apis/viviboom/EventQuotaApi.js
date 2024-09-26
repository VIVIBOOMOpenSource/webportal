import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/event-quota`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

export default {
  getList,
};
