import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookAPI } from '../../services/api';  // Ensure correct import for the API
import './BookDetails.css';

const BookDetails = () => {
  const { bookId } = useParams();  // Get bookId from URL params
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setError('Invalid book ID.');
      setLoading(false);
      return;
    }

    console.log("Fetching details for bookId:", bookId);  // Debug log to check the bookId

    const fetchBookDetails = async () => {
      try {
        // Make sure you're using the correct endpoint for fetching book details
        const response = await bookAPI.get(`/books/${bookId}/`);  // Updated endpoint for fetching book details
        console.log("API Response:", response);  // Debug log to check the response
        setBook(response.data);  // Set the book data from the response
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);  // Trigger the effect when the bookId changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
