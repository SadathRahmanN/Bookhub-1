import React, { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api'; // Adjust the import path if necessary
import BookActions from './BookActions';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem('user_role'); // Assuming you store role in localStorage

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = userRole === 'admin'
          ? await bookAPI.list() // Fetch all books for admin
          : await bookAPI.list({ limit: 12 }); // Fetch latest 12 books for others

        setBooks(response.data); // Set books in state
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        setError('Failed to fetch books.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userRole]); // Re-run the effect when userRole changes

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-list">
      <h2>Books Available</h2>
      {books.length === 0 ? (
        <div>No books available.</div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <BookActions book={book} userRole={userRole} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
