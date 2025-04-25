import React, { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import './BookForm.css';

const BookForm = () => {
  const { id } = useParams(); // Detect edit mode
  const navigate = useNavigate();

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
    if (id) {
      const fetchBook = async () => {
        try {
          const response = await bookAPI.get(id);
          const book = response.data;
          setTitle(book.title || '');
          setAuthor(book.author || '');
          setGenre(book.genre || '');
          setIsbn(book.isbn || '');
          setPublicationDate(book.publication_date || '');
          setImagePreview(book.book_image_url || '');
        } catch (error) {
          console.error('Error fetching book for editing:', error);
          alert('Failed to load book data for editing.');
        }
      };
      fetchBook();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!author.trim()) newErrors.author = 'Author is required.';
    if (!isbn.trim()) newErrors.isbn = 'ISBN is required.';
    if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
      newErrors.image = 'Only JPEG and PNG images are allowed.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setSuccessMessage('');
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
      if (id) {
        await bookAPI.edit(id, formData);
        setSuccessMessage('Book updated successfully!');
      } else {
        await bookAPI.add(formData);
        setSuccessMessage('Book added successfully!');
        resetForm();
      }

      setTimeout(() => navigate('/'), 1000); // Go back after success
    } catch (error) {
      console.error('Error submitting book:', error.response?.data || error.message);
      alert('Failed to submit book. Check console for details.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const formTitle = id ? '📘 Edit Book' : '📚 Add New Book';
  const submitButtonLabel = id ? 'Update Book' : 'Add Book';

  return (
    <div className="book-form-container">
      <h2>{formTitle}</h2>
      <form onSubmit={handleSubmit} className="book-form" encType="multipart/form-data">
        <div className="flex-row">
          <div className="form-field">
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          <div className="form-field">
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
          <button type="submit" className="submit-btn">{submitButtonLabel}</button>
          {!id && (
            <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
          )}
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default BookForm;
