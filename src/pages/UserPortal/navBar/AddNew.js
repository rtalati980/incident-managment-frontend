import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Box,
  Alert,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { UploadFile, Delete, AssignmentInd } from "@mui/icons-material";
import config from "../../../config";

const IncidentForm = () => {
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [observerDescription, setObserverDescription] = useState("");
  const [inciDate, setInciDate] = useState("");
  const [inciTime, setInciTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDataFromAPI = async (endpoint) => {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`);
    return response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [locationsData, typesData, categoriesData, subcategoriesData, usersData] = await Promise.all([
          fetchDataFromAPI("/api/wrklctns"),
          fetchDataFromAPI("/api/types"),
          fetchDataFromAPI("/api/categories"),
          fetchDataFromAPI("/api/subcategories"),
          fetchDataFromAPI("/api/auth"),
        ]);
        setLocations(locationsData);
        setTypes(typesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setUsers(usersData);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignmentAdd = (userId) => {
    if (!assignments.includes(userId)) setAssignments((prev) => [...prev, userId]);
  };

  const handleAssignmentRemove = (userId) => {
    setAssignments((prev) => prev.filter((id) => id !== userId));
  };

  const handleFileChange = (event) => {
    const uploaded = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation || !selectedType || !selectedCategory || !selectedSubcategory) {
      setErrorMessage("Please fill all required fields");
      return;
    }
    const token = localStorage.getItem("jwt");
    if (!token) {
      setErrorMessage("User not authenticated");
      return;
    }

    const decoded = jwtDecode(token);
    const creatorId = decoded.id;
    const formData = new FormData();
    formData.append("observerDescription", observerDescription);
    formData.append("inciDate", inciDate);
    formData.append("inciTime", inciTime);
    formData.append("workLocation", selectedLocation);
    formData.append("type", selectedType);
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);
    formData.append("creatorId", creatorId);
    assignments.forEach((id, i) => formData.append(`assignments[${i}]`, id));
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const res = await fetch(`${config.API_BASE_URL}/api/incidents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSuccessMessage("Incident submitted successfully!");
      setObserverDescription("");
      setInciDate("");
      setInciTime("");
      setSelectedLocation("");
      setSelectedType("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      setAssignments([]);
      setFiles([]);
      fileInputRef.current.value = "";
    } catch (err) {
      setErrorMessage(err.message || "Error submitting incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 2, md: 4 } }}>
      <Typography variant="h5" gutterBottom>
        Create New Incident
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                    {locations.map((loc) => (
                      <MenuItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    {types.map((t) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory("");
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth disabled={!selectedCategory}>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                  >
                    {subcategories
                      .filter((sub) => sub.category_id === selectedCategory)
                      .map((sub) => (
                        <MenuItem key={sub.id} value={sub.name}>
                          {sub.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Incident Date"
                  type="date"
                  value={inciDate}
                  onChange={(e) => setInciDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Incident Time"
                  type="time"
                  value={inciTime}
                  onChange={(e) => setInciTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Observer Description"
                  fullWidth
                  multiline
                  minRows={4}
                  value={observerDescription}
                  onChange={(e) => setObserverDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Assign Users
                </Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <Select
                    value={selectedAssignment}
                    displayEmpty
                    onChange={(e) => {
                      handleAssignmentAdd(e.target.value);
                      setSelectedAssignment("");
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select user to assign
                    </MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                  {assignments.map((id) => {
                    const user = users.find((u) => u.id === id);
                    return (
                      <Chip
                        key={id}
                        label={user?.name || "Unknown"}
                        color="primary"
                        onDelete={() => handleAssignmentRemove(id)}
                        deleteIcon={<Delete />}
                      />
                    );
                  })}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<UploadFile />}
                  component="label"
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Button>

                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {files.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<AssignmentInd />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit Incident"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Snackbar Messages */}
      <Snackbar open={!!errorMessage} autoHideDuration={4000} onClose={() => setErrorMessage("")}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage("")}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default IncidentForm;
