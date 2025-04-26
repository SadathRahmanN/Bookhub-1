import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI, borrowAPI } from '../../services/api'; // Adjust paths if needed
import './PatronBookCatalog.css'; // We'll add some CSS

const PatronBookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookAPI.getAll(); // Assuming your API method
        if (response.status === 200) {
          setBooks(response.data);
        } else {
          throw new Error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setErrorMessage('Could not load books.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleView = (bookId) => {
    navigate(`/book/${bookId}`); // You should have a BookView page linked
  };

  const handleBorrow = async (bookId) => {
    try {
      const response = await borrowAPI.requestBorrow(bookId); // Adjust according to your API
      if (response.status === 200 || response.status === 201) {
        alert('Borrow request sent successfully!');
      } else {
        throw new Error('Failed to request borrow');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Could not borrow the book.');
    }
  };

  if (isLoading) {
    return <p>Loading books...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  return (
    <div className="book-catalog">
      <h2>All Books</h2>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image || '/default-book.png'} alt={book.title} className="book-image" />
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <div className="book-actions">
              <button onClick={() => handleView(book.id)} className="view-btn">View</button>
              <button onClick={() => handleBorrow(book.id)} className="borrow-btn">Borrow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatronBookCatalog;
