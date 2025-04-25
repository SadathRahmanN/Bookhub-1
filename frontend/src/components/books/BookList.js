import React, { useEffect, useState, useCallback } from 'react';
import { bookAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import BookActions from './BookActions';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('user_role');

  const fetchBooks = useCallback(async () => {
    try {
      const response =
        userRole === 'admin'
          ? await bookAPI.list()
          : await bookAPI.list({ limit: 12 });

      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const searchBooks = useCallback(async () => {
    try {
      if (!searchTerm.trim()) {
        fetchBooks();
        return;
      }
      const response = await bookAPI.searchBooks(searchTerm);
      setBooks(response.data);
    } catch (err) {
      setError('Failed to search books.');
    }
  }, [searchTerm, fetchBooks]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchBooks();
    }, 400); // Debounce search

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchBooks]);

  const handleAddBook = () => {
    navigate('/book-form');
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>Books Available</h2>
        <input
          type="text"
          placeholder="Search by title, author or ISBN..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {userRole === 'admin' && (
          <button onClick={handleAddBook}>Add New Book</button>
        )}
      </div>

      {books.length === 0 ? (
        <div>No books found.</div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="book-actions">
                <button onClick={() => navigate(`/book/${book.id}`)}>
                  View
                </button>
                <BookActions
                  book={book}
                  userRole={userRole}
                  refreshBooks={fetchBooks}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
