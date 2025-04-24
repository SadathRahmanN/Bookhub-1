import React, { useState, useEffect } from 'react';
import './BookList.css';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api'; // Importing bookAPI

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user role from localStorage or default to 'Patron'
  const userRole = localStorage.getItem('userRole') || 'Patron';

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const { data } = await bookAPI.list(
          userRole === 'Admin' || userRole === 'Librarian' ? {} : { page_size: 12 }
        );

        if (Array.isArray(data.books)) {
          setBooks(data.books);
        } else if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [userRole]);

  const handleViewBook = (book) => {
    navigate('/book-details', { state: { book } });
  };

  const handleBorrowBook = (book) => {
    // Logic to borrow the book, for example, marking it as borrowed for the user.
    alert(`You have borrowed: ${book.title}`);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await bookAPI.remove(bookId);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete the book.');
    }
  };

  const handleUpdateBook = (book) => {
    navigate('/edit-book', { state: { book } });
  };

  return (
    <div className="book-list">
      <h2>📚 {userRole === 'Admin' || userRole === 'Librarian' ? 'All Books' : 'Latest Books'}</h2>

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

              {/* View Button for All Users */}
              <button className="view-btn" onClick={() => handleViewBook(book)}>
                👁️ View
              </button>

              {/* Borrow Button for Patron Users */}
              {userRole === 'Patron' && (
                <button className="borrow-btn" onClick={() => handleBorrowBook(book)}>
                  📚 Borrow
                </button>
              )}

              {/* Delete and Update Buttons for Admin and Librarian */}
              {(userRole === 'Admin' || userRole === 'Librarian') && (
                <>
                  <button className="update-btn" onClick={() => handleUpdateBook(book)}>
                    ✏️ Update
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>
                    🗑️ Delete
                  </button>
                </>
              )}
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
