import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import './BookForm.css';

const BookForm = ({ bookToEdit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || '');
      setAuthor(bookToEdit.author || '');
      setGenre(bookToEdit.genre || '');
      setIsbn(bookToEdit.isbn || '');
      setPublicationDate(bookToEdit.publication_date || '');
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

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required.';
    if (!author) newErrors.author = 'Author is required.';
    if (!isbn) newErrors.isbn = 'ISBN is required.';
    if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
      newErrors.image = 'Only JPEG and PNG images are allowed.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', genre);
    formData.append('isbn', isbn);
    formData.append('publication_date', publicationDate);
    if (image) formData.append('book_image', image);

    try {
      if (bookToEdit) {
        await bookAPI.edit(bookToEdit.id, formData);
      } else {
        await bookAPI.add(formData);
      }

      setSuccessMessage('Book added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error submitting book:', error.response?.data || error.message);
      alert('Failed to submit book. Check console for details.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setIsbn('');
    setPublicationDate('');
    setImage(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="book-form-container">
      <h2>{bookToEdit ? '📘 Edit Book' : '📚 Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="book-form" encType="multipart/form-data">
        {/* Title & Author side-by-side */}
        <div className="flex-row">
          <div className="form-field">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          <div className="form-field">
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
        </div>

        <div className="form-field">
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <div className="form-field">
          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
          {errors.isbn && <span className="error-message">{errors.isbn}</span>}
        </div>

        <div className="form-field">
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="image">Upload Book Image:</label>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={handleImageChange}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="book-image-preview" />
          )}
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {bookToEdit ? 'Update Book' : 'Add Book'}
          </button>
          <button type="button" className="reset-btn" onClick={resetForm}>
            Reset
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default BookForm;
