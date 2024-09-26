import axios from 'axios';
import Config from 'src/config';

async function get({ branchId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/branch/public/${branchId}`, { params });
}

async function getList({ ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/branch/public`, { params });
}

export default {
  get,
  getList,
};
