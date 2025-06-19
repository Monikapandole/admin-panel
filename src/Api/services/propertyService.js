import axiosInstance from '../axiosInstance';
import { getToken } from './categoryService';

export const fetchAllProperties = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewProperties',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `Admin_token=${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error?.response?.data || error.message);
    throw error;
  }
};

export const addPropertyAPI = async (formData) => {
  const token = getToken();
  try {
    const response = await axiosInstance.post(
      '/addProperties',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `Admin_token=${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding property:', error?.response?.data || error.message);
    throw error;
  }
};

export const deletePropertyAPI = async (id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axiosInstance.post(
      '/deleteProperties',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `Admin_token=${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting property:', error?.response?.data || error.message);
    throw error;
  }
}; 