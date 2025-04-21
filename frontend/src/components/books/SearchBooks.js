// src/components/books/SearchBooks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBooks.css';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Fetch books on initial load
    axios.get('http://127.0.0.1:8000/library/api/books/')
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  // Handle search query change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter books based on search query
    if (query === '') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter((book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
        )
      );
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
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className="book-image" />
              ) : (
                <div className="no-image">No Image</div>
              )}
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
