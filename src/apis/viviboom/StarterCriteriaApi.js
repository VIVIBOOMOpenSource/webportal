import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, branchId, ...params }) {
  return axios.get(
    `${Config.Common.ApiBaseUrl}/v2/branch/${branchId}/starter-badge`,
    {
      headers: { 'auth-token': authToken },
      params,
    },
  );
}

export default {
  getList,
};
