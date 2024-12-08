import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { jwtDecode } from 'jwt-decode';

export default function AdminHeader() {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
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
      '/admin-panel/': 0,
      '/admin-panel/wrklctn': 1,
      '/admin-panel/typeAdd': 2,
      '/admin-panel/manageEntities': 3,
      '/admin-panel/ManageStatus': 4,
      '/admin-panel/inciReports': 5,
      '/admin-panel/profile': 6,
      '/admin-panel/user': 7,
    };
    setTabValue(pathToTabIndex[location.pathname] || 0);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const tabIndexToPath = [
      '/admin-panel/',
      '/admin-panel/wrklctn',
      '/admin-panel/typeAdd',
      '/admin-panel/manageEntities',
      '/admin-panel/manageSatus',
      '/admin-panel/inciReports',
      '/admin-panel/profile',
      '/admin-panel/user',
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
    <AppBar position="static" style={{ backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar>
        {/* Logo or Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#333' }}>
          Admin Panel
        </Typography>

        {/* User Info */}
        <Typography variant="body1" sx={{ marginRight: 2, color: '#333' }}>
          {role} - {userName}
        </Typography>

        {/* Account Icon with Menu */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="account of current user"
          onClick={handleMenuOpen}
        >
          <AccountCircle />
        </IconButton>
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

      {/* Navigation Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Admin Panel Navigation"
        textColor="inherit"
        indicatorColor="primary"
        variant="scrollable"
      >
        <Tab label="DASHBOARD" />
        <Tab label="BAY" />
        <Tab label="INCIDENT TYPE" />
        <Tab label="CATEGORY" />
        <Tab label="STATUS" />
        <Tab label="REPORTED INCIDENT" />
        <Tab label="PROFILE" />
        <Tab label="USERS" />
      </Tabs>
    </AppBar>
  );
}
