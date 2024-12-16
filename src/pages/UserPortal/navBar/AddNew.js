import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import config from '../../../config'; // Ensure you have your API_BASE_URL in a separate file

const IncidentForm = () => {
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [locationsData, typesData, categoriesData, subcategoriesData, usersData] = await Promise.all([
          fetchDataFromAPI('/api/wrklctns'),
          fetchDataFromAPI('/api/types'),
          fetchDataFromAPI('/api/categories'),
          fetchDataFromAPI('/api/subcategories'),
          fetchDataFromAPI('/api/auth'),
        ]);

        setLocations(locationsData);
        setTypes(typesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setUsers(usersData);
      } catch (err) {
        setErrorMessage(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchDataFromAPI = async (endpoint) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return response.json();
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleAssignmentAdd = (userId) => {
    if (!assignments.includes(userId)) {
      setAssignments((prev) => [...prev, userId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedLocation || !selectedType || !selectedCategory || !selectedSubcategory) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    const token = localStorage.getItem('jwt');
    const decodedToken = jwtDecode(token);
    const creatorId = decodedToken.userId;

    const formData = new FormData();
    formData.append('location', selectedLocation);
    formData.append('type', selectedType);
    formData.append('category', selectedCategory);
    formData.append('subcategory', selectedSubcategory);
    formData.append('creatorId', creatorId);
    assignments.forEach((id, index) => formData.append(`assignments[${index}]`, id));
    files.forEach((file, index) => formData.append(`files[${index}]`, file));

    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit incident');
      }

      setSuccessMessage('Incident submitted successfully');
      setErrorMessage('');
      setFiles([]);
      setAssignments([]);
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Create Incident
      </Typography>

      {loading && <CircularProgress />}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Location</InputLabel>
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            {subcategories.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Assign Users"
          fullWidth
          margin="normal"
          select
          onChange={(e) => handleAssignmentAdd(e.target.value)}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ margin: '20px 0' }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Submit
        </Button>

        {errorMessage && (
          <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage('')}>
            <Alert severity="error">{errorMessage}</Alert>
          </Snackbar>
        )}

        {successMessage && (
          <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>
        )}
      </form>
    </div>
  );
};

export default IncidentForm;
