import axios from 'axios';
import Config from 'src/config';

async function getList({ ...params }) {
  return axios.get(`${Config.Common.ApiBaseUrl}/v2/institution/public`, {
    params,
  });
}

async function post({
  name, code, countryISO, tzIANA, initialBranchName, username, newPassword, guardianEmail, givenName, familyName,
}) {
  return axios.post(`${Config.Common.ApiBaseUrl}/v2/institution/public`, {
    name,
    code,
    countryISO,
    tzIANA,
    initialBranchName,
    username,
    newPassword,
    guardianEmail,
    givenName,
    familyName,
  });
}
export default {
  getList,
  post,
};
