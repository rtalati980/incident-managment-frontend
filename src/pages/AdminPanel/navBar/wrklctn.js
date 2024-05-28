import React, { useState, useEffect } from 'react';
import './edit.css';

export default function Wrklctn() {
  const [name, setName] = useState('');
  const [bayOwner, setBayOwner] = useState('');
  const [bayType, setBayType] = useState('');
  const [bayOwnerEmail, setBayOwnerEmail] = useState('');
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/wrklctns')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/wrklctns/${editingId}` : 'http://localhost:5000/api/wrklctns';
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, bayOwner, bayType, bayOwnerEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (editingId) {
          setLocations(locations.map(loc => loc.id === editingId ? data : loc));
        } else {
          setLocations([...locations, data]);
        }
        setName('');
        setBayOwner('');
        setBayType('');
        setBayOwnerEmail('');
        setEditingId(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (id) => {
    const location = locations.find(loc => loc.id === id);
    setName(location.name);
    setBayOwner(location.bayOwner);
    setBayType(location.bayType);
    setBayOwnerEmail(location.bayOwnerEmail);
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
            placeholder='Bay Owner' 
            value={bayOwner} 
            onChange={(e) => setBayOwner(e.target.value)}
          />
          <input 
            placeholder='Bay Type' 
            value={bayType} 
            onChange={(e) => setBayType(e.target.value)}
          />
          <input 
            placeholder='Bay Owner Email' 
            value={bayOwnerEmail} 
            onChange={(e) => setBayOwnerEmail(e.target.value)}
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
            <th>Bay Owner</th>
            <th>Bay Type</th>
            <th>Bay Owner Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr key={location.id}>
              <td>{index + 1}</td>
              <td>{location.name}</td>
              <td>{location.bayOwner}</td>
              <td>{location.bayType}</td>
              <td>{location.bayOwnerEmail}</td>
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
