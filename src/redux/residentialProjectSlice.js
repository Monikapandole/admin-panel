import { createSlice } from '@reduxjs/toolkit';

const residentialProjectSlice = createSlice({
  name: 'residentialProject',
  initialState: {
    projects: [],
  },
  reducers: {
    setResidentialProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});

export const { setResidentialProjects } = residentialProjectSlice.actions;
export default residentialProjectSlice.reducer; 