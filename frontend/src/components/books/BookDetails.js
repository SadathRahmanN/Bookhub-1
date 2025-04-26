import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api'; // Centralized API import

const BookDetails = ({ loggedInUser }) => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To navigate after delete or update

  // Fetch the book details by ID
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await bookAPI.details(id); // <-- Added slash after id
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book details:', err); // Log the error
        setError('Failed to fetch book details.');
      }
    };
    fetchBookDetails();
  }, [id]);

  // Handle Delete Book
  const handleDelete = async () => {
    try {
      await bookAPI.delete(`${id}/`); // <-- Added slash after id
      navigate('/book-catalog'); // Navigate back to the book catalog after deletion
    } catch (err) {
      console.error('Error deleting book:', err); // Log the error
      setError('Failed to delete book.');
    }
  };

  // Handle Edit Book
  const handleEdit = () => {
    navigate(`/book-form/${id}`); // Redirect to the book form for editing
  };

  if (error) return <div>{error}</div>; // Show error first
  if (!book) return <div>Loading book details...</div>; // Show loading if book not ready

  return (
    <div className="book-details">
      <h2>{book.title}</h2>

      {/* Book Image */}
      {book.image ? (
        <img src={book.image} alt={book.title} />
      ) : (
        <div className="no-image">No Image Available</div>
      )}

      {/* Book Information */}
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Description:</strong> {book.description}</p>

      {/* Buttons */}
      <div className="book-actions">
        {loggedInUser && (loggedInUser.role === 'Admin' || loggedInUser.role === 'Librarian') && (
          <>
            <button onClick={handleEdit} className="edit-btn">Edit</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
