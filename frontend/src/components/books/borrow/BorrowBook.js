import React, { useState } from 'react';
import './BorrowBook.css';

const BorrowBook = () => {
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [borrowId, setBorrowId] = useState(null);

  const token = localStorage.getItem('token');

  const handleFetchBorrow = async () => {
    if (!bookId || !userId) {
      setMessage('⚠️ Please enter both Book ID and User ID.');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/library/api/borrowed-books/?book_id=${bookId}&user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.length > 0) {
        setBorrowId(data[0].id);
        setMessage(`ℹ️ Borrow record already exists (ID: ${data[0].id})`);
      } else {
        setBorrowId(null);
        setMessage('✅ Book is available to lend to this user.');
      }
    } catch (error) {
      console.error('Error checking borrow status:', error);
      setMessage('❌ Error checking borrow status.');
    }
  };

  const handleLendBook = async (e) => {
    e.preventDefault();

    if (!bookId.trim() || !userId.trim()) {
      setMessage('⚠️ Please provide both Book ID and User ID.');
      return;
    }

    const payload = {
      book: bookId,
      user: userId,
      date: new Date().toISOString(),
    };

    const url = borrowId
      ? `http://127.0.0.1:8000/library/api/borrowed-books/${borrowId}/`
      : `http://127.0.0.1:8000/library/api/borrowed-books/`;
    const method = borrowId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save borrow record');

      setMessage(borrowId ? '🔄 Borrow record updated.' : '✅ Book lent to user.');
      setBookId('');
      setUserId('');
      setBorrowId(null);
    } catch (error) {
      console.error('Error lending book:', error);
      setMessage('❌ Error lending book.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="borrow-form-container">
        <h2>📘 Lend Book to User</h2>
        {message && <p className="borrow-message">{message}</p>}
        <form onSubmit={handleLendBook} className="borrow-form">
          <input
            type="text"
            placeholder="📚 Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="👤 User ID"
            value={userId}  
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="button" className="secondary-btn" onClick={handleFetchBorrow}>
              🔍 Check Borrow Status
            </button>
            <button type="submit">{borrowId ? 'Update Lending' : 'Lend Book'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowBook;
