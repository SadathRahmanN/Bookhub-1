// src/service/api.js
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({ baseURL: API_BASE });

// Books
export const bookAPI = {
  list:     (params)   => api.get('/books/', { params }),
  details:  (id)       => api.get(`/books/${id}/`),
  add:      (data)     => api.post('/books/add/', data),
  edit:     (id, data) => api.put(`/books/edit/${id}/`, data),
  remove:   id         => api.delete(`/books/delete/${id}/`),
};

// Auth
export const authAPI = {
  loginSignup: data  => api.post('/auth/', data),
  roleLogin:   data  => api.post('/auth/role-login/', data),
  token:       data  => api.post('/token/', data),
  refresh:     data  => api.post('/token/refresh/', data),
};

// Users
export const userAPI = {
  list:        ()    => api.get('/users/'),
  get:    id  => api.get(`/users/${id}/`),
  update: (id, data) => api.put(`/users/update/${id}/`, data),
  remove: id  => api.delete(`/users/delete/${id}/`),
  pending:    ()    => api.get('/users/pending/'),
  approve: id => api.post(`/users/approve/${id}/`),
};

// Librarians
export const librarianAPI = {
  pending:    ()    => api.get('/librarians/pending/'),
  approve: id => api.post(`/librarians/approve/${id}/`),
};

// Borrow
export const borrowAPI = {
  borrow:  data => api.post('/borrow/', data),
  return:  data => api.post('/return/', data),
  myList:      () => api.get('/borrowed/'),
  allList:     () => api.get('/borrowed/all/'),
};

export default api;
