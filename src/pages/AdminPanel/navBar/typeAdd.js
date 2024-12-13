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
  Typography,
  Box,
} from '@mui/material';
import config from  '../../../config';

export default function TypeAdd() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/types`)
      .then((response) => response.json())
      .then((data) => setTypes(data))
      .catch((error) => console.error('Error fetching types:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${config.API_BASE_URL}/api/types/${editingId}`
      : `${config.API_BASE_URL}/api/types`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingId) {
          setTypes(types.map((type) => (type.id === editingId ? data : type)));
        } else {
          setTypes([...types, data]);
        }
        setName('');
        setEditingId(null);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleEdit = (id) => {
    const type = types.find((type) => type.id === id);
    setName(type.name);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    fetch(`$API_BASE_URL/api/types/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTypes(types.filter((type) => type.id !== id));
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Type of Incident
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 3 }}
      >
        <TextField
          label="Type"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          {editingId ? 'Update' : 'Submit'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type, index) => (
              <TableRow key={type.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(type.id)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(type.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
