import axios from 'axios';
import Config from 'src/config';

async function getList({ ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/event/public`, { params });
}

async function get({ id }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/event/public/${id}`, { });
}

export default {
  getList,
  get,
};
