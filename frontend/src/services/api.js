import axios from 'axios';

const API_BASE = 'https://bookhub-1-ni31.onrender.com/api'; // Deployed backend URL

const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor to attach JWT token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ========================= BOOKS API =========================
export const bookAPI = {
  list: (params) => api.get('/books/', { params }),
  details: (id) => api.get(`/books/${id}/`),
  add: (formData) => api.post('/books/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  edit: (id, formData) => api.put(`/books/edit/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id) => api.delete(`/books/delete/${id}/`),
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
  create: (data) => api.post('/users/create/', data), // Corrected the endpoint for creating a user
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
