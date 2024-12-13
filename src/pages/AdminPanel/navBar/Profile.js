import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import config from  '../../../config';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

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

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfile(data[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
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

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

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
      const userId = decodedToken.id; // Adjust based on your token structure
      fetchProfile(userId);
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box textAlign="center">
          <Avatar sx={{ margin: '0 auto', bgcolor: 'primary.main', width: 80, height: 80 }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            {profile.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {profile.role}
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="body1">
            <strong>Email:</strong> {profile.email}
          </Typography>
        </Box>
        {isEditing ? (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {errorMessage && (
              <Typography color="error" mt={2}>
                {errorMessage}
              </Typography>
            )}
            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChangeClick}
                startIcon={<LockIcon />}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        ) : (
          <Box mt={4} textAlign="center">
            <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
              Change Password
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
