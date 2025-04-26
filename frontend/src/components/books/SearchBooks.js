import React, { useState, useEffect } from 'react';
import './SearchBooks.css';
import { bookAPI, borrowAPI } from '../../services/api';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [borrowingBookId, setBorrowingBookId] = useState(null); // Track which book is being borrowed

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await bookAPI.list();
        const booksData = data.books || data;
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error('There was an error fetching the books!', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredBooks(books);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      setBorrowingBookId(bookId); // Set the book that's being borrowed
      await borrowAPI.borrow({ book: bookId });
      alert('Book borrowed successfully!');
      // Optional: update book list or mark book as borrowed
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow the book. Please try again.');
    } finally {
      setBorrowingBookId(null); // Reset borrowing state
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

              <button
                className="borrow-button"
                onClick={() => handleBorrow(book.id)}
                disabled={borrowingBookId === book.id}
              >
                {borrowingBookId === book.id ? 'Borrowing...' : 'Borrow'}
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
