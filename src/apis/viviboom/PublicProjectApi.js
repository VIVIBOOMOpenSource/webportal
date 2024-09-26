import axios from 'axios';
import Config from 'src/config';

async function get({ projectId, ...params }) {
  return axios.get(
    `${Config.Common.ApiBaseUrl}/v2/project/public/${projectId}`,
    {
      params,
    },
  );
}

async function getList({ ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project/public`, {
    params,
  });
}

async function getSections({ projectId, ...params }) {
  return axios.get(
    `${Config.Common.ApiBaseUrl}/v2/project/public/${projectId}/section`,
    {
      params,
    },
  );
}

export default {
  get,
  getList,
  getSections,
};
