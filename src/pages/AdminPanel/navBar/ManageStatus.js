import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import config from '../../../config';

export default function ManageStatus() {
  const [statusName, setStatusName] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/statuses`)
      .then(response => response.json())
      .then(data => setStatuses(data))
      .catch(error => console.error('Error fetching statuses:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (statusName.trim() !== '') {
      const method = editingStatusId ? 'PUT' : 'POST';
      const url = editingStatusId ? `${config.API_BASE_URL}/api/statuses/${editingStatusId}` : `${config.API_BASE_URL}/api/statuses`;
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: statusName }),
      })
        .then(response => response.json())
        .then(data => {
          if (editingStatusId) {
            setStatuses(statuses.map(status => status.id === editingStatusId ? data : status));
          } else {
            setStatuses([...statuses, data]);
          }
          setStatusName('');
          setEditingStatusId(null);
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleEdit = (id, name) => {
    setStatusName(name);
    setEditingStatusId(id);
  };

  const handleDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/statuses/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setStatuses(statuses.filter(status => status.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div className='in' style={{ marginBottom: '10px' }}>
          <TextField
            label="Status Name"
            variant="outlined"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            fullWidth
          />
        </div>
        <div className='sub'>
          <Button type="submit" variant="contained" color="primary">
            {editingStatusId ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
      
      <TableContainer component={Paper}>
        <Table className="location-table">
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Status Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statuses.map((status, index) => (
              <TableRow key={status.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{status.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(status.id, status.name)}
                    style={{ marginRight: 10 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(status.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
