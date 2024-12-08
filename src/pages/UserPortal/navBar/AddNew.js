import React, { useState, useEffect } from 'react';

import {jwtDecode} from 'jwt-decode';
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function IncidentForm() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]); // State to store fetched assignees
 // State to manage assignments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [errorMessage, setErrorMessage] = useState('');
  const [incidentNumber, setIncidentNumber] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [assignments, setAssignments] = useState([{ id: Date.now(), selectedUsers: [], defaultUser: null }]);
  const [files, setFiles] = useState([{ id: Date.now(), file: null }]);

  useEffect(() => {
    setLoading(true); // Start loading before making API requests
  
    Promise.all([
      fetch("http://localhost:5000/api/wrklctns").then((response) => {
        if (!response.ok) throw new Error("Failed to fetch work locations");
        return response.json();
      }),
      fetch("http://localhost:5000/api/types").then((response) => {
        if (!response.ok) throw new Error("Failed to fetch types");
        return response.json();
      }),
      fetch("http://localhost:5000/api/categories").then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      }),
      fetch("http://localhost:5000/api/subcategories").then((response) => {
        if (!response.ok) throw new Error("Failed to fetch subcategories");
        return response.json();
      }),
      fetch("http://localhost:5000/api/auth").then((response) => {
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
      }),
    ])
      .then(([locationsData, typesData, categoriesData, subcategoriesData, usersData]) => {
        setLocations(locationsData);
        setTypes(typesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setUsers(usersData);
        console.log("Fetched data:", {
          locationsData,
          typesData,
          categoriesData,
          subcategoriesData,
          usersData,
        });
        setLoading(false); // Stop loading after successful data fetch
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setErrorMessage(error.message || "Error fetching data"); // Set the error message
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);
  

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents/id/getuser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      console.log('Fetched incidents:', data); // Debug: Log the fetched data
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setErrorMessage('Error fetching incidents');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem('jwt');
    if (!token) {
      setErrorMessage('JWT token not found');
      return;
    }
  
    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      setErrorMessage('Error decoding JWT token: ' + error.message);
      return;
    }
  
    const formData = new FormData();
    const formDataObject = {};
  
    // Collect other form data
    const formElements = event.target.elements;
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name && element.type !== 'file') {
        formDataObject[element.name] = element.value;
      }
    }
  
    // Handle files
    const fileInput = event.target.querySelector('input[type="file"]');
    const files = fileInput ? fileInput.files : null;
  
    console.log('Files:', files);
  
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]); // Append each file to FormData
      }
    } else {
      console.log('No files selected.');
    }
  
    formDataObject.userId = userId;
  
   
  
    // Append other form data to FormData
    for (const key in formDataObject) {
      formData.append(key, formDataObject[key]);
    }
    console.log('Form Data object:', formDataObject);
    try {
      const response = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Use formData to send both form fields and files
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      const responseData = await response.json();
      const incidentNo = responseData.No;
      setIncidentNumber(incidentNo);
      setIsPopupVisible(true);
      fetchData();
    } catch (error) {
      setErrorMessage('Error submitting form: ' + error.message);
    }
  };
  

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const addAssignment = () => {
    setAssignments((prevAssignments) => [
      ...prevAssignments,
      {
        id: Date.now(),
        selectedUsers: [], // Initial empty selection
      },
    ]);
  };

  // Remove a dropdown section by ID
  const removeAssignment = (id) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((assignment) => assignment.id !== id)
    );
  };

  const handleUserChange = (id, event) => {
    const selectedValues = event.target.value; // MUI Select passes selected values here
  
    // Update the assignments state
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, selectedUsers: selectedValues }
          : assignment
      )
    );
  };
  

  const addFile = () => {
    setFiles([...files, { id: Date.now(), file: null }]);
  };

  // Remove a file upload section
  const removeFile = (id) => {
    setFiles(files.filter((fileObj) => fileObj.id !== id));
  };

  // Handle file change
  const handleFileChange = (id, file) => {
    const filePreview = URL.createObjectURL(file);
    setFiles((prevFiles) =>
      prevFiles.map((fileObj) =>
        fileObj.id === id ? { ...fileObj, file, filePreview } : fileObj
      )
    );
  };

  const fetchLocationDetails = (locationId) => {
    fetch(`http://localhost:5000/api/wrklctns/${locationId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched location details: ", data); // Debug: Log the fetched data
        setSelectedLocationDetails(data);
        setAssignments(prevAssignments =>
          prevAssignments.map(assignment =>
            assignment.defaultUser === null
              ? { ...assignment, defaultUser: data.UserID, selectedUsers: [...assignment.selectedUsers, data.UserID] }
              : assignment
          )
        );
      })
      .catch(error => console.error('Error fetching location details:', error));
  };

  const handleLocationChange = (event) => {
    const locationId = event.target.value;
    fetchLocationDetails(locationId);
  };

  return (
<div className='incident-form-container'>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4} padding={5}>
          {/* Row 1: Location, Type, Category */}
          {/* <Grid item xs={12} sm={2}> */}
            <FormControl sx={{"width": {sm: "100"}}}>
              <InputLabel>Bay</InputLabel>
              <Select name="workLocation" onChange={handleLocationChange}>
                <MenuItem value="">Select</MenuItem>
                {locations.map(location => (
                  <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          {/* </Grid> */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Observation Type</InputLabel>
              <Select name="type">
                <MenuItem value="">Select</MenuItem>
                {types.map(type => (
                  <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Observation Category</InputLabel>
              <Select name="category">
                <MenuItem value="">Select</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Bay Details */}
        {/* {selectedLocationDetails && (
            <Grid item xs={12}>
              <p>Bay Owner: {selectedLocationDetails.bayOwner}</p>
              <p>Bay Type: {selectedLocationDetails.bayType}</p>
            </Grid>
        )} /}

          {/* Row 2: Sub Category, Observer Description, Date & Time */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Observation Sub Category</InputLabel>
              <Select name="subcategory">
                <MenuItem value="">Select</MenuItem>
                {subcategories.map(subcategory => (
                  <MenuItem key={subcategory.id} value={subcategory.name}>{subcategory.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Observer Description" name="observerDescription" maxLength={100} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField fullWidth label="Incident Date" name="inciDate" type="date" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField fullWidth label="Incident Time" name="inciTime" type="time" />
          </Grid>

          {/* Assign Users */}
          <div>
      <h3>Assign Users</h3>

      {/* Error and Loading States */}
      {loading && <p>Loading assignees...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display Assignments */}
      {!loading && !error && (
        <>
          {assignments.map((assignment) => (
            <Grid container spacing={2} key={assignment.id}>
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel>Assign Users</InputLabel>
                  <Select
                    name="assignedUsers"
                    multiple
                    value={assignment.selectedUsers}
                    onChange={(e) => handleUserChange(assignment.id, e)}
                    renderValue={(selected) =>
                      selected
                        .map((userId) => users.find((user) => user.id === userId)?.name || "Unknown")
                        .join(", ")
                    }
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name || `User ${user.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={addAssignment}>+</Button>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={() => removeAssignment(assignment.id)}>-</Button>
              </Grid>
            </Grid>
          ))}

          {/* Add Assignment Button */}
          <div style={{ marginTop: "1rem" }}>
            <Button variant="contained" color="primary" onClick={addAssignment}>
              Add Assignment
            </Button>
          </div>
        </>
      )}
    </div>

          {/* Action Taken and File Upload */}
          <Grid item xs={12}>
            <TextField fullWidth label="Action Taken (Optional)" name="actionTaken" maxLength={50} />
          </Grid>
          <Grid item xs={12}>
          <div>
        <h3>Upload Files</h3>
        {files.map((fileObj) => (
          <Grid container spacing={2} key={fileObj.id}>
            <Grid item xs={8}>
              <Button variant="contained" component="label">
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(fileObj.id, e.target.files[0])}
                />
              </Button>
              {fileObj.file && (
                <div style={{ marginTop: 10 }}>
                  {fileObj.file.type.startsWith('image/') ? (
                    <img
                      src={fileObj.filePreview}
                      alt="Uploaded preview"
                      style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ccc', marginTop: '10px' }}
                    />
                  ) : (
                    <a
                      href={fileObj.filePreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '10px' }}
                    >
                      {fileObj.file.name}
                    </a>
                  )}
                </div>
              )}
            </Grid>
            <Grid item xs={2}>
              <Button onClick={addFile}>+</Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={() => removeFile(fileObj.id)}>-</Button>
            </Grid>
          </Grid>
        ))}
      </div>
  </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <div style={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="primary">Submit</Button>
            </div>
          </Grid>
        </Grid>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {/* Popup for successful submission */}
      <Dialog open={isPopupVisible} onClose={handleClosePopup}>
        <DialogTitle>Incident Submitted Successfully</DialogTitle>
        <DialogContent>
          <p>Your incident number is: {incidentNumber}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}