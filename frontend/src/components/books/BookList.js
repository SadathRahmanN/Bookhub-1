import React, { useState, useEffect } from 'react';
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
  const booksPerPage = 12; // Number of books to display per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/books/`, {
        params: {
          page: currentPage, // Add page query parameter for pagination
          per_page: booksPerPage, // Number of books per page
        },
      });
      if (Array.isArray(data.books)) {
        setBooks(data.books);
        setTotalBooks(data.total); // Assuming the response includes the total count of books
      } else {
        setError('Unexpected response format from server.');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('There was an error fetching the books.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a book
  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`${API_BASE}/books/delete/${bookId}/`);
      // Refresh the list
      fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Error deleting book.');
    }
  };

  // Handle editing a book
  const handleEdit = (book) => {
    navigate('/book-form', { state: { bookToEdit: book } });
  };

  // Handle borrowing a book
  const handleBorrowBook = (book) => {
    navigate('/borrow-book', { state: { bookToBorrow: book } });
  };

  // Handle viewing a book's details
  const handleViewBook = (book) => {
    navigate('/book-details', { state: { book } });
  };

  // Handle page change
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
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(book)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(book.id)}
                >
                  🗑️ Delete
                </button>
                <button
                  className="view-btn"
                  onClick={() => handleViewBook(book)}
                >
                  👁️ View
                </button>
                <button
                  className="borrow-btn"
                  onClick={() => handleBorrowBook(book)}
                >
                  📖 Borrow
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No books available.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
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
