//api/services/authservices

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import { getToken } from '../../Api/services/categoryService';

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/adminLogin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);


// api/auth.js or similar
export const userLogout = async (userId, token) => {
  const formData = new FormData();
  formData.append('user_id', userId);

  const response = await axiosInstance.post('/Logout', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cookie': `token=${token}`, // Send token in Cookie header
    },
  });

  return response.data;
};

// Fetch admin profile details
export const fetchAdminProfile = async () => {
  const adminToken = getToken();
  const response = await axiosInstance.get('/adminProfile', {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Cookie': `Admin_token=${adminToken}`

    },
    withCredentials: true,
  });
  return response.data;
};
