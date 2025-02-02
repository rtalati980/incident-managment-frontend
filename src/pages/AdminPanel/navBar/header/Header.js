import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { jwtDecode } from "jwt-decode";
import config from "../../../../config";
import logoImg from "../../../../png/knor.PNG";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
export default function AdminHeader() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/auth/${userId}`
        );
        const data = await response.json();
        setUserName(data[0].name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("JWT token not found");
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setRole(decoded.role);
        fetchUserData(userId);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const pathToTabIndex = {
      "/admin-panel/": 0,
      "/admin-panel/wrklctn": 1,
      "/admin-panel/typeAdd": 2,
      "/admin-panel/manageEntities": 3,
      "/admin-panel/ManageStatus": 4,
      "/admin-panel/inciReports": 5,
      "/admin-panel/profile": 6,
      "/admin-panel/user": 7,
    };
    setTabValue(pathToTabIndex[location.pathname] || 0);
  }, [location.pathname]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const tabIndexToPath = [
      "/admin-panel/",
      "/admin-panel/wrklctn",
      "/admin-panel/typeAdd",
      "/admin-panel/manageEntities",
      "/admin-panel/manageSatus",
      "/admin-panel/inciReports",
      "/admin-panel/profile",
      "/admin-panel/user",
    ];
    navigate(tabIndexToPath[newValue]);
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position="static"
      sx={{ background: "white", color: "#00457e", padding: "0 70px" }}
    >
      {" "}
      <Toolbar className="custom-toolbar" sx={{ padding: "20px 30px" }}>
        {" "}
        <img src={logoImg} alt="Logo" />{" "}
        <Typography variant="h6" sx={{ flexGrow: 1 }} />{" "}
        <Typography variant="body1" className="custom-user-info">
          {" "}
          {role} - {userName}{" "}
        </Typography>{" "}
        <IconButton onClick={handleMenuOpen}>
          {" "}
          <AccountCircle sx={{ color: "#00457e" }} />{" "}
        </IconButton>{" "}
        <NotificationsNoneRoundedIcon className="custom-notification-icon" />{" "}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {" "}
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>{" "}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>{" "}
        </Menu>{" "}
      </Toolbar>{" "}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="User Panel Navigation"
        className="class-tabs"
      >
        {" "}
        <Tab label="DASHBOARD" /> <Tab label="BAY" />{" "}
        <Tab label="INCIDENT TYPE" /> <Tab label="CATEGORY" />{" "}
        <Tab label="STATUS" /> <Tab label="REPORTED INCIDENT" />{" "}
        <Tab label="PROFILE" /> <Tab label="USERS" />{" "}
      </Tabs>{" "}
    </AppBar>
  );
}
