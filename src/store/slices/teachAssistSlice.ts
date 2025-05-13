// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// (If you see a linter error on this import, please run: npm install @reduxjs/toolkit)

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the TeachAssist state slice type
export interface TeachAssistState {
  courses: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: TeachAssistState = {
  courses: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const teachAssistSlice = createSlice({
  name: 'teachAssist',
  initialState,
  reducers: {
    setCourses(state: TeachAssistState, action: PayloadAction<any[]>) {
      state.courses = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setLoading(state: TeachAssistState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state: TeachAssistState, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const { setCourses, setLoading, setError } = teachAssistSlice.actions;
export default teachAssistSlice.reducer; 