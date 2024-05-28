import React, { useState, useEffect } from 'react';
import './dashboard.css';
import safty from '../../../src/png/safty.png'
export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });

  // Function to fetch incident data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data); // Update the state with fetched data
      calculateStatusCounts(data); // Calculate status counts
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  // Function to calculate status counts
  const calculateStatusCounts = (data) => {
    const counts = { open: 0, closed: 0, inProgress: 0 };
    data.forEach(incident => {
      if (incident.status === 'Open') {
        counts.open += 1;
      } else if (incident.status === 'Close') {
        counts.closed += 1;
      } else if (incident.status === 'InProgress') {
        counts.inProgress += 1;
      }
    });
    setStatusCounts(counts);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="card">
        <h3>INCIDENT REPORTED</h3>
        <p>Total: {incidents.length}</p>
        <div className="status-container">
          <div className="status-item">
            <h3>STATUS</h3>
            <p>Open: {statusCounts.open}</p>
            <p>Closed: {statusCounts.closed}</p>
            <p>In Progress: {statusCounts.inProgress}</p>
          </div>
        </div>
      </div>
      <div className='img-cont'>
    <img src={safty} alt='hs'/>
   </div>
    </div>
  );
}
