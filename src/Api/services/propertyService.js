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

export const editPropertyAPI = async (formData) => {
  const token = getToken();
  try {
    const response = await axiosInstance.post(
      '/editProperties',
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
    console.error('Error editing property:', error?.response?.data || error.message);
    throw error;
  }
};

export const uploadPropertyImagesAPI = async (propertyId, images) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('property_id', propertyId);
  images.forEach((img) => {
    formData.append('property_images', img);
  });
  try {
    const response = await axiosInstance.post(
      '/uploadPropertyImages',
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
    console.error('Error uploading property images:', error?.response?.data || error.message);
    throw error;
  }
};

export const editPropertyImagesAPI = (propertyId, images) => {
  const formData = new FormData();
  formData.append('property_id', propertyId);
  images.forEach((img) => {
    formData.append('property_images', img);
  });
  return axiosInstance.post('/editPropertyImages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const fetchAllPropertyRequests = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewPropertyRequest',
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
    console.error('Error fetching property requests:', error?.response?.data || error.message);
    throw error;
  }
};

export const updatePropertyOrderAPI = async (propertyId, orderPosition) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('property_id', propertyId);
    formData.append('order_position', orderPosition);
    
    const response = await axiosInstance.post(
      '/updatePropertyOrder',
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
    console.error('Error updating property order:', error?.response?.data || error.message);
    throw error;
  }
}; 