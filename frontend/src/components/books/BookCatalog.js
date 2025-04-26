import React, { useState, useEffect, useCallback } from 'react';
import { bookAPI } from '../../services/api';
import './BookCatalog.css';
import { Link, useNavigate } from 'react-router-dom';

const BookCatalog = ({ loggedInUser }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(null);  // New state for delete confirmation
  const navigate = useNavigate();

  // Determine role: prefer prop, fallback to localStorage
  const rawRole = loggedInUser?.role || localStorage.getItem('user_role');
  const userRole = rawRole?.toString().toLowerCase() || '';
  const canManage = ['admin', 'librarian'].includes(userRole);

  // Fetch all books
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookAPI.list();
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered list
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookAPI.remove(id);
      fetchBooks();
      setDeleteSuccess('Book deleted successfully!');  // Show success message
    } catch (err) {
      console.error(err);
      setError('Failed to delete book.');
    }
  };

  // Edit navigation
  const handleEdit = (id) => {
    navigate(`/book-form/${id}`);
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {canManage && (
        <Link to="/book-form" className="add-book-btn">
          + Add Book
        </Link>
      )}

      {/* Show delete success message */}
      {deleteSuccess && <div className="success-message">{deleteSuccess}</div>}

      <div className="book-grid">
        {filteredBooks.length === 0 ? (
          <div>No books found matching your search criteria.</div>  // Message when no books match
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="book-actions">
                <Link to={`/book-details/${book.id}`} className="view-btn">
                  View
                </Link>
                {canManage && (
                  <>
                    <button
                      onClick={() => handleEdit(book.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
