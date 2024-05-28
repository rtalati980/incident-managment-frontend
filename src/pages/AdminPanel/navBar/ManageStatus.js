import React, { useState, useEffect } from 'react';
import './edit.css';

export default function ManageStatus() {
  const [statusName, setStatusName] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/statuses')
      .then(response => response.json())
      .then(data => setStatuses(data))
      .catch(error => console.error('Error fetching statuses:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (statusName.trim() !== '') {
      const method = editingStatusId ? 'PUT' : 'POST';
      const url = editingStatusId ? `http://localhost:5000/api/statuses/${editingStatusId}` : 'http://localhost:5000/api/statuses';
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
    fetch(`http://localhost:5000/api/statuses/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setStatuses(statuses.filter(status => status.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='Status Name' 
            value={statusName} 
            onChange={(e) => setStatusName(e.target.value)}
          />
        </div>
        <div className='sub'>
          <input type='submit' value={editingStatusId ? 'Update' : 'Submit'} />
        </div>
      </form>
      
      <table className='location-table'>
        <thead>
          <tr>
            <th>Number</th>
            <th>Status Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status, index) => (
            <tr key={status.id}>
              <td>{index + 1}</td>
              <td>{status.name}</td>
              <td>
                <button onClick={() => handleEdit(status.id, status.name)}>Edit</button>
                <button onClick={() => handleDelete(status.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
