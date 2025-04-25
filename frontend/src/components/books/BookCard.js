import React from 'react';
import BookActions from './BookActions';

const BookCard = ({ book, userRole }) => {
  return (
    <div className="book-item">
      {book.book_image_url ? (
        <img src={book.book_image_url} alt={book.title} className="book-image" />
      ) : (
        <div className="no-image">No Image</div>
      )}
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>

      <BookActions book={book} userRole={userRole} />
    </div>
  );
};

export default BookCard;
