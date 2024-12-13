import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from '@mui/material';
import config from  '../../../config';

export default function ManageEntities() {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${config.API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const fetchSubcategories = () => {
    fetch(`${config.API_BASE_URL}/api/subcategories`)
      .then((response) => response.json())
      .then((data) => setSubcategories(data))
      .catch((error) => console.error('Error fetching subcategories:', error));
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    if (categoryName.trim() !== '') {
      const method = editingCategoryId ? 'PUT' : 'POST';
      const url = editingCategoryId
        ? `${config.API_BASE_URL}/api/categories/${editingCategoryId}`
        : `${config.API_BASE_URL}/api/categories`;

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingCategoryId) {
            setCategories((prev) =>
              prev.map((category) =>
                category.id === editingCategoryId ? data : category
              )
            );
          } else {
            setCategories((prev) => [...prev, data]);
          }
          setCategoryName('');
          setEditingCategoryId(null);
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const handleSubcategorySubmit = (event) => {
    event.preventDefault();
    if (subcategoryName.trim() !== '' && selectedCategoryId.trim() !== '') {
      const method = editingSubcategoryId ? 'PUT' : 'POST';
      const url = editingSubcategoryId
        ? `${config.API_BASE_URL}/api/subcategories/${editingSubcategoryId}`
        : `${config.API_BASE_URL}/api/subcategories`;

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subcategoryName,
          category_id: selectedCategoryId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingSubcategoryId) {
            setSubcategories((prev) =>
              prev.map((subcategory) =>
                subcategory.id === editingSubcategoryId ? data : subcategory
              )
            );
          } else {
            setSubcategories((prev) => [...prev, data]);
          }
          setSubcategoryName('');
          setSelectedCategoryId('');
          setEditingSubcategoryId(null);
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const handleCategoryEdit = (id, name) => {
    setEditingCategoryId(id);
    setCategoryName(name);
  };

  const handleSubcategoryEdit = (id, name, categoryId) => {
    setEditingSubcategoryId(id);
    setSubcategoryName(name);
    setSelectedCategoryId(categoryId);
  };

  const handleCategoryDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCategories((prev) => prev.filter((category) => category.id !== id));
        setSubcategories((prev) =>
          prev.filter((subcategory) => subcategory.category_id !== id)
        );
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleSubcategoryDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/subcategories/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSubcategories((prev) =>
          prev.filter((subcategory) => subcategory.id !== id)
        );
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Manage Categories and Subcategories
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h6">Category Management</Typography>
        <form onSubmit={handleCategorySubmit}>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              {editingCategoryId ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleCategoryEdit(category.id, category.name)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleCategoryDelete(category.id)}
                      style={{ marginLeft: 8 }}
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

      <Box>
        <Typography variant="h6">Subcategory Management</Typography>
        <form onSubmit={handleSubcategorySubmit}>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              {editingSubcategoryId ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Subcategory Name</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subcategories.map((subcategory, index) => (
                <TableRow key={subcategory.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>
                    {
                      categories.find((cat) => cat.id === subcategory.category_id)
                        ?.name || 'Unknown'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleSubcategoryEdit(
                          subcategory.id,
                          subcategory.name,
                          subcategory.category_id
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        handleSubcategoryDelete(subcategory.id)
                      }
                      style={{ marginLeft: 8 }}
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
    </Container>
  );
}
