import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function AddUser() {
  const [empid, setEmpid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [reporting, setReporting] = useState('');
  const [department,setDepartment]  =  useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false); // Controls the form popup visibility
  const [adminPopup, setAdminPopup] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/users/${editingId}` : 'http://localhost:5000/api/auth/register';
  
    if (!empid || !name || !email || !password || !role) {
      console.error('Error: Missing required fields');
      return;
    }
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, empid, password, role }),
      });
      const data = await response.json();
  
      if (editingId) {
        setUsers(users.map(user => user.id === editingId ? data : user));
      } else {
        setUsers([...users, data]);
        if (role === 'admin') {
          setAdminPopup({ email, password });
        }
        setPopupMessage(`User created with ID: ${data.empid} and password: ${data.password}`);
      }
  
      // Reset the form after submission
      setEmpid('');
      setName('');
      setEmail('');
      setDepartment('');
      setReporting('');
      setRole('user');
      setPassword('');
      setEditingId(null);
      setOpenPopup(false); // Close the popup after submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (id) => {
    const user = users.find(user => user.id === id);
    setEmpid(user.empid);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDepartment(user.department);
    setReporting(user.reporting);
    setPassword(user.password);
    setEditingId(id);
    setOpenPopup(true); // Open the form popup when editing
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 8;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Box className='add-user' sx={{ padding: 2 }}>
      <Button variant="contained" color="primary" onClick={() => setOpenPopup(true)} sx={{ marginBottom: 2 }}>
        Add User
      </Button>

      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Reporting To</TableCell>
                <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.empid}</TableCell>
                <TableCell>{user.name} </TableCell>
                <TableCell>{user.reporting}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user.id)} variant="outlined" color="primary" sx={{ marginRight: 1 }}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(user.id)} variant="outlined" color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Form */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>{editingId ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <form className='user-form' onSubmit={handleSubmit} noValidate>
            <TextField
              label="Employee ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
              required
            />
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
             <TextField
              label="Reporting To"
              variant="outlined"
              fullWidth
              margin="normal"
              value={reporting}
              onChange={(e) => setReporting(e.target.value)}
              required
            />
             <TextField
              label="Department"
              variant="outlined"
              fullWidth
              margin="normal"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? 'Update' : 'Submit'}
              </Button>
              <Button onClick={() => setOpenPopup(false)} color="secondary">Cancel</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Popup */}
      <Dialog open={Boolean(adminPopup)} onClose={() => setAdminPopup(null)}>
        <DialogTitle>Admin Credentials</DialogTitle>
        <DialogContent>
          <p>Email: {adminPopup?.email}</p>
          <p>Password: {adminPopup?.password}</p>
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
          <p>{popupMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={copyPassword} color="primary">Copy Password</Button>
          <Button onClick={() => setPopupMessage('')} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
