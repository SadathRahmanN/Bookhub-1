import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';

const BookActions = ({ book, userRole }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/books/${book.id}`, { state: { book } }); // Navigate to details page
  };

  const handleBorrow = async () => {
    try {
      // Call the API to borrow a book (you need an endpoint for this)
      await bookAPI.borrow(book.id);
      alert(`You have borrowed: ${book.title}`);
    } catch (err) {
      console.error('Error borrowing book:', err);
      alert('Failed to borrow the book.');
    }
  };

  const handleUpdate = () => {
    navigate(`/books/edit/${book.id}`, { state: { book } }); // Navigate to edit page
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      try {
        await bookAPI.remove(book.id);
        alert('Book deleted successfully!');
        window.location.reload(); // Or use state to refresh the list
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete the book.');
      }
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
