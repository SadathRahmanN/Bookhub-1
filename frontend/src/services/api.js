import axios from 'axios';

const API_BASE = 'https://bookhub-1-ni31.onrender.com/api'; // Deployed backend URL

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor to attach JWT token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// ========================= BOOKS API =========================
export const bookAPI = {
  list: (params) => api.get('/books/', { params }), // Get list of books
  details: (id) => api.get(`/books/${id}/`), // Get details of a single book by ID
  add: (formData) => api.post('/books/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Add book with form data (e.g., file upload)
  }),
  edit: (id, formData) => api.put(`/books/edit/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Edit book with form data
  }),
  remove: (id) => api.delete(`/books/delete/${id}/`), // Delete book by ID
};

// ========================= AUTH API =========================
export const authAPI = {
  loginSignup: (data) => api.post('/auth/', data), // Login or signup
  roleLogin: (data) => api.post('/auth/role-login/', data), // Role-based login
  token: (data) => api.post('/token/', data), // Get JWT token
  refresh: (data) => api.post('/token/refresh/', data), // Refresh JWT token
};

// ========================= USERS API =========================
export const userAPI = {
  list: () => api.get('/users/'), // Get list of users
  get: (id) => api.get(`/users/${id}/`), // Get details of a user by ID
  create: (data) => api.post('/users/create/', data), // Create new user
  update: (id, data) => api.put(`/users/update/${id}/`, data), // Update user data
  remove: (id) => api.delete(`/users/delete/${id}/`), // Delete user by ID
  pending: () => api.get('/users/pending/'), // Get list of pending users
  approve: (id) => api.post(`/users/approve/${id}/`), // Approve pending user
};

// ========================= LIBRARIANS API =========================
export const librarianAPI = {
  pending: () => api.get('/librarians/pending/'), // Get list of pending librarians
  approve: (id) => api.post(`/librarians/approve/${id}/`), // Approve pending librarian
};

// ========================= BORROW API =========================
export const borrowAPI = {
  borrow: (data) => api.post('/borrow/', data), // Borrow a book
  return: (data) => api.post('/return/', data), // Return a book
  myList: () => api.get('/borrowed/'), // Get list of borrowed books
  allList: () => api.get('/borrowed/all/'), // Get list of all borrowed books (admin only)
};

export default api;
