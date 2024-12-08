import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Menu, MenuItem } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { jwtDecode } from 'jwt-decode';
import logoImg  from '../../../../png/knor.PNG';


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

  // Set active tab based on the current route
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
    <AppBar position="static" style={{ backgroundColor: '#e2e2e2', color:"#5b5b5b"  }}>
      <Toolbar>
        {/* Logo or Title */}

        <img src={logoImg} alt='asdf'  style={{width:'280px'}}/> 
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#5b5b5b' }}>
        </Typography>

        {/* User Info */}
        <Typography variant="body1" sx={{ marginRight: 2, color: '#5b5b5b' }}>
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
          <AccountCircle  sx={{color:"#5b5b5b"}}/>
         
        </IconButton>

        <NotificationsNoneRoundedIcon sx={{ color: '#5b5b5b' }} />
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
        aria-label="User Panel Navigation"
        textColor="inherit"
        indicatorColor="primary"
        variant="scrollable"
        sx={{color:"blue"}}
      >
      
        <Tab label="DASHBOARD" />
        <Tab label="REPORT INCIDENT" />
        <Tab label="INCIDENT HISTORY" />
        <Tab label="PROFILE" />
        <Tab label="ASSIGN INCIDENT" />
      </Tabs>
    </AppBar>
  );
}

