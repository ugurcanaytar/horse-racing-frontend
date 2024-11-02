import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  role: 'user' | 'admin';
}

const initialState: UserState = {
  username: '',
  role: 'user',
};

// const initialState: UserState = {
//   username: 'admin',
//   role: 'admin',
// };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearUser(state) {
      state.username = '';
      state.role = 'user';
    },
    login(state, action: PayloadAction<{ username: string; role: string }>) {
      state.username = action.payload.username;
      state.role = action.payload.role === "admin" ? "admin" : "user";
    },
    logout(state) {
      state.username = '';
      state.role = 'user';
    },
  },
});

export const { setUser, clearUser, login, logout } = userSlice.actions;
export default userSlice.reducer;
