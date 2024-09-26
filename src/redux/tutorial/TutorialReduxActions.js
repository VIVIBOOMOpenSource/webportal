import TutorialSectionType from 'src/enums/TutorialSectionType';
import UserApi from 'src/apis/viviboom/UserApi';
import { set } from './index';
import { store } from '../store';

const patchTutorialCompletion = async () => {
  const { user } = store.getState();
  const { id, authToken } = user;
  await UserApi.patch({ userId: id, authToken, isCompletedTutorial: true });
};

const clearTutorial = (sectionName) => {
  store.dispatch(async (dispatch) => {
    const { tutorial } = store.getState();
    dispatch(set({ ...tutorial, [`${sectionName}`]: true }));
    if (sectionName === TutorialSectionType.WELCOME) await patchTutorialCompletion();
  });
};

const setAll = (isCompleted) => {
  store.dispatch((dispatch) => {
    dispatch(
      set({
        [TutorialSectionType.NAVI]: isCompleted,
        [TutorialSectionType.MOBILE_NAVI]: isCompleted,
        [TutorialSectionType.BADGES]: isCompleted,
        [TutorialSectionType.STARTER_CRITERIA]: isCompleted,
        [TutorialSectionType.PROJECTS]: isCompleted,
        [TutorialSectionType.PROJECT]: isCompleted,
        [TutorialSectionType.MEMBERS]: isCompleted,
        [TutorialSectionType.MEMBER]: isCompleted,
        [TutorialSectionType.BOOKINGS]: isCompleted,
        [TutorialSectionType.EVENTS]: isCompleted,
        [TutorialSectionType.WELCOME]: isCompleted,
      }),
    );
  });
};

export default { clearTutorial, setAll };
