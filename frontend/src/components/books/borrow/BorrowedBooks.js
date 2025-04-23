import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BorrowedBooks.css';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/library/api/my-borrowed-books/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBorrowedBooks(response.data);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, [token]);

  return (
    <div className="borrowed-books-container">
      <h2 className="borrowed-books-title">📚 My Borrowed Books</h2>
      {borrowedBooks.length > 0 ? (
        <div className="borrowed-book-list">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="borrowed-book-card">
              <div className="borrowed-book-title">{book.title}</div>
              <div className="borrowed-book-details">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Due Date:</strong> {book.due_date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-books-message">No borrowed books found.</p>
      )}
    </div>
  );
};

export default BorrowedBooks;
