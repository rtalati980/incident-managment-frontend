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
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { jwtDecode } from "jwt-decode";
import logoImg from "../../../../png/knor.PNG";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../../../../config";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("jwt");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;

  // ======================
  // 🔹 Fetch User + Notifications
  // ======================
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/${userId}`);
        const data = await response.json();
        setUserName(data[0]?.name || "");
        setRole(decoded?.role || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_BASE_URL}/api/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchNotifications();

    // Optional: auto-refresh every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId, token]);

  // ======================
  // 🔹 Handle Tabs Navigation
  // ======================
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
    const paths = [
      "/user-panel/",
      "/user-panel/addNew",
      "/user-panel/incident",
      "/user-panel/profile",
      "/user-panel/assignincdent",
    ];
    navigate(paths[newValue]);
  };

  // ======================
  // 🔹 Handlers
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleNotificationClick = async (notif) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/notifications/${notif.id}/read`, {
        method: "PATCH", // ✅ PATCH matches backend
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    if (notif.incident_id) {
      navigate(`/user-panel/incident/${notif.incident_id}`);
    }
    handleNotifClose();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ======================
  // 🔹 Render
  // ======================
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#00457e",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar
        sx={{
          px: 6,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={logoImg} alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            KNOR Dashboard
          </Typography>
        </Box>

        {/* User & Notifications */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* 🔔 Notifications */}
          <IconButton onClick={handleNotifOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneRoundedIcon sx={{ fontSize: 28, cursor: "pointer" }} />
            </Badge>
          </IconButton>

          {/* Notification Menu */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <List sx={{ width: 340, maxHeight: 400, overflowY: "auto" }}>
              {loading ? (
                <ListItem>
                  <CircularProgress size={24} sx={{ margin: "auto" }} />
                </ListItem>
              ) : notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              ) : (
                notifications.map((notif) => (
                  <React.Fragment key={notif.id}>
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notif)}
                      sx={{
                        bgcolor: notif.is_read ? "#fff" : "rgba(0,69,126,0.1)",
                        "&:hover": { bgcolor: "rgba(0,69,126,0.15)" },
                      }}
                    >
                      <ListItemText
                        primary={notif.message}
                        secondary={new Date(notif.created_at).toLocaleString()}
                        primaryTypographyProps={{
                          fontWeight: notif.is_read ? 400 : 600,
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Menu>

          {/* User Info */}
          <Typography variant="body1" sx={{ fontWeight: 500, minWidth: 120 }}>
            {role} - {userName}
          </Typography>

          {/* Profile Menu */}
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
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/user-panel/profile");
              }}
            >
              Profile
            </MenuItem>
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
        <Tab label="REPORT INCIDENT" />
        <Tab label="INCIDENT HISTORY" />
        <Tab label="PROFILE" />
        <Tab label="ASSIGN INCIDENT" />
      </Tabs>
    </AppBar>
  );
}
