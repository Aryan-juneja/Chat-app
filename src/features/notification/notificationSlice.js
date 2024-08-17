import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notification: [], // Renamed to lowercase 'notification' for consistency
  },
  reducers: {
    setNotification: (state, action) => {
      console.log(action.payload);
      state.notification = action.payload; // Updated to match the state field name
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
