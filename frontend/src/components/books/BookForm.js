// src/components/books/BookForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api'; // ✅ Correct import path
import './BookForm.css';

const BookForm = ({ bookToEdit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setGenre(bookToEdit.genre || '');
      setIsbn(bookToEdit.isbn || '');
      setImagePreview(bookToEdit.book_image_url || '');
    }
  }, [bookToEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('isbn', isbn);
    if (image) formData.append('image', image);

    try {
      if (bookToEdit) {
        await bookAPI.edit(bookToEdit.id, formData);
      } else {
        await bookAPI.add(formData);
      }

      setTitle('');
      setAuthor('');
      setGenre('');
      setIsbn('');
      setImage(null);
      setImagePreview(null);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  };

  return (
    <div className="book-form-container">
      <h2>{bookToEdit ? '📘 Edit Book' : '📚 Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <label htmlFor="image">Upload Book Image:</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="book-image-preview"
          />
        )}

        <button type="submit">{bookToEdit ? 'Update Book' : 'Add Book'}</button>
      </form>
    </div>
  );
};

export default BookForm;
