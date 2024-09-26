import AuthApi from 'src/apis/viviboom/AuthApi';
import UserApi from 'src/apis/viviboom/UserApi';
import VivicoinApi from 'src/apis/viviboom/VivicoinApi';
import PublicUserApi from 'src/apis/viviboom/PublicUserApi';
import { set, clear } from './index';
import { store } from '../store';
import NotificationReduxActions from '../notification/NotificationReduxActions';
import TutorialReduxActions from '../tutorial/TutorialReduxActions';

const verifyEmail = async ({ authToken, token }) => store.dispatch(async (dispatch) => {
  const response = await AuthApi.verifyEmail({ authToken, token });
  dispatch(set(response.data));
  NotificationReduxActions.fetch();
  TutorialReduxActions.setAll(response.data.isCompletedTutorial);
  return response.data;
});

const signUp = async (givenName, familyName, email, username, password, code) => store.dispatch(async (dispatch) => {
  const response = await PublicUserApi.postSignUp({
    givenName, familyName, guardianEmail: email, username, newPassword: password, branchCode: code,
  });
  dispatch(set(response.data));
  NotificationReduxActions.fetch();
  TutorialReduxActions.setAll(response.data.isCompletedTutorial);
  return response.data;
});

const login = async ({ username, password }) => store.dispatch(async (dispatch) => {
  const response = await AuthApi.login({ username, password });
  dispatch(set(response.data));
  NotificationReduxActions.fetch();
  TutorialReduxActions.setAll(response.data.isCompletedTutorial);
  return response.data;
});

const logout = async () => store.dispatch(async (dispatch) => {
  const { authToken } = store.getState().user;
  let response;
  try {
    response = await AuthApi.logout({ authToken });
  } catch (e) {
    console.error(e);
  }
  dispatch(clear());
  return response?.data;
});

const fetch = async () => store.dispatch(async (dispatch) => {
  const { user } = store.getState();
  const { id, authToken } = user;
  let response;
  try {
    response = await UserApi.get({
      authToken,
      userId: id,
      verboseAttributes: ['staffRoles'],
    });
  } catch (e) {
    console.error(e);
  }
  dispatch(set({ ...user, ...response.data.user }));
  return response?.data;
});

const fetchWallet = async () => {
  const { user } = store.getState();
  const userId = user?.id;
  const walletId = user?.wallet?.id;
  const authToken = user?.authToken;

  if (walletId) {
    try {
      const response = await VivicoinApi.getWallet({ authToken, walletId });
      store.dispatch(set({ wallet: response.data.wallet }));
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const res = await UserApi.get({ authToken, userId, verboseAttributes: ['wallet'] });
      let fetchedWallet = res?.data?.user?.wallet;
      if (!fetchedWallet) {
        const postWalletRes = await VivicoinApi.postWallet({ authToken, userId });
        const getWalletRes = await VivicoinApi.getWallet({ authToken, walletId: postWalletRes.data.walletId });
        fetchedWallet = getWalletRes.data.wallet;
      }
      store.dispatch(set({ wallet: fetchedWallet }));
    } catch (err) {
      console.log(err);
    }
  }
};

export default {
  verifyEmail,
  signUp,
  login,
  logout,
  fetch,
  fetchWallet,
};
