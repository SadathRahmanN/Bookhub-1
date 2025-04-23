// src/service/api.js
import axios from 'axios';

const API_BASE = 'https://bookhub-1-ni31.onrender.com/api';  // Use your deployed backend URL here

const api = axios.create({ baseURL: API_BASE });

// ========================= BOOKS API =========================
export const bookAPI = {
  list: (params) => api.get('/books/', { params }),  // Get the list of books (with optional query params)
  details: (id) => api.get(`/books/${id}/`),          // Get details of a single book by ID
  add: (data) => api.post('/books/add/', data),       // Add a new book
  edit: (id, data) => api.put(`/books/edit/${id}/`, data),  // Edit an existing book by ID
  remove: (id) => api.delete(`/books/delete/${id}/`),  // Delete a book by ID
};

// ========================= AUTH API =========================
export const authAPI = {
  // Handles both login and signup
  loginSignup: (data) => api.post('/auth/', data),         // User login/signup
  roleLogin: (data) => api.post('/auth/role-login/', data), // Login with role-specific redirect
  token: (data) => api.post('/token/', data),               // Get JWT token
  refresh: (data) => api.post('/token/refresh/', data),     // Refresh JWT token
};

// ========================= USERS API =========================
export const userAPI = {
  list: () => api.get('/users/'),                          // Get the list of all users
  get: (id) => api.get(`/users/${id}/`),                    // Get a specific user by ID
  update: (id, data) => api.put(`/users/update/${id}/`, data),  // Update user data by ID
  remove: (id) => api.delete(`/users/delete/${id}/`),      // Delete a user by ID
  pending: () => api.get('/users/pending/'),               // Get list of pending users (awaiting approval)
  approve: (id) => api.post(`/users/approve/${id}/`),      // Approve a pending user
};

// ========================= LIBRARIANS API =========================
export const librarianAPI = {
  pending: () => api.get('/librarians/pending/'),  // Get list of pending librarians
  approve: (id) => api.post(`/librarians/approve/${id}/`),  // Approve a pending librarian
};

// ========================= BORROW API =========================
export const borrowAPI = {
  borrow: (data) => api.post('/borrow/', data),      // Borrow a book
  return: (data) => api.post('/return/', data),      // Return a borrowed book
  myList: () => api.get('/borrowed/'),               // Get the list of books currently borrowed by the logged-in user
  allList: () => api.get('/borrowed/all/'),          // Get the list of all borrowed books (admin/librarian only)
};

export default api;
