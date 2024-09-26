import axios from 'axios';
import Config from 'src/config';

async function get({ bookingToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/booking/public/${bookingToken}`, {
    params,
  });
}

async function post({
  familyName,
  givenName,
  phone,
  email,
  eventId,
  ...rest
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/booking/public`, {
    familyName,
    givenName,
    phone,
    email,
    eventId,
    ...rest,
  }, {});
}

async function patch({
  authToken, bookingId, bookingToken, ...rest
}) {
  return axios.patch(`${Config.Common.ApiBaseUrl}/v2/booking/public/${bookingToken}`, {
    bookingToken, ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  get,
  post,
  patch,
};
