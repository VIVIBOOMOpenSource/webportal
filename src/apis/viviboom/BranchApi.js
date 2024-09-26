import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/branch`, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  getList,
};
