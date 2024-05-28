import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../../../../png/knor.PNG';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './header.css'; 

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="header-top">
        <img className="logo-img" src={logo} alt="logo" />
        <PowerSettingsNewIcon className="logout-icon" onClick={handleLogout} />
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
          
        </nav>
      </div>
    </div>
  );
}
