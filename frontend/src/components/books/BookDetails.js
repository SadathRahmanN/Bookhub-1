import React from 'react';
import { useLocation } from 'react-router-dom';
import './BookDetails.css';

const BookDetails = () => {
  const { state } = useLocation();
  const { book } = state || {};

  if (!book) {
    return <p>Book data not found.</p>;
  }

  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      {book.book_image_url ? (
        <img src={book.book_image_url} alt={book.title} />
      ) : (
        <div className="no-image">No Image</div>
      )}
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
      <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
      <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
      <p><strong>Available Copies:</strong> {book.available_copies ?? 'N/A'}</p>
    </div>
  );
};

export default BookDetails;
