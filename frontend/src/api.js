import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the CSRF token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('csrftoken');  // Get CSRF token from cookies
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;  // Add CSRF token to all requests
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
