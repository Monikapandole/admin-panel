import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './propertySlice';
import authReducer from './authSlice';
import residentialProjectReducer from './residentialProjectSlice';

const store = configureStore({
  reducer: {
    property: propertyReducer,
    auth: authReducer,
    residentialProject: residentialProjectReducer,
  },
});

export default store;
