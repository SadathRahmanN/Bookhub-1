import React from 'react';
import Navbar from '../components/common/Navbar';
import LoginForm from '../components/common/LoginForm';

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <div className="login-page-container">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
