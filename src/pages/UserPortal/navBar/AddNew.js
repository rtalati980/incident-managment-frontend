import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const IncidentForm = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    location: '',
    type: '',
    category: '',
    subcategory: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, subcategoriesRes, locationsRes, typesRes, usersRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/categories`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/subcategories`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/locations`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/types`),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/users`),
        ]);

        setCategories(await categoriesRes.json());
        setSubcategories(await subcategoriesRes.json());
        setLocations(await locationsRes.json());
        setTypes(await typesRes.json());
        setUsers(await usersRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addAssignment = () => {
    setAssignments((prev) => [...prev, { id: uuidv4(), selectedUsers: [] }]);
  };

  const handleUserChange = (id, event) => {
    const { value } = event.target;
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, selectedUsers: value } : assignment
      )
    );
  };

  const removeAssignment = (id) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const addFile = () => {
    setFiles((prev) => [...prev, { id: uuidv4(), file: null }]);
  };

  const handleFileChange = (id, file) => {
    setFiles((prev) =>
      prev.map((fileObj) =>
        fileObj.id === id ? { ...fileObj, file, filePreview: URL.createObjectURL(file) } : fileObj
      )
    );
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((fileObj) => fileObj.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assignments,
        files: files.map((file) => file.file),
      };
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      alert('Incident submitted successfully!');
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert('Failed to submit incident. Please try again.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            >
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
            >
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {assignments.map((assignment) => (
          <Grid container spacing={2} key={assignment.id}>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Select Assignee(s)</InputLabel>
                <Select
                  multiple
                  value={assignment.selectedUsers}
                  onChange={(e) => handleUserChange(assignment.id, e)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" onClick={() => removeAssignment(assignment.id)}>
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={addAssignment}>
            Add Assignment
          </Button>
        </Grid>
        {files.map((fileObj) => (
          <Grid item xs={12} sm={6} key={fileObj.id}>
            <input
              type="file"
              onChange={(e) => handleFileChange(fileObj.id, e.target.files[0])}
            />
            <Button variant="outlined" onClick={() => removeFile(fileObj.id)}>
              Remove
            </Button>
            {fileObj.filePreview && (
              <img
                src={fileObj.filePreview}
                alt="File Preview"
                style={{ width: '100px' }}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={addFile}>
            Add File
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default IncidentForm;