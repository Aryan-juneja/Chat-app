// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    currentChat: null,
  },
  reducers: {
    setChats: (state, action) => {
      console.log(action.payload)
      state.chats = action.payload;
    },
    setCurrentChat: (state, action) => {
      console.log(action.payload)
      state.currentChat = action.payload;
    },
  },
});

export const { setChats, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
