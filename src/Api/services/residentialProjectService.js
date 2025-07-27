import axiosInstance from '../axiosInstance';
import { getToken } from './categoryService';

export const fetchAllResidentialProjects = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      'https://realitywing.com/api_admin/viewResidentialProject',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching residential projects:', error?.response?.data || error.message);
    throw error;
  }
};

export const addResidentialProjectAPI = async (formData) => {
  const token = getToken();
  try {
    const response = await axiosInstance.post(
      'https://realitywing.com/api_admin/addResidentialProject',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding residential project:', error?.response?.data || error.message);
    throw error;
  }
};

export const editResidentialProjectAPI = async (formData) => {
  const token = getToken();
  try {
    const response = await axiosInstance.post(
      'https://realitywing.com/api_admin/editResidentialProject',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing residential project:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteResidentialProjectAPI = async (residential_id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('residential_id', residential_id);
    const response = await axiosInstance.post(
      'https://realitywing.com/api_admin/deleteResidentialProject',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting residential project:', error?.response?.data || error.message);
    throw error;
  }
};

export const uploadResidentialImagesAPI = async (residential_id, images) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('residential_id', residential_id);
    images.forEach((img) => {
      formData.append('residential_images', img);
    });
    const response = await axiosInstance.post(
      'https://realitywing.com/api_admin/uploadResidentialImages',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading residential images:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteResidentialImageAPI = async (residential_id, image_url) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('residential_id', residential_id);
    formData.append('image_url', image_url);
    const response = await axiosInstance.post(
      'https://realitywing.com/api_admin/deleteResidentialImage',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting residential image:', error?.response?.data || error.message);
    throw error;
  }
}; 