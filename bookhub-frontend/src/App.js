import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Other routes like /signup, /admin-dashboard, etc. will go here */}
      </Routes>
    </Router>
  );
};

export default App;
