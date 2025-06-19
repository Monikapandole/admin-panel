import axiosInstance from '../axiosInstance';
import { getToken } from './categoryService';

export const fetchAllUsers = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewUser',
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
    console.error('Error fetching users:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axiosInstance.post(
      '/deleteUser',
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
    console.error('Error deleting user:', error?.response?.data || error.message);
    throw error;
  }
};

export const addUser = async ({ name, email, password, country_code, phone_number, profile_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('country_code', country_code);
    formData.append('phone_number', phone_number);
    if (profile_image) {
      formData.append('profile_image', profile_image);
    }
    const response = await axiosInstance.post(
      '/addUser',
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
    console.error('Error adding user:', error?.response?.data || error.message);
    throw error;
  }
};

export const fetchTenantPreferences = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewTenant',
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
    console.error('Error fetching tenant preferences:', error?.response?.data || error.message);
    throw error;
  }
};
