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
          userRole === 'Admin' ? {} : { page_size: 12 }
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

  return (
    <div className="book-list">
      <h2>📚 {userRole === 'Admin' ? 'All Books' : 'Latest Books'}</h2>

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
              <button className="view-btn" onClick={() => handleViewBook(book)}>
                👁️ View
              </button>
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
