import React, { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('user_role'); // Assuming you store role in localStorage

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = userRole === 'admin' 
          ? await bookAPI.list() // Fetch all books for admin
          : await bookAPI.list({ limit: 12 }); // Fetch latest 12 books for others

        setBooks(response.data); // Set books in state
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        setError('Failed to fetch books.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userRole]);

  const handleView = (bookId) => {
    navigate(`/books/${bookId}`); // Navigate to book details page
  };

  const handleBorrow = (bookId) => {
    // Add borrow logic here (e.g., API call to borrow the book)
    alert(`Borrowing book with ID: ${bookId}`);
  };

  const handleEdit = (bookId) => {
    navigate(`/books/edit/${bookId}`); // Navigate to edit page
  };

  const handleDelete = (bookId) => {
    // Add delete logic here (e.g., API call to delete the book)
    alert(`Deleting book with ID: ${bookId}`);
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-list">
      <h2>Books Available</h2>
      {books.length === 0 ? (
        <div>No books available.</div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="book-actions">
                <button onClick={() => handleView(book.id)}>View</button>
                {userRole === 'patron' && (
                  <button onClick={() => handleBorrow(book.id)}>Borrow</button>
                )}
                {(userRole === 'librarian' || userRole === 'admin') && (
                  <>
                    <button onClick={() => handleEdit(book.id)}>Edit</button>
                    <button onClick={() => handleDelete(book.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
