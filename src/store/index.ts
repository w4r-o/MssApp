import { configureStore } from '@reduxjs/toolkit';
import teachAssistReducer from './slices/teachAssistSlice';

const store = configureStore({
  reducer: {
    teachAssist: teachAssistReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store; 