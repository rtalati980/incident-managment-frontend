import React, { useState, useEffect } from 'react';
import config from '../../../config';

export default function ManageRepeated() {
  const [repeatedName, setRepeatedName] = useState('');
  const [repeateds, setRepeateds] = useState([]);
  const [editingRepeatedId, setEditingRepeatedId] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/repeateds`)
      .then(response => response.json())
      .then(data => setRepeateds(data))
      .catch(error => console.error('Error fetching repeateds:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (repeatedName.trim() !== '') {
      const method = editingRepeatedId ? 'PUT' : 'POST';
      const url = editingRepeatedId ? `${config.API_BASE_URL}/api/repeateds/${editingRepeatedId}` : `${config.API_BASE_URL}/api/repeateds`;
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: repeatedName }),
      })
        .then(response => response.json())
        .then(data => {
          if (editingRepeatedId) {
            setRepeateds(repeateds.map(repeated => repeated.id === editingRepeatedId ? data : repeated));
          } else {
            setRepeateds([...repeateds, data]);
          }
          setRepeatedName('');
          setEditingRepeatedId(null);
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleEdit = (id, name) => {
    setRepeatedName(name);
    setEditingRepeatedId(id);
  };

  const handleDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/repeateds/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setRepeateds(repeateds.filter(repeated => repeated.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='Repeated Name' 
            value={repeatedName} 
            onChange={(e) => setRepeatedName(e.target.value)}
          />
        </div>
        <div className='sub'>
          <input type='submit' value={editingRepeatedId ? 'Update' : 'Submit'} />
        </div>
      </form>
      
      <table className='location-table'>
        <thead>
          <tr>
            <th>Number</th>
            <th>Repeated Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {repeateds.map((repeated, index) => (
            <tr key={repeated.id}>
              <td>{index + 1}</td>
              <td>{repeated.name}</td>
              <td>
                <button onClick={() => handleEdit(repeated.id, repeated.name)}>Edit</button>
                <button onClick={() => handleDelete(repeated.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
