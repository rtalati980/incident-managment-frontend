import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../../../../png/knor.PNG';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './header.css'; 
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
        <img className="logo-img" src={logo} alt="logo" />
        <div className="user-info">
          <span className="user-name">{role}-{userName}</span>
          <PowerSettingsNewIcon className="logout-icon" onClick={handleLogout} />
        </div>
      </div>
      <div className="nav-bar">
        <nav className="nav-links">
          <NavLink
            to="/user-panel/"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            end
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/user-panel/addNew"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            REPORT INCIDENT
          </NavLink>
          <NavLink
            to="/user-panel/incident"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            INCIDENT HISTORY
          </NavLink>
          <NavLink
            to="/user-panel/profile"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            PROFILE
          </NavLink>
          <NavLink
            to="/user-panel/assignincdent"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            ASSIGN INCIDENT
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
