import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from the API
  const fetchBooks = () => {
    axios.get('http://127.0.0.1:8000/library/api/books/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          setError("The response from the server is not in the expected format.");
        }
        setLoading(false);
      })
      .catch(error => {
        setError("There was an error fetching the books!");
        setLoading(false);
        console.error(error);
      });
  };

  // Handle deleting a book
  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios.delete(`http://127.0.0.1:8000/library/api/books/${bookId}/`)
        .then(() => {
          fetchBooks(); // Refresh the book list after deletion
        })
        .catch(error => {
          setError("Error deleting book.");
          console.error("Error deleting book:", error);
        });
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

  // Handle viewing a book
  const handleViewBook = (book) => {
    navigate('/book-details', { state: { book } });
  };

  // Render the component
  return (
    <div className="book-list">
      <h2>📚 Books Available</h2>

      {/* Show loading message or error if applicable */}
      {loading && <p>Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-container">
        {books.length > 0 ? (
          books.map(book => (
            <div className="book-item" key={book.id}>
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className="book-image" />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>

              <div className="book-actions">
                {/* Edit Book button */}
                <button className="edit-btn" onClick={() => handleEdit(book)}>✏️ Edit</button>

                {/* Delete Book button */}
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>🗑️ Delete</button>

                {/* View Book details button */}
                <button className="view-btn" onClick={() => handleViewBook(book)}>👁️ View</button>

                {/* Borrow Book button */}
                <button className="borrow-btn" onClick={() => handleBorrowBook(book)}>📖 Borrow</button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
