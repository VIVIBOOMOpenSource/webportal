import axios from 'axios';
import Config from 'src/config';

async function getAuthToken({ authToken }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/stream-chat/authToken`, {
    headers: { 'auth-token': authToken },
  });
}

async function postMessage({
  authToken, receiver, receivers, receiverType, text, ...rest
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/stream-chat/message`, {
    receiver, receivers, receiverType, text, ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  getAuthToken,
  postMessage,
};
