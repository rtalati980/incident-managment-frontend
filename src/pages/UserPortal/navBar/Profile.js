import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import config from '../../../config';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    empid: '',
    department: '',
    reporting: '',
  });
  const [editProfile, setEditProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setProfile(data[0]);
      setEditProfile(data[0]); // Initialize editable copy
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileChange = (field, value) => {
    setEditProfile({ ...editProfile, [field]: value });
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/auth/${profile.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(editProfile),
        }
      );
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChangeClick = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/auth/${profile.id}/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      if (!response.ok) throw new Error('Failed to change password');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchProfile(decodedToken.id);
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {profile.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Details */}
        <Grid container spacing={3}>
          {[
            { label: 'Employee ID', field: 'empid', editable: false },
            { label: 'Name', field: 'name', editable: true },
            { label: 'Email', field: 'email', editable: true },
            { label: 'Department', field: 'department', editable: true },
            { label: 'Reporting To', field: 'reporting', editable: true },
            { label: 'Role', field: 'role', editable: true },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.field}>
              <Typography variant="subtitle2" color="textSecondary">
                {item.label}
              </Typography>
              {isEditing && item.editable ? (
                item.field === 'role' ? (
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={editProfile.role}
                      onChange={(e) => handleProfileChange('role', e.target.value)}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    value={editProfile[item.field]}
                    onChange={(e) => handleProfileChange(item.field, e.target.value)}
                  />
                )
              ) : (
                <Typography variant="body1">{profile[item.field]}</Typography>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Edit Buttons */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditProfile(profile); // reset edits
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Password Change Section */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          {isEditing ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography color="error">{errorMessage}</Typography>
                </Grid>
              )}
              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChangeClick}
                  startIcon={<LockIcon />}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
              startIcon={<LockIcon />}
            >
              Change Password
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
