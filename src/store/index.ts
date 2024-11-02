import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import raceReducer from './slices/raceSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    race: raceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
