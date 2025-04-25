import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';

const BookActions = ({ book, userRole }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/book-details', { state: { book } });
  };

  const handleBorrow = () => {
    alert(`You have borrowed: ${book.title}`);
  };

  const handleUpdate = () => {
    navigate('/edit-book', { state: { book } });
  };

  const handleDelete = async () => {
    try {
      await bookAPI.remove(book.id);
      window.location.reload(); // You can use state instead for a better experience
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete the book.');
    }
  };

  return (
    <div className="book-buttons">
      <button className="view-btn" onClick={handleView}>👁️ View</button>

      {userRole === 'Patron' && (
        <button className="borrow-btn" onClick={handleBorrow}>📚 Borrow</button>
      )}

      {(userRole === 'Admin' || userRole === 'Librarian') && (
        <>
          <button className="update-btn" onClick={handleUpdate}>✏️ Update</button>
          <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
        </>
      )}
    </div>
  );
};

export default BookActions;
