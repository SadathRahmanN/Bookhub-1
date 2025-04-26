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
        const response = await bookAPI.get(id); // Assuming this fetches book details
        setBook(response.data);
      } catch (err) {
        setError('Failed to fetch book details.');
      }
    };
    fetchBookDetails();
  }, [id]);

  // Handle Delete Book
  const handleDelete = async () => {
    try {
      await bookAPI.delete(id); // Assuming this is the delete API for books
      navigate('/book-catalog'); // Navigate back to the book catalog after deletion
    } catch (err) {
      setError('Failed to delete book.');
    }
  };

  // Handle Edit Book
  const handleEdit = () => {
    navigate(`/book-form/${id}`); // Redirect to the book form for editing
  };

  if (!book) return <div>Loading book details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      <img src={book.image} alt={book.title} />
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
