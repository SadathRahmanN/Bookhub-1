import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './BookList.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 12;
  const navigate = useNavigate();

  // Fetch books from the API
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/books/`, {
        params: {
          page: currentPage,
          per_page: booksPerPage,
        },
      });
      if (Array.isArray(data.books)) {
        setBooks(data.books);
        setTotalBooks(data.total);
      } else {
        setError('Unexpected response format from server.');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('There was an error fetching the books.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`${API_BASE}/books/delete/${bookId}/`);
      fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Error deleting book.');
    }
  };

  const handleEdit = (book) => {
    navigate('/book-form', { state: { bookToEdit: book } });
  };

  const handleBorrowBook = (book) => {
    navigate('/borrow-book', { state: { bookToBorrow: book } });
  };

  const handleViewBook = (book) => {
    navigate('/book-details', { state: { book } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  return (
    <div className="book-list">
      <h2>📚 Books Available</h2>

      {loading && <p>Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-container">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="book-item" key={book.id}>
              {book.book_image_url ? (
                <img
                  src={book.book_image_url}
                  alt={book.title}
                  className="book-image"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category || 'N/A'}</p>
              <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>

              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
                <button className="view-btn" onClick={() => handleViewBook(book)}>👁️ View</button>
                <button className="borrow-btn" onClick={() => handleBorrowBook(book)}>📖 Borrow</button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No books available.</p>
        )}
      </div>

      <div className="pagination">
        <span>Page {currentPage} of {totalPages}</span>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        )}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default BookList;
