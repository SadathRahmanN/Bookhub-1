import axios from 'axios';

const API_BASE = 'https://bookhub-1-ni31.onrender.com/api'; // Deployed backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================= BOOKS API =========================
export const bookAPI = {
  // GET list of books (with optional search/filter params)
  list: (params) => api.get('/books/', { params }),

  // GET book details by ID
  getBook: (id) => api.get(`/books/${id}/`),

  // POST a new book with image/file
  add: (formData) =>
    api.post('/books/add/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // PUT to update a book
  edit: (id, formData) =>
    api.put(`/books/edit/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // DELETE a book by ID
  remove: (id) => api.delete(`/books/delete/${id}/`),
};

// ========================= AUTH API =========================
export const authAPI = {
  // POST for login/signup
  loginSignup: (data) => api.post('/auth/', data),

  // POST for role-based login
  roleLogin: (data) => api.post('/auth/role-login/', data),

  // POST to get JWT token
  token: (data) => api.post('/token/', data),

  // POST to refresh token
  refresh: (data) => api.post('/token/refresh/', data),
};

// ========================= USERS API =========================
export const userAPI = {
  // GET list of users
  list: () => api.get('/users/'),

  // GET user by ID
  get: (id) => api.get(`/users/${id}/`),

  // POST create user
  create: (data) => api.post('/users/create/', data),

  // PUT update user
  update: (id, data) => api.put(`/users/update/${id}/`, data),

  // DELETE user
  remove: (id) => api.delete(`/users/delete/${id}/`),

  // GET pending users
  pending: () => api.get('/users/pending/'),

  // POST approve user
  approve: (id) => api.post(`/users/approve/${id}/`),
};

// ========================= LIBRARIANS API =========================
export const librarianAPI = {
  // GET pending librarians
  pending: () => api.get('/librarians/pending/'),

  // POST approve librarian
  approve: (id) => api.post(`/librarians/approve/${id}/`),
};

// ========================= BORROW API =========================
export const borrowAPI = {
  // POST borrow a book
  borrow: (data) => api.post('/borrow/', data),

  // POST return a book
  return: (data) => api.post('/return/', data),

  // GET books borrowed by current user
  myList: () => api.get('/borrowed/'),

  // GET all borrowed books (admin only)
  allList: () => api.get('/borrowed/all/'),
};

export default api;
