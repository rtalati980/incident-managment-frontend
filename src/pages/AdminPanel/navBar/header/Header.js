import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import logoImg from "../../../../png/knor.PNG";
import config from "../../../../config";

export default function AdminHeader() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info
  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/${userId}`);
        const data = await response.json();
        setUserName(data[0].name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchData = () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        fetchUserData(decoded.id);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    };

    fetchData();
  }, []);

  // Set active tab based on URL
  useEffect(() => {
    const pathToIndex = {
      "/admin-panel/": 0,
      "/admin-panel/wrklctn": 1,
      "/admin-panel/typeAdd": 2,
      "/admin-panel/manageEntities": 3,
      "/admin-panel/inciReports": 4,
      "/admin-panel/profile": 5,
      "/admin-panel/user": 6,
    };
    setTabValue(pathToIndex[location.pathname] || 0);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const paths = [
      "/admin-panel/",
      "/admin-panel/wrklctn",
      "/admin-panel/typeAdd",
      "/admin-panel/manageEntities",
      "/admin-panel/inciReports",
      "/admin-panel/profile",
      "/admin-panel/user",
    ];
    navigate(paths[newValue]);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#00457e", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      {/* Toolbar */}
      <Toolbar sx={{ px: 6, py: 1.5, display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={logoImg} alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            KNOR Admin
          </Typography>
        </Box>

        {/* Notifications & User */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge badgeContent={3} color="error">
            <NotificationsNoneRoundedIcon sx={{ fontSize: 28, cursor: "pointer" }} />
          </Badge>

          <Typography variant="body1" sx={{ fontWeight: 500, minWidth: 120 }}>
            {role} - {userName}
          </Typography>

          <IconButton onClick={handleMenuOpen} size="large">
            <AccountCircle sx={{ fontSize: 32, color: "#00457e" }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin-panel/profile"); }}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Tabs Navigation */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#00457e", height: 3 },
          "& .MuiTab-root": { fontWeight: 600, minHeight: 50 },
          px: 6,
        }}
      >
        <Tab label="DASHBOARD" />
        <Tab label="BAY" />
        <Tab label="INCIDENT TYPE" />
        <Tab label="CATEGORY" />
        <Tab label="REPORTED INCIDENT" />
        <Tab label="PROFILE" />
        <Tab label="USERS" />
      </Tabs>
    </AppBar>
  );
}
