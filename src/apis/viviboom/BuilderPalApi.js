import axios from 'axios';
import Config from 'src/config';

async function get({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getMessages({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/message`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getChallenges({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/challenge`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getProject({
  authToken, chatId, chatProjectId, ...params
}) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/project/${chatProjectId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getProjects({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/project`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getChatProjects({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/project`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getRelatedProjects({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/related-project`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getSuggestions({ authToken, chatId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/suggestions`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function patchProject({
  authToken, chatId, projectId, ...rest
}) {
  return axios.patch(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/project/${projectId}`, {
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function post({
  authToken, type, ...rest
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat`, {
    type,
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function postMessage({
  authToken, chatId, text, type, audioBlob,
}) {
  const formData = new FormData();
  if (text) formData.append('text', text);
  if (type) formData.append('type', type);
  if (audioBlob) formData.append('file', audioBlob);
  return fetch(`${Config.Common.ApiBaseUrl}/v2/builder-pal/chat/${chatId}/message`, {
    headers: {
      'auth-token': authToken,
    },
    method: 'POST',
    body: formData,
  });
}

export default {
  get,
  getList,
  getMessages,
  getChallenges,
  getProject,
  getProjects,
  getChatProjects,
  getRelatedProjects,
  getSuggestions,
  patchProject,
  post,
  postMessage,
};
