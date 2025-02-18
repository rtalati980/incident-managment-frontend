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
import config from '../../../config';

export default function Wrklctn() {
  // --- States for Location Management ---
  const [name, setName] = useState('');
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLocationsId, setSelectedLocationsId] = useState('');
  // (Optional) If you want to associate a bay type with a location, you can use these:
  const [bayTypes, setBayTypes] = useState([]); // This holds bay type options for locations
  const [selectedBayType, setSelectedBayType] = useState(null);
  const [users, setUsers] = useState([]);

  // --- State for Bay Type Management Form ---
  const [newBayType, setNewBayType] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchUsers();
    fetchBayTypes();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/wrklctns`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      const locationData = await response.json();

      // For each location, fetch its appointed user if available
      const locationsWithUser = await Promise.all(
        locationData.map(async (location) => {
          if (location.UserID) {
            const userResponse = await fetch(
              `${config.API_BASE_URL}/api/auth/${location.UserID}`
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

      const response = await fetch(`${config.API_BASE_URL}/api/auth`, {
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

  const fetchBayTypes = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/baytypes`);
      if (!response.ok) throw new Error('Failed to fetch bay types');
      const bayTypeData = await response.json();

      const bayTypeOptions = bayTypeData.map((bayType) => ({
        value: bayType.id,
        label: bayType.name,
      }));
      setBayTypes(bayTypeOptions);
    } catch (error) {
      console.error('Error fetching bay types:', error);
    }
  };

  // --- Location Form Submission ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${config.API_BASE_URL}/api/wrklctns/${editingId}`
      : `${config.API_BASE_URL}/api/wrklctns`;

    const requestBody = {
      name,
      // Uncomment the next line if your API expects a bayType for a location:
      // bayType: selectedBayType ? selectedBayType.value : null,
      UserID: selectedUser ? selectedUser.value : null,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (editingId) {
        setLocations((prev) =>
          prev.map((loc) => (loc.id === editingId ? data : loc))
        );
      } else {
        setLocations((prev) => [...prev, data]);
      }

      // Reset location form fields
      setName('');
      setSelectedUser(null);
      setSelectedBayType(null);
      setEditingId(null);
    } catch (error) {
      console.error('Error submitting location:', error);
    }
  };

  const handleEdit = (id) => {
    const location = locations.find((loc) => loc.id === id);
    setName(location.name);
    // If your location has an associated bay type, you can set it here:
    setSelectedBayType({ value: location.bayTypeId, label: location.bayType });
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/wrklctns/${id}`, {
        method: 'DELETE',
      });
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  const handleBayTypeSelect = (selectedBayType) => {
    setSelectedBayType(selectedBayType);
  };

  // --- Bay Type Form Submission ---
  const handleBayTypeSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/baytypes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBayType }),
      });
      const data = await response.json();
      // Create a new option for the bay type select
      const newOption = { value: data.id, label: data.name };
      setBayTypes((prev) => [...prev, newOption]);
      setNewBayType('');
    } catch (error) {
      console.error('Error creating bay type:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Locations and Bay Types
      </Typography>

      {/* ----- Location Form ----- */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" gap={2} flexDirection="row" flexWrap="wrap">
            <TextField
              label="Bay Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Box flex={1} minWidth="200px">
              <Select
                options={users}
                value={selectedUser}
                onChange={handleUserSelect}
                placeholder="Select a user"
                isSearchable
              />
            </Box>
            {/* Uncomment the following if you want to include bay type selection in the location form:
            <Box flex={1} minWidth="200px">
              <Select
                options={bayTypes}
                value={selectedBayType}
                onChange={handleBayTypeSelect}
                placeholder="Select Bay Type"
                isSearchable
              />
            </Box>
            */}
          </Box>
          <Box mt={2} textAlign="right">
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* ----- Locations Table ----- */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Appointed User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location, index) => (
              <TableRow key={location.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.name}</TableCell>
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
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ----- Bay Type Form ----- */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <form onSubmit={handleBayTypeSubmit}>
          <Box display="flex" gap={2} flexDirection="row" flexWrap="wrap">
            <TextField
              label="Bay Type Name"
              value={newBayType}
              onChange={(e) => setNewBayType(e.target.value)}
              fullWidth
            />
          </Box>
          <Box flex={1} minWidth="200px">
              <Select
                options={users}
                value={selectedUser}
                onChange={handleUserSelect}
                placeholder="Select a user"
                isSearchable
              />
            </Box>
          <Box mt={2} textAlign="right">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
