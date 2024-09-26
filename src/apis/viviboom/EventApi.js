import axios from 'axios';
import Config from 'src/config';

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/event`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function postResponse({
  authToken, eventId, bookingId, responses, ...rest
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/event/${eventId}/response`, {
    bookingId,
    responses,
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  getList,
  postResponse,
};
