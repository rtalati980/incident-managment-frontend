import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import config from '../../../config';

export default function AddUser() {
  const [empid, setEmpid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [reporting, setReporting] = useState('');
  const [department, setDepartment] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [adminPopup, setAdminPopup] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/auth/`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${config.API_BASE_URL}/api/users/${editingId}` : `${config.API_BASE_URL}/api/auth/register`;

    if (!empid || !name || !email || !password || !role) return;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ empid, name, email, password, role, reporting, department }),
      });
      const data = await res.json();

      if (editingId) {
        setUsers(users.map(u => (u.id === editingId ? data : u)));
      } else {
        setUsers([...users, data]);
        if (role === 'admin') setAdminPopup({ email, password });
        setPopupMessage(`User created with ID: ${data.empid}`);
      }

      setEmpid('');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setReporting('');
      setDepartment('');
      setEditingId(null);
      setOpenPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEmpid(user.empid);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setReporting(user.reporting);
    setDepartment(user.department);
    setPassword(user.password);
    setEditingId(user.id);
    setOpenPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  const filteredUsers = users.filter(
    u =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        User Management
      </Typography>

      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenPopup(true)}>
        Add New User
      </Button>
     
     <Box>
      <TextField
        label="Search Users"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
</Box>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Reporting To</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.empid}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.reporting}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit User Form */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Employee ID" fullWidth value={empid} onChange={(e) => setEmpid(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Reporting To" fullWidth value={reporting} onChange={(e) => setReporting(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Department" fullWidth value={department} onChange={(e) => setDepartment(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{editingId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      {/* Admin Credential Popup */}
      <Dialog open={Boolean(adminPopup)} onClose={() => setAdminPopup(null)}>
        <DialogTitle>Admin Credentials</DialogTitle>
        <DialogContent>
          <Typography>Email: {adminPopup?.email}</Typography>
          <Typography>Password: {adminPopup?.password}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={copyPassword} color="primary">Copy Password</Button>
          <Button onClick={() => setAdminPopup(null)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* General Popup */}
      <Dialog open={Boolean(popupMessage)} onClose={() => setPopupMessage('')}>
        <DialogTitle>User Created</DialogTitle>
        <DialogContent>
          <Typography>{popupMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={copyPassword} color="primary">Copy Password</Button>
          <Button onClick={() => setPopupMessage('')} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
