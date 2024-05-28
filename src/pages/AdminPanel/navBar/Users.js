import React, { useState, useEffect } from 'react';
import './adduser.css';

export default function AddUser() {
  const [empid, setEmpid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
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
  
    // Validation checks
    if (!empid || !name || !email || !password || !role) {
      console.error('Error: Missing required fields');
      return; // Prevent form submission if any required field is missing
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
  
      setEmpid('');
      setName('');
      setEmail('');
      setRole('user');
      setPassword('');
      setEditingId(null);
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
    setPassword(user.password);
    setEditingId(id);
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
    <div className='add-user'>
      <form className='user-form' onSubmit={handleSubmit}>
        <div className='input-group'>
          <input
            placeholder='Employee ID'
            value={empid} required
            onChange={(e) => setEmpid(e.target.value)}
          />
          <input
            placeholder='Name'
            value={name} required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder='Email'
            value={email} required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder='Password'
            type='password' required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <div className='submit-group'>
          <input type='submit' value={editingId ? 'Update' : 'Submit'} />
        </div>
      </form>

      {/* Search bar */}

      <table className='user-table'>
        <thead>
          <tr>
            <th>Number</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.empid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {adminPopup && (
        <div className='popup'>
          <h2>Admin Credentials</h2>
          <p>Email: {adminPopup.email}</p>
          <p>Password: {adminPopup.password}</p>
        </div>
      )}

      {popupMessage && (
        <div className='popup'>
          <h2>User Created</h2>
          <p>{popupMessage}</p>
          <button onClick={copyPassword}>Copy Password</button>
        </div>
      )}
    </div>
  );
}
