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

export const fetchTenants = async () => {
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
    console.error('Error fetching tenants:', error?.response?.data || error.message);
    throw error;
  }
};

export const addTenant = async ({ name }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('name', name);
    const response = await axiosInstance.post(
      '/addTenant',
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
    console.error('Error adding tenant:', error?.response?.data || error.message);
    throw error;
  }
};

export const editTenant = async ({ id, name, status }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('status', status);
    const response = await axiosInstance.post(
      '/editTenant',
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
    console.error('Error editing tenant:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteTenant = async (id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axiosInstance.post(
      '/deleteTenant',
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
    console.error('Error deleting tenant:', error?.response?.data || error.message);
    throw error;
  }
};

export const editUser = async ({ user_id, name, email, country_code, phone_number, account_status, profile_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('country_code', country_code);
    formData.append('phone_number', phone_number);
    formData.append('account_status', account_status);
    if (profile_image) {
      formData.append('profile_image', profile_image);
    }
    const response = await axiosInstance.post(
      '/editUser',
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
    console.error('Error editing user:', error?.response?.data || error.message);
    throw error;
  }
};
