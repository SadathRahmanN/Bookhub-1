import React, { useEffect, useState, useCallback } from 'react';
import { bookAPI } from '../../services/api';
import './BookList.css'; // Ensure the CSS import is here

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await bookAPI.list({ limit: 12 });
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (loading) return <div>Loading latest books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-list">
      <h2>Latest Books</h2>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
