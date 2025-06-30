import axiosInstance from '../axiosInstance';
import { getToken } from './categoryService';

export const fetchAllBlogs = async () => {
  const token = getToken();
  try {
    const response = await axiosInstance.get(
      '/viewBlog',
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
    console.error('Error fetching blogs:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    const response = await axiosInstance.post(
      '/deleteBlog',
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
    console.error('Error deleting blog:', error?.response?.data || error.message);
    throw error;
  }
};

export const addBlog = async ({ title, content, featured_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('blog_image', featured_image || "");

    const response = await axiosInstance.post(
      '/addBlog',
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
    console.error('Error adding blog:', error?.response?.data || error.message);
    throw error;
  }
};

export const editBlog = async ({ id, title, content, featured_image }) => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('content', content);
    if (featured_image) {
      formData.append('blog_image', featured_image);
    }
    const response = await axiosInstance.post(
      '/editBlog',
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
    console.error('Error editing blog:', error?.response?.data || error.message);
    throw error;
  }
}; 