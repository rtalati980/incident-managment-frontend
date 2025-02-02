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
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { jwtDecode } from "jwt-decode";
import logoImg from "../../../../png/knor.PNG";
import config from "../../../../config";
import "./header.css";

export default function Header() {
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
      "/user-panel/": 0,
      "/user-panel/addNew": 1,
      "/user-panel/incident": 2,
      "/user-panel/profile": 3,
      "/user-panel/assignincdent": 4,
    };
    setTabValue(pathToTabIndex[location.pathname] || 0);
  }, [location.pathname]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const tabIndexToPath = [
      "/user-panel/",
      "/user-panel/addNew",
      "/user-panel/incident",
      "/user-panel/profile",
      "/user-panel/assignincdent",
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
        <Tab label="DASHBOARD" /> <Tab label="REPORT INCIDENT" />{" "}
        <Tab label="INCIDENT HISTORY" /> <Tab label="PROFILE" />{" "}
        <Tab label="ASSIGN INCIDENT" />{" "}
      </Tabs>{" "}
    </AppBar>
  );
}
