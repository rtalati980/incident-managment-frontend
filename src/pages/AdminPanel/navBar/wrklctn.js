import React, { useState, useEffect } from 'react';
import './edit.css';
import Select from 'react-select';

export default function Wrklctn() {
  const [name, setName] = useState('');
  const [bayType, setBayType] = useState('');
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user

  useEffect(() => {
    fetchLocations();
    fetchUsers();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wrklctns');
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const locationData = await response.json();

      // Fetch user details for each location's UserID
      const locationsWithUser = await Promise.all(
        locationData.map(async location => {
          if (location.UserID) {
            const userResponse = await fetch(`http://localhost:5000/api/auth/${location.UserID}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              location.appointedUser = userData;
              console.log(location.appointedUser[0].name);
            }
            console.log(location.UserID);
          }
          return location;
         
        })
      );

      setLocations(locationsWithUser);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const userData = await response.json();

      const userOptions = userData.map(user => ({
        value: user.id,
        label: `${user.name} (${user.email})`
      }));

      setUsers(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/wrklctns/${editingId}` : 'http://localhost:5000/api/wrklctns';
    
    const requestBody = {
      name,
      bayType,
      UserID: selectedUser ? selectedUser.value : null // Check if selectedUser is not null before accessing its value
    };

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      if (editingId) {
        setLocations(locations.map(loc => loc.id === editingId ? data : loc));
      } else {
        setLocations([...locations, data]);
      }
      setName('');
      setBayType('');
      setSelectedUser(null); // Reset selected user after submission
      setEditingId(null);
    })
    .catch(error => console.error('Error:', error));
  };

  const handleEdit = (id) => {
    const location = locations.find(loc => loc.id === id);
    setName(location.name);
    setBayType(location.bayType);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/wrklctns/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setLocations(locations.filter(loc => loc.id !== id));
    })
    .catch(error => console.error('Error:', error));
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='Bay' 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            placeholder='Bay Type' 
            value={bayType} 
            onChange={(e) => setBayType(e.target.value)}
          />
          <Select
            options={users}
            onChange={handleUserSelect}
            placeholder="Select a user..."
            isSearchable
          />
        </div>
        <div className='sub'>
          <input type='submit' value={editingId ? 'Update' : 'Submit'} />
        </div>
      </form>
      
      <table className='location-table'>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Bay Type</th>
            <th>Appointed User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr key={location.id}>
              <td>{index + 1}</td>
              <td>{location.name}</td>
              <td>{location.bayType}</td>
              <td>{location.appointedUser[0] ? `${location.appointedUser[0].name} (${location.appointedUser[0].email})` : 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(location.id)}>Edit</button>
                <button onClick={() => handleDelete(location.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
