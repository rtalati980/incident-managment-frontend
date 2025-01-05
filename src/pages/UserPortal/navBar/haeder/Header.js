import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { jwtDecode } from 'jwt-decode';
import logoImg from '../../../../png/knor.PNG';
import config from '../../../../config';
import './header.css';

export default function Header() {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/${userId}`);
        const data = await response.json();
        setUserName(data[0].name);
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

  useEffect(() => {
    const pathToTabIndex = {
      '/user-panel/': 0,
      '/user-panel/addNew': 1,
      '/user-panel/incident': 2,
      '/user-panel/profile': 3,
      '/user-panel/assignincdent': 4,
    };
    setTabValue(pathToTabIndex[location.pathname] || 0);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const tabIndexToPath = [
      '/user-panel/',
      '/user-panel/addNew',
      '/user-panel/incident',
      '/user-panel/profile',
      '/user-panel/assignincdent',
    ];
    navigate(tabIndexToPath[newValue]);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="custom-appbar">
      <Toolbar className="custom-toolbar">
        <img src={logoImg} alt="Logo" className="custom-logo" />
        <Typography variant="h6" sx={{ flexGrow: 1 }} />
        <Typography variant="body1" className="custom-user-info">
          {role} - {userName}
        </Typography>
        <IconButton onClick={handleMenuOpen}>
          <AccountCircle className="custom-account-icon" />
        </IconButton>
        <NotificationsNoneRoundedIcon className="custom-notification-icon" />
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="User Panel Navigation"
        className="custom-tabs"
      >
        <Tab label="DASHBOARD" className="custom-tab" />
        <Tab label="REPORT INCIDENT" className="custom-tab" />
        <Tab label="INCIDENT HISTORY" className="custom-tab" />
        <Tab label="PROFILE" className="custom-tab" />
        <Tab label="ASSIGN INCIDENT" className="custom-tab" />
      </Tabs>
    </AppBar>
  );
}
