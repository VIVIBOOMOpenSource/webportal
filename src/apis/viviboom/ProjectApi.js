import axios from 'axios';
import Config from 'src/config';

async function deleteProject({ authToken, projectId }) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteProjectImage({ authToken, projectId, imageId }) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/image/${imageId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteProjectVideo({ authToken, projectId, videoId }) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/video/${videoId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteProjectFile({ authToken, projectId, fileId }) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/file/${fileId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function get({ authToken, projectId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getList({ authToken, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function like({
  authToken, projectId, isLike, ...rest
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/like`, {
    projectId,
    isLike,
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function patch({ authToken, projectId, ...rest }) {
  return axios.patch(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}`, {
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function post({ authToken, ...rest }) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project`, {
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function postProjectImage({
  authToken, projectId, insertOrder, file,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/image`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function postProjectVideo({
  authToken, projectId, insertOrder, file,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/video`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function postProjectFile({
  authToken, projectId, insertOrder, file, name,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/file`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function putProjectImage({
  authToken, projectId, imageId, file,
}) {
  const formData = new FormData();
  formData.append('file', file);

  return axios.put(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/image/${imageId}`, formData, {
    headers: { 'auth-token': authToken },
  });
}

// project sections
async function deleteSection({ authToken, projectSectionId }) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/section/${projectSectionId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteSectionImage({
  authToken, projectId, projectSectionId, imageId,
}) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/image/${imageId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteSectionVideo({
  authToken, projectId, projectSectionId, videoId,
}) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/video/${videoId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function deleteSectionFile({
  authToken, projectId, projectSectionId, fileId,
}) {
  return axios.delete(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/file/${fileId}`, {
    headers: { 'auth-token': authToken },
  });
}

async function getSection({ authToken, projectSectionId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project/section/${projectSectionId}`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function getSections({ authToken, projectId, ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section`, {
    headers: { 'auth-token': authToken },
    params,
  });
}

async function patchSection({ authToken, projectSectionId, ...rest }) {
  return axios.patch(`${Config.Common.ApiBaseUrl}/v2/project/section/${projectSectionId}`, {
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function postSection({ authToken, projectId, ...rest }) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/section`, {
    projectId,
    ...rest,
  }, {
    headers: { 'auth-token': authToken },
  });
}

async function postSectionImage({
  authToken, projectId, projectSectionId, insertOrder, file,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/image`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function postSectionVideo({
  authToken, projectId, projectSectionId, insertOrder, file,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/video`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function postSectionFile({
  authToken, projectId, projectSectionId, insertOrder, file, name,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('insertOrder', insertOrder);

  return axios.post(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/file`, formData, {
    headers: { 'auth-token': authToken },
  });
}

async function putSectionImage({
  authToken, projectId, projectSectionId, imageId, file,
}) {
  const formData = new FormData();
  formData.append('file', file);

  return axios.put(`${Config.Common.ApiBaseUrl}/v2/project/${projectId}/section/${projectSectionId}/image/${imageId}`, formData, {
    headers: { 'auth-token': authToken },
  });
}

export default {
  deleteProject,
  deleteProjectFile,
  deleteProjectImage,
  deleteProjectVideo,
  deleteSection,
  deleteSectionFile,
  deleteSectionImage,
  deleteSectionVideo,
  get,
  getList,
  getSection,
  getSections,
  like,
  patch,
  patchSection,
  post,
  postProjectFile,
  postProjectImage,
  postProjectVideo,
  postSection,
  postSectionFile,
  postSectionImage,
  postSectionVideo,
  putProjectImage,
  putSectionImage,
};
