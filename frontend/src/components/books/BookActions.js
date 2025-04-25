import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';

const BookActions = ({ book, userRole, refreshBooks }) => {
  const navigate = useNavigate();

  const handleBorrow = () => {
    alert(`Borrowing ${book.title}`);
  };

  const handleEdit = () => {
    navigate(`/edit-book/${book.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookAPI.delete(book.id);
        refreshBooks(); // Refresh book list after deletion
      } catch (err) {
        alert('Failed to delete book.');
      }
    }
  };

  return (
    <div className="book-actions">
      <button onClick={() => navigate(`/view-book/${book.id}`)}>View</button>
      {userRole === 'Patron' && (
        <button onClick={handleBorrow}>Borrow</button>
      )}
      {(userRole === 'Admin' || userRole === 'Librarian') && (
        <>
          <button onClick={handleEdit}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default BookActions;
