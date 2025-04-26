import React, { useState, useEffect } from 'react';
import './SearchBooks.css';
import { bookAPI, borrowAPI } from '../../services/api'; // Import both bookAPI and borrowAPI

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [borrowing, setBorrowing] = useState(false); // Optional: to show loading if needed

  useEffect(() => {
    // Fetch books on initial load
    const fetchBooks = async () => {
      try {
        const { data } = await bookAPI.list(); // Fetch all books
        setBooks(data.books || data);
        setFilteredBooks(data.books || data);
      } catch (error) {
        console.error('There was an error fetching the books!', error);
      }
    };

    fetchBooks();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredBooks(books);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredBooks(
        books.filter((book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  // Actual Borrow Function
  const handleBorrow = async (bookId) => {
    try {
      setBorrowing(true); // Optional
      await borrowAPI.borrow({ book: bookId });
      alert('Book borrowed successfully!');
      // Optionally refresh list or show borrowed status
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow the book. Please try again.');
    } finally {
      setBorrowing(false); // Optional
    }
  };

  return (
    <div className="search-books">
      <h2>🔍 Search Books</h2>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="books-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-item">
              {book.book_image_url ? (
                <img
                  src={book.book_image_url}
                  alt={book.title}
                  className="book-image"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              {/* Borrow Button under the book picture */}
              <button
                className="borrow-button"
                onClick={() => handleBorrow(book.id)}
                disabled={borrowing} // Disable if currently processing
              >
                {borrowing ? 'Borrowing...' : 'Borrow'}
              </button>

              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBooks;
