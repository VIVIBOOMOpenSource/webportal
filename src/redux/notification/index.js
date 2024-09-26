import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  all: [],
  unpresented: [],
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
})

export const { set } = notificationSlice.actions
export default notificationSlice.reducer
