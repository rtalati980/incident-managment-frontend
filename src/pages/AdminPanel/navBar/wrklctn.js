import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import Select from 'react-select';

export default function Wrklctn() {
  const [name, setName] = useState('');
  const [bayType, setBayType] = useState('');
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchLocations();
    fetchUsers();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wrklctns');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const locationData = await response.json();

      const locationsWithUser = await Promise.all(
        locationData.map(async (location) => {
          if (location.UserID) {
            const userResponse = await fetch(
              `http://localhost:5000/api/auth/${location.UserID}`
            );
            if (userResponse.ok) {
              const userData = await userResponse.json();
              location.appointedUser = userData;
            }
          }
          return location;
        })
      );
      setLocations(locationsWithUser);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('JWT token not found');

      const response = await fetch('http://localhost:5000/api/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const userData = await response.json();

      const userOptions = userData.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      }));

      setUsers(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:5000/api/wrklctns/${editingId}`
      : 'http://localhost:5000/api/wrklctns';

    const requestBody = {
      name,
      bayType,
      UserID: selectedUser ? selectedUser.value : null,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (editingId) {
        setLocations((prevLocations) =>
          prevLocations.map((loc) => (loc.id === editingId ? data : loc))
        );
      } else {
        setLocations((prevLocations) => [...prevLocations, data]);
      }

      setName('');
      setBayType('');
      setSelectedUser(null);
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (id) => {
    const location = locations.find((loc) => loc.id === id);
    setName(location.name);
    setBayType(location.bayType);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/wrklctns/${id}`, {
        method: 'DELETE',
      });
      setLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.id !== id)
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Locations
      </Typography>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" gap={2} flexDirection="row" flexWrap="wrap">
            <TextField
              label="Bay Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Bay Type"
              value={bayType}
              onChange={(e) => setBayType(e.target.value)}
              fullWidth
            />
            <Box flex={1} minWidth="200px">
              <Select
                options={users}
                onChange={handleUserSelect}
                placeholder="Select a user"
                isSearchable
              />
            </Box>
          </Box>
          <Box mt={2} textAlign="right">
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Bay Type</TableCell>
              <TableCell>Appointed User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location, index) => (
              <TableRow key={location.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.bayType}</TableCell>
                <TableCell>
                  {location.appointedUser && location.appointedUser[0]
                    ? `${location.appointedUser[0].name} (${location.appointedUser[0].email})`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(location.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(location.id)}
                    sx={{ marginLeft: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
