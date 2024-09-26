import { createSlice } from '@reduxjs/toolkit';
import TutorialSectionType from 'src/enums/TutorialSectionType';

const initialState = {
  [TutorialSectionType.NAVI]: false,
  [TutorialSectionType.MOBILE_NAVI]: false,
  [TutorialSectionType.BADGES]: false,
  [TutorialSectionType.STARTER_CRITERIA]: false,
  [TutorialSectionType.PROJECTS]: false,
  [TutorialSectionType.PROJECT]: false,
  [TutorialSectionType.MEMBERS]: false,
  [TutorialSectionType.MEMBER]: false,
  [TutorialSectionType.BOOKINGS]: false,
  [TutorialSectionType.EVENTS]: false,
  [TutorialSectionType.WELCOME]: false,
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    set: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const { set } = tutorialSlice.actions;
export default tutorialSlice.reducer;
