import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* Add more routes if needed */}
      </Routes>
    </Router>
  );
};

export default App;
