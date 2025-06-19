import axios from 'axios';
console.log('API Base URL 👉', process.env.REACT_APP_API_BASE_URL);


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // (Optional) You can still check for session timeout in successful responses
    return response;
  },
  error => {
    // Check if the error response exists and has the session timeout message
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data.result === 'string' &&
      error.response.data.result === 'Session Time Out!!'
    ) {
      // Remove token/session if needed
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    // Always reject the error so calling code can handle it too
    return Promise.reject(error);
  }
);

export default axiosInstance;