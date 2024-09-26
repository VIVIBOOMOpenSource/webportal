import { setGlobal } from 'reactn';
import * as stringUtil from '../utils/string';

const initStore = () => {
  setGlobal({
    header: {menuOpen:false},
    user: (localStorage.getItem('user') !== null) ? stringUtil.tryJSONParse(localStorage.user) : null,
    notifications: "[]",
  });
};

export default initStore;