import axiosInstance from '../axiosInstance';


export const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user,
    user.JWT ,"token"
  )
  return user?.JWT || '';
};

export const getAllCategory = async () => {
  try {
    const token = getToken();

    const response = await axiosInstance.get('/viewCategory', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `Admin_token=${token}`

      },
      withCredentials: true,
    });

    return response?.data;
  } catch (error) {
    console.error('Error fetching categories:', error?.response?.data || error.message);
    return null;
  }
};

export const addCategory = async ({ category_name, description, category_image, status = "1" }) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('category_name', category_name);
    formData.append('description', description);
    formData.append('category_image', category_image || "");
    formData.append('status', status);

    const response = await axiosInstance.post('/addCategory', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `Admin_token=${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error?.response?.data || error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const editCategory = async ({ id, category_name, description, status = "1", category_image }) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('category_name', category_name);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('category_image', category_image || "");

    const response = await axiosInstance.post('/editCategory', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `Admin_token=${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error editing category:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('id', id);

    const response = await axiosInstance.post('/deleteCategory', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `Admin_token=${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error?.response?.data || error.message);
    throw error;
  }
};


