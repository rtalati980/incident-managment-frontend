import React, { useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import statement
import './login.css';
import config from '../../config';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    fetch(`${config.API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || 'Invalid credentials');
        });
      }
      return response.json();
    })
    .then(data => {
      const token = data.token;
      const payload = jwtDecode(token);

      // Store the token for later use
      localStorage.setItem('jwt', token);

      onLogin(payload.role, email); // Pass email to the onLogin function
      console.log(email);
    })
    .catch(error => {
      console.error('Error during login:', error);
      setLoginMessage(error.message);
    });
  };

  return (
    <div className='container'>
       
      <div className="login-container">
        <h1>Login</h1>
        <form id="loginForm" onSubmit={handleLoginSubmit}>
          <label htmlFor="login-email">Email:</label>
          <input 
            type="email" 
            id="login-email" 
            name="email" 
            required 
            value={loginData.email} 
            onChange={handleLoginChange} 
          />
          <label htmlFor="login-password">Password:</label>
          <input 
            type="password" 
            id="login-password" 
            name="password" 
            required 
            value={loginData.password} 
            onChange={handleLoginChange} 
          />
          <button type="submit">Login</button>
        </form>
        <p id="login-message">{loginMessage}</p>
      </div>
    </div>
  );
};

export default Login;
