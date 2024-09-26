import UserApi from 'src/apis/viviboom/UserApi';
import { set } from './index';
import { store } from '../store';

const fetch = async () => store.dispatch(async (dispatch) => {
  const { id: userId, authToken } = store.getState().user;
  try {
    const response = await UserApi.getNotifications({ authToken, userId });
    const all = response.data.notifications || [];
    const unpresented = all.filter((notif) => notif.present && !notif.seen).sort((a, b) => a.id - b.id);
    // TODO we can skip dispatch if objects are same as stored state
    dispatch(set({ all, unpresented }));
    return response.data;
  } catch (e) {
    console.error(e);
  }
});

/**
 * Note: do not mark notifications to be presented in bulk, else they would not show it one after another
 * @param {*} param0
 * @returns
 */
const markSeen = async ({ notificationIds }) => store.dispatch(async (dispatch) => {
  const { id: userId, authToken } = store.getState().user;
  const response = await UserApi.updateNotifications({
    authToken, userId, notificationIds, seen: true,
  });
  const { all, unpresented } = store.getState().notification;
  const payload = {
    all: all.map((existing) => (notificationIds.indexOf(existing.id) >= 0 ? { ...existing, seen: true } : existing)),
    unpresented: unpresented.filter((existing) => notificationIds.indexOf(existing.id) < 0),
  };
  dispatch(set(payload));
  return response.data;
});

export default {
  fetch,
  markSeen,
};
