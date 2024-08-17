import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import chatReducer from '../features/chats/chatSlice'
import notificationReducer from '@/features/notification/notificationSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    notification:notificationReducer
  },
});


