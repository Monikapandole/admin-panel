import axiosInstance from '../axiosInstance';
import { getToken } from './categoryService';

export const fetchAllAreas = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewArea',
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
    console.error('Error fetching areas:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteArea = async (id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axiosInstance.post(
      '/deleteArea',
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
    console.error('Error deleting area:', error?.response?.data || error.message);
    throw error;
  }
};

export const addArea = async ({ name, description, lat, log, area_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('log', log);
    formData.append('area_image', area_image || "");

    const response = await axiosInstance.post(
      '/addArea',
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
    console.error('Error adding area:', error?.response?.data || error.message);
    throw error;
  }
};

export const editArea = async ({ id, name, description, lat, log, area_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('log', log);
    if (area_image) {
      formData.append('area_image', area_image);
    }
    const response = await axiosInstance.post(
      '/editArea',
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
    console.error('Error editing area:', error?.response?.data || error.message);
    throw error;
  }
}; 