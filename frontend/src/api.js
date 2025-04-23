import axiosInstance from './axiosInstance';

// Book Management API
export const fetchBooks = async (page = 1, booksPerPage = 12) => {
  try {
    const { data } = await axiosInstance.get(`/api/books/`, {
      params: { page, per_page: booksPerPage },
    });
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const createBook = async (bookData, token) => {
  try {
    const response = await axiosInstance.post(
      `/api/books/`,
      bookData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (bookId, updatedData, token) => {
  try {
    const response = await axiosInstance.put(
      `/api/books/${bookId}/`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookId, token) => {
  try {
    await axiosInstance.delete(
      `/api/books/${bookId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { message: "Book deleted successfully" };
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// User Authentication API Calls
export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(`/api/signup/`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(`/api/login/`, credentials);
    return response.data; // returns { access_token, refresh_token }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Admin Actions
export const approveLibrarian = async (userId, token) => {
  try {
    const response = await axiosInstance.post(
      `/api/approve-librarian/${userId}/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving librarian:", error);
    throw error;
  }
};
