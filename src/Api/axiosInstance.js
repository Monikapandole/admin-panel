import axios from 'axios';
console.log('API Base URL 👉', process.env.REACT_APP_API_BASE_URL);


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
  withCredentials: true, // ✔️ ensures cookies are sent
// not import.meta.env
});

export default axiosInstance;
