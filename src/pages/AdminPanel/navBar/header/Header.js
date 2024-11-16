import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import {jwtDecode} from 'jwt-decode';

export default function Header() {
  const [userName, setUserName] = useState('');
  const[role,setRole]=useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
        const data = await response.json();
        setUserName(data[0].name);
        console.log(data[0].name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('JWT token not found');
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setRole(decoded.role);
        fetchUserData(userId);
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="header-top">
       
        <div className="user-info">
          <span className="user-name">{role}-{userName}</span>
          <PowerSettingsNewIcon className="logout-icon" onClick={handleLogout} />
        </div>
      </div>
      <div className="nav-bar">
        <nav className="nav-links">
          <NavLink
            to="/admin-panel/"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            end
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/admin-panel/wrklctn"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            BAY
          </NavLink>
          <NavLink
            to="/admin-panel/typeAdd"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            INCIDENT TYPE
          </NavLink>
          <NavLink
            to="/admin-panel/manageEntities"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
           CATEGORY
          </NavLink>
          <NavLink
            to="/admin-panel/manageSatus"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            STATUS
          </NavLink>
          <NavLink
            to="/admin-panel/inciReports"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            REPORTED INCIDENT
          </NavLink>
          <NavLink
            to="/admin-panel/profile"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            PROFILE
          </NavLink>
          <NavLink
            to="/admin-panel/user"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
           USERS
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
