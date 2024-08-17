import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      console.log(action.payload)
      localStorage.setItem('user', JSON.stringify(action.payload)); // Store in localStorage
    },
    setUserFromLocalStorage: (state) => {   
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log(storedUser)
      if (storedUser) {
        state.user = storedUser;
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setUserFromLocalStorage, clearUser } = userSlice.actions;

export default userSlice.reducer;
