import React, { useState, useEffect } from 'react';
import './edit.css';

export default function Severity() {
  const [name, setName] = useState('');
  const [severities, setSeverities] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/severities')
      .then(response => response.json())
      .then(data => setSeverities(data))
      .catch(error => console.error('Error fetching severities:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/severities/${editingId}` : 'http://localhost:5000/api/severities';
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then(response => response.json())
      .then(data => {
        if (editingId) {
          setSeverities(severities.map(severity => severity.id === editingId ? data : severity));
        } else {
          setSeverities([...severities, data]);
        }
        setName('');
        setEditingId(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (id) => {
    const severity = severities.find(severity => severity.id === id);
    setName(severity.name);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/severities/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSeverities(severities.filter(severity => severity.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='severity' 
            value={name} 
            onChange={(e) => setName(e.target.value)}
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {severities.map((severity, index) => (
            <tr key={severity.id}>
              <td>{index + 1}</td>
              <td>{severity.name}</td>
              <td>
                <button onClick={() => handleEdit(severity.id)}>Edit</button>
                <button onClick={() => handleDelete(severity.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
