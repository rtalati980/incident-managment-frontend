import React, { useState, useEffect } from 'react';
import config from  '../../../config';

export default function ManageBehaviours() {
  const [behaviourName, setBehaviourName] = useState('');
  const [behaviours, setBehaviours] = useState([]);
  const [editingBehaviourId, setEditingBehaviourId] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/behaviours`)
      .then(response => response.json())
      .then(data => setBehaviours(data))
      .catch(error => console.error('Error fetching behaviours:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (behaviourName.trim() !== '') {
      const method = editingBehaviourId ? 'PUT' : 'POST';
      const url = editingBehaviourId ? `${config.API_BASE_URL}/api/behaviours/${editingBehaviourId}` : `${config.API_BASE_URL}/api/behaviours`;
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: behaviourName }),
      })
        .then(response => response.json())
        .then(data => {
          if (editingBehaviourId) {
            setBehaviours(behaviours.map(behaviour => behaviour.id === editingBehaviourId ? data : behaviour));
          } else {
            setBehaviours([...behaviours, data]);
          }
          setBehaviourName('');
          setEditingBehaviourId(null);
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleEdit = (id, name) => {
    setBehaviourName(name);
    setEditingBehaviourId(id);
  };

  const handleDelete = (id) => {
    fetch(`${config.API_BASE_URL}/api/behaviours/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBehaviours(behaviours.filter(behaviour => behaviour.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <form className='add' onSubmit={handleSubmit}>
        <div className='in'>
          <input 
            placeholder='Behaviour Name' 
            value={behaviourName} 
            onChange={(e) => setBehaviourName(e.target.value)}
          />
        </div>
        <div className='sub'>
          <input type='submit' value={editingBehaviourId ? 'Update' : 'Submit'} />
        </div>
      </form>
      
      <table className='location-table'>
        <thead>
          <tr>
            <th>Number</th>
            <th>Behaviour Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {behaviours.map((behaviour, index) => (
            <tr key={behaviour.id}>
              <td>{index + 1}</td>
              <td>{behaviour.name}</td>
              <td>
                <button onClick={() => handleEdit(behaviour.id, behaviour.name)}>Edit</button>
                <button onClick={() => handleDelete(behaviour.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
