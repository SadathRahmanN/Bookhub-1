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
  list: (params) => api.get('/books/', { params }),
  getBook: (id) => api.get(`/books/${id}/`),                   // GET list of books (with optional search/filter params)
  details: (id) => api.get(`/books/${id}/`),                            // GET details of a book by ID
  add: (formData) =>
    api.post('/books/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },              // POST a new book with image/file
    }),
  edit: (id, formData) =>
    api.put(`/books/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },              // PUT to update a book
    }),
  remove: (id) => api.delete(`/books/${id}/`),                  // DELETE a book by ID
};

// ========================= AUTH API =========================
export const authAPI = {
  loginSignup: (data) => api.post('/auth/', data),                     // POST for login/signup
  roleLogin: (data) => api.post('/auth/role-login/', data),           // POST for role-based login
  token: (data) => api.post('/token/', data),                          // POST to get JWT token
  refresh: (data) => api.post('/token/refresh/', data),               // POST to refresh token
};

// ========================= USERS API =========================
export const userAPI = {
  list: () => api.get('/users/'),                                      // GET list of users
  get: (id) => api.get(`/users/${id}/`),                               // GET user by ID
  create: (data) => api.post('/users/', data),                         // POST create user
  update: (id, data) => api.put(`/users/${id}/`, data),                // PUT update user
  remove: (id) => api.delete(`/users/${id}/`),                         // DELETE user
  pending: () => api.get('/users/pending/'),                          // GET pending users
  approve: (id) => api.post(`/users/approve/${id}/`),                 // POST approve user
};

// ========================= LIBRARIANS API =========================
export const librarianAPI = {
  pending: () => api.get('/librarians/pending/'),                     // GET pending librarians
  approve: (id) => api.post(`/librarians/approve/${id}/`),           // POST approve librarian
};

// ========================= BORROW API =========================
export const borrowAPI = {
  borrow: (data) => api.post('/borrow/', data),                       // POST borrow a book
  return: (data) => api.post('/return/', data),                       // POST return a book
  myList: () => api.get('/borrowed/'),                                // GET books borrowed by current user
  allList: () => api.get('/borrowed/all/'),                           // GET all borrowed books (admin only)
};

export default api;
