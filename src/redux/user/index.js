import { createSlice } from '@reduxjs/toolkit';

const initialState = {
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action) => ({ ...state, ...action.payload }),
    clear: () => ({}),
  },
});

export const { set, clear } = userSlice.actions;
export default userSlice.reducer;
