import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import QuoteSection from './components/QuoteSection';
import LoginForm from './components/LoginForm';
import AdminForm from './components/AdminForm';
import SignUpForm from './components/SignUpForm';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ClientDashboard from './components/dashboards/ClientDashboard';
import PatronDashboard from './components/dashboards/PatronDashboard';
import LibrarianDashboard from './components/dashboards/LibrarianDashboard';
import ApproveLibrarian from './components/dashboards/ApproveLibrarian';
import ApproveClientPatron from './components/dashboards/ApproveClientPatron';
import BorrowBook from './components/borrow/BorrowBook';
import BorrowHistory from './components/borrow/BorrowHistory';
import BorrowedBooks from './components/borrow/BorrowedBooks';
import ReturnRequests from './components/requests/ReturnRequests';
import ExtensionRequests from './components/requests/ExtensionRequests';
import BookForm from './components/books/BookForm';
import BookList from './components/books/BookList';
import UserForm from './components/users/UserForm';
import UserList from './components/users/UserList';
import IssuedBooks from './components/shared/IssuedBooks';
import SearchBooks from './components/books/SearchBooks';
import UpdateProfile from './components/users/UpdateProfile';
import './App.css';

const AboutUs = () => (
  <div className="about-us">
    <h2>About Us</h2>
    <p>
      Welcome to BookHub. We are an online platform that connects book lovers from around the world.
      Our mission is to foster a community where readers can share, explore, and discover new books.
    </p>
  </div>
);

const ContactUs = () => (
  <div className="contact-us">
    <h2>Contact Us</h2>
    <p>
      We would love to hear from you! If you have any questions or need support, feel free to reach out
      to us via the following methods:
    </p>
    <div className="contact-details">
      <p>Email: <a href="mailto:support@bookhub.com">support@bookhub.com</a></p>
      <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
      <p>Address: 123 BookHub Lane, Library City, Bookworld</p>
    </div>
    <p>We aim to respond to all inquiries within 24 hours. Thank you for being part of our community!</p>
  </div>
);

function App() {
  const [formType, setFormType] = useState('home');
  const [users, setUsers] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [borrowList, setBorrowList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  useEffect(() => {
    fetch('/api/books/')
      .then((res) => res.json())
      .catch((err) => console.error('Book fetch error:', err));
  }, []);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleDeleteUser = (username) => {
    setUsers(users.filter(user => user.username !== username));
  };

  const handleBorrowBook = (borrowEntry) => {
    setBorrowList([...borrowList, borrowEntry]);
  };

  const renderForm = () => {
    switch (formType) {
      case 'login':
        return <LoginForm onLogin={handleLogin} />;
      case 'admin':
        return <AdminForm />;
      case 'signup':
        return <SignUpForm />;
      case 'home':
      default:
        return <LoginForm onLogin={handleLogin} />;
    }
  };

  const RedirectDashboard = () => {
    if (!loggedInUser) return <Navigate to="/" />;
    switch (loggedInUser.role) {
      case 'Admin':
        return <Navigate to="/admin-dashboard" />;
      case 'Client':
        return <Navigate to="/client-dashboard" />;
      case 'Patron':
        return <Navigate to="/patron-dashboard" />;
      case 'Librarian':
        return <Navigate to="/librarian-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar setFormType={setFormType} />

        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <div id="home" className="main-content">
                  <div className="left-center">
                    <QuoteSection />
                  </div>
                  <div className="right-center">{renderForm()}</div>
                </div>
                <div id="books" className="section"><BookList /></div>
                <div id="about" className="section"><AboutUs /></div>
                <div id="contact" className="section"><ContactUs /></div>
              </>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/admin" element={<AdminForm />} />

          {/* Redirect to dashboard after login */}
          <Route path="/redirect" element={<RedirectDashboard />} />

          {/* Dashboards */}
          <Route path="/admin-dashboard" element={<AdminDashboard setUserToEdit={setUserToEdit} setBookToEdit={setBookToEdit} />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/patron-dashboard" element={<PatronDashboard />} />
          <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />

          {/* User Management */}
          <Route path="/user-form" element={<UserForm userToEdit={userToEdit} onSubmit={handleAddUser} />} />
          <Route path="/user-list" element={<UserList users={users} onDelete={handleDeleteUser} setUserToEdit={setUserToEdit} />} />

          {/* Book Management */}
          <Route path="/book-form" element={<BookForm bookToEdit={bookToEdit} />} />
          <Route path="/book-list" element={<BookList />} />

          {/* Borrowing & History */}
          <Route path="/borrow-book" element={<BorrowBook onBorrow={handleBorrowBook} />} />
          <Route path="/borrow-history" element={<BorrowHistory borrowList={borrowList} />} />

          {/* Approval and Requests */}
          <Route path="/approve-librarian" element={<ApproveLibrarian />} />
          <Route path="/approve-client-patron" element={<ApproveClientPatron />} />
          <Route path="/borrowed-books" element={<BorrowedBooks loggedInUser={loggedInUser} />} />
          <Route path="/return-requests" element={<ReturnRequests />} />
          <Route path="/extension-requests" element={<ExtensionRequests />} />

          {/* Shared */}
          <Route path="/issued-books" element={<IssuedBooks />} />
          <Route path="/search-books" element={<SearchBooks />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </div>