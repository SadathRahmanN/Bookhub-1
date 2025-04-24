// src/service/api.js
import axios from 'axios';

const API_BASE = 'https://bookhub-1-ni31.onrender.com/api'; // Use your deployed backend URL here

const api = axios.create({
  baseURL: API_BASE,
});

// Add an interceptor to automatically add the JWT token in the Authorization header for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Get the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to request headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ========================= BOOKS API =========================
export const bookAPI = {
  list: (params) => api.get('/books/', { params }),  // Get the list of books
  details: (id) => api.get(`/books/${id}/`),  // Get book by ID
  add: (formData) => api.post('/books/add/', formData, {  // Add a new book with image
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  edit: (id, formData) => api.put(`/books/edit/${id}/`, formData, {  // Edit a book with image
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id) => api.delete(`/books/delete/${id}/`),  // Delete a book
};

// ========================= AUTH API =========================
export const authAPI = {
  loginSignup: (data) => api.post('/auth/', data),
  roleLogin: (data) => api.post('/auth/role-login/', data),
  token: (data) => api.post('/token/', data),
  refresh: (data) => api.post('/token/refresh/', data),
};

// ========================= USERS API =========================
export const userAPI = {
  list: () => api.get('/users/'),
  get: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.put(`/users/update/${id}/`, data),
  remove: (id) => api.delete(`/users/delete/${id}/`),
  pending: () => api.get('/users/pending/'),
  approve: (id) => api.post(`/users/approve/${id}/`),
};

// ========================= LIBRARIANS API =========================
export const librarianAPI = {
  pending: () => api.get('/librarians/pending/'),
  approve: (id) => api.post(`/librarians/approve/${id}/`),
};

// ========================= BORROW API =========================
export const borrowAPI = {
  borrow: (data) => api.post('/borrow/', data),
  return: (data) => api.post('/return/', data),
  myList: () => api.get('/borrowed/'),
  allList: () => api.get('/borrowed/all/'),
};

export default api;
