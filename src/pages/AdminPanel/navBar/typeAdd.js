import React, { useState, useEffect } from 'react';
import './edit.css';

export default function TypeAdd() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/types')
      .then(response => response.json())
      .then(data => setTypes(data))
      .catch(error => console.error('Error fetching types:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:5000/api/types/${editingId}` : 'http://localhost:5000/api/types';

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
          setTypes(types.map(type => type.id === editingId ? data : type));
        } else {
          setTypes([...types, data]);
        }
        setName('');
        setEditingId(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (id) => {
    const type = types.find(type => type.id === id);
    setName(type.name);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/types/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTypes(types.filter(type => type.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <h1>Type Of Incident</h1>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='type' 
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
          {types.map((type, index) => (
            <tr key={type.id}>
              <td>{index + 1}</td>
              <td>{type.name}</td>
              <td>
                <button onClick={() => handleEdit(type.id)}>Edit</button>
                <button onClick={() => handleDelete(type.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
