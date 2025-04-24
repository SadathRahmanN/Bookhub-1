import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ROUTES from './routes/routes';
import Navbar from './components/common/Navbar';
import QuoteSection from './components/common/QuoteSection';
import LoginForm from './components/common/LoginForm';
import SignUpForm from './components/common/SignUpForm';
import AdminDashboard from './components/dashboards/admin/AdminDashboard';
import PatronDashboard from './components/dashboards/patron/PatronDashboard';
import LibrarianDashboard from './components/dashboards/librarian/LibrarianDashboard';
import ApproveLibrarian from './components/dashboards/admin/ApproveLibrarian';
import ApproveClientPatron from './components/dashboards/librarian/ApproveClientPatron';
import BorrowBook from './components/books/borrow/BorrowBook';
import BorrowHistory from './components/books/borrow/BorrowHistory';
import BorrowedBooks from './components/books/borrow/BorrowedBooks';
import ReturnRequests from './components/requests/ReturnRequests';
import ExtensionRequests from './components/requests/ExtensionRequests';
import BookForm from './components/books/BookForm';
import BookList from './components/books/BookList';
import UserForm from './components/users/UserForm';
import UserList from './components/users/UserList';
import IssuedBooks from './components/books/shared/IssuedBooks';
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
    <p>Have questions or need support? Reach out via:</p>
    <div className="contact-details">
      <p>Email: <a href="mailto:support@bookhub.com">support@bookhub.com</a></p>
      <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
      <p>Address: 123 BookHub Lane, Library City, Bookworld</p>
    </div>
  </div>
);

function App() {
  const [formType, setFormType] = useState('home');
  const [users, setUsers] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [borrowList, setBorrowList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => setLoggedInUser(user);
  const handleAddUser = (newUser) => setUsers([...users, newUser]);
  const handleDeleteUser = (uname) => setUsers(users.filter(u => u.username !== uname));
  const handleBorrowBook = (entry) => setBorrowList([...borrowList, entry]);

  const renderForm = () => {
    if (formType === 'signup') return <SignUpForm />;
    return <LoginForm onLogin={handleLogin} />;
  };

  const RedirectDashboard = () => {
    if (!loggedInUser) return <Navigate to={ROUTES.HOME} />;
    switch (loggedInUser.role) {
      case 'Admin':     return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
      case 'Client':    return <Navigate to={ROUTES.CLIENT_DASHBOARD} />;
      case 'Patron':    return <Navigate to={ROUTES.PATRON_DASHBOARD} />;
      case 'Librarian': return <Navigate to={ROUTES.LIBRARIAN_DASHBOARD} />;
      default:          return <Navigate to={ROUTES.HOME} />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar setFormType={setFormType} />

        <Routes>
          <Route path={ROUTES.HOME} element={
            <>
              <div id="home" className="main-content">
                <div className="left-center"><QuoteSection /></div>
                <div className="right-center">{renderForm()}</div>
              </div>
              <div id="books" className="section"><BookList /></div>
              <div id="about" className="section"><AboutUs /></div>
              <div id="contact" className="section"><ContactUs /></div>
            </>
          }/>

          {/* Auth */}
          <Route path={ROUTES.LOGIN}   element={<LoginForm onLogin={handleLogin} />} />
          <Route path={ROUTES.SIGNUP}  element={<SignUpForm />} />
          <Route path={ROUTES.REDIRECT} element={<RedirectDashboard />} />

          {/* Dashboards */}
          <Route path={ROUTES.ADMIN_DASHBOARD}     element={<AdminDashboard setUserToEdit={setUserToEdit} setBookToEdit={setBookToEdit} />} />
          <Route path={ROUTES.CLIENT_DASHBOARD}    element={<div>Client Dashboard</div>} />
          <Route path={ROUTES.PATRON_DASHBOARD}    element={<PatronDashboard />} />
          <Route path={ROUTES.LIBRARIAN_DASHBOARD} element={<LibrarianDashboard />} />

          {/* User Management */}
          <Route path={ROUTES.USER_FORM} element={<UserForm userToEdit={userToEdit} onSubmit={handleAddUser} />} />
          <Route path={ROUTES.USER_LIST} element={<UserList users={users} onDelete={handleDeleteUser} setUserToEdit={setUserToEdit} />} />

          {/* Book Management */}
          <Route path={ROUTES.BOOK_FORM}       element={<BookForm bookToEdit={bookToEdit} />} />
          <Route path={ROUTES.BOOK_LIST}       element={<BookList />} />
          <Route path={ROUTES.BORROW_BOOK}     element={<BorrowBook onBorrow={handleBorrowBook} />} />
          <Route path={ROUTES.BORROW_HISTORY}  element={<BorrowHistory borrowList={borrowList} />} />
          <Route path={ROUTES.BORROWED_BOOKS}  element={<BorrowedBooks loggedInUser={loggedInUser} />} />

          {/* Approvals & Requests */}
          <Route path={ROUTES.APPROVE_LIBRARIAN}     element={<ApproveLibrarian />} />
          <Route path={ROUTES.APPROVE_CLIENT_PATRON} element={<ApproveClientPatron />} />
          <Route path={ROUTES.RETURN_REQUESTS}       element={<ReturnRequests />} />
          <Route path={ROUTES.EXTENSION_REQUESTS}    element={<ExtensionRequests />} />

          {/* Shared & Extras */}
          <Route path={ROUTES.ISSUED_BOOKS}     element={<IssuedBooks />} />
          <Route path={ROUTES.SEARCH_BOOKS}     element={<SearchBooks />} />
          <Route path={ROUTES.UPDATE_PROFILE}   element={<UpdateProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
