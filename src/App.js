import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct named import

import Login from './pages/Login/Login';
import UserRoutes from './pages/AdminPanel/AdPanel'
import Panel from './pages/UserPortal/Panel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setRole(null);
        } else {
          setIsLoggedIn(true);
          setRole(payload.role);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setRole(null);
      }
    }
  }, []);

  const handleLogin = (role, email) => {
    setIsLoggedIn(true);
    setRole(role);
    setEmail(email);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const sendEmail = () => {
    window.location.href = `mailto:recipient@example.com?subject=Subject&body=Body`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={role === 'admin' ? '/admin-panel' : '/user-panel'} />} />
        <Route path="/user-panel/*" element={<Panel email={email} sendEmail={sendEmail} />} />
        <Route path="/admin-panel/*" element={<UserRoutes sendEmail={sendEmail} />} />
      </Routes>
    </Router>
  );
}

export default App;
