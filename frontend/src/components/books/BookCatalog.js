import React, { useState, useEffect, useCallback } from 'react';
import { bookAPI } from '../../services/api'; // Centralized API import
import './BookCatalog.css';
import { Link, useNavigate } from 'react-router-dom'; // For navigation

const BookCatalog = ({ loggedInUser }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // For navigation to book edit page

  // Fetch all books from the API
  const fetchBooks = useCallback(async () => {
    try {
      const response = await bookAPI.list(); // Get all books
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Delete Book
  const handleDelete = async (id) => {
    try {
      await bookAPI.delete(id); // Assuming this is the delete API for books
      fetchBooks(); // Refresh the books list
    } catch (err) {
      setError('Failed to delete book.');
    }
  };

  // Handle Edit Book
  const handleEdit = (id) => {
    navigate(`/book-form/${id}`); // Redirect to edit page
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Safeguard if loggedInUser is null
  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Add Book Button (Only for Admin and Librarian) */}
      {loggedInUser && (loggedInUser.role === 'Admin' || loggedInUser.role === 'Librarian') && (
        <Link to="/book-form" className="add-book-btn">Add Book</Link>
      )}

      {/* Book List */}
      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>

            {/* Buttons */}
            <div className="book-actions">
              <Link to={`/book-details/${book.id}`} className="view-btn">View</Link>

              {/* Edit and Delete Buttons (Only for Admin and Librarian) */}
              {loggedInUser && (loggedInUser.role === 'Admin' || loggedInUser.role === 'Librarian') && (
                <>
                  <button onClick={() => handleEdit(book.id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(book.id)} className="delete-btn">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCatalog;
