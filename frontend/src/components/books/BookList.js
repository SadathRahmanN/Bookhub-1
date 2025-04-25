import React, { useState, useEffect } from 'react';
import './BookList.css';
import { bookAPI } from '../../services/api';
import BookCard from './BookCard';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="book-list">
      <h2>📚 {userRole === 'Admin' || userRole === 'Librarian' ? 'All Books' : 'Latest Books'}</h2>

      {loading && <p>Loading books...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-container">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.id} book={book} userRole={userRole} />
          ))
        ) : (
          !loading && <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
