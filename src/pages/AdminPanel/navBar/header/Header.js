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
            TYPE EDIT
          </NavLink>
          <NavLink
            to="/admin-panel/manageEntities"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            CATEGORY
          </NavLink>
          <NavLink
            to="/admin-panel/manageStatus"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            STATUS
          </NavLink>
          <NavLink
            to="/admin-panel/inciReports"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            INCIDENT RECORDS
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
            USER
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
