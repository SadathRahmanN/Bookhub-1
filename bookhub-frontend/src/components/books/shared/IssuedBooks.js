// src/components/shared/IssuedBooks.js

import React, { useEffect, useState } from 'react';
import '../../dashboards/Dashboard.css';

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/issued-books/')
      .then(res => res.json())
      .then(data => setIssuedBooks(data))
      .catch(err => console.error('Error fetching issued books:', err));
  }, []);

  return (
    <div className="approve-librarian-container">
      <h2>Issued Books</h2>
      {issuedBooks.length === 0 ? (
        <p>No books are currently issued.</p>
      ) : (
        <ul className="pending-list">
          {issuedBooks.map(book => (
            <li key={book.id}>
              <span>
                User: {book.user} — Book: "{book.title}" — Issued on: {book.issued_date}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssuedBooks;
