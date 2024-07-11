import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dash.css';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });
  const [assignedUserIncidents, setAssignedUserIncidents] = useState([]);
  const [assignedUserStatusCounts, setAssignedUserStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });

  // Function to fetch incident data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents/id/getuser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data); // Update the state with fetched data
      calculateStatusCounts(data, setStatusCounts); // Calculate status counts
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  // Function to fetch assigned user incident data
  const fetchAssignedUserData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents/assignto/getuser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned user incidents');
      }

      const data = await response.json();
      setAssignedUserIncidents(data); // Update the state with fetched data
      calculateStatusCounts(data, setAssignedUserStatusCounts); // Calculate status counts
    } catch (error) {
      console.error('Error fetching assigned user incidents:', error);
    }
  };

  // Function to calculate status counts
  const calculateStatusCounts = (data, setCounts) => {
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
    setCounts(counts);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
    fetchAssignedUserData();
  }, []);

  return (
    <div className='crd-cnt'>
      <h1>DASHBOARD</h1>
      <div className='card-cantainer'>
        <div className='card'>
          <h3>Incident Reported</h3>
          <Link to={`/user-panel/incident`}>
          <p>Total: {incidents.length}</p>
          </Link>
          <div>
            <h3>Status</h3>
            <Link to={`/user-panel/incident?status=Open`}>
              <p>Open: {statusCounts.open}</p>
            </Link>
            <Link to={`/user-panel/incident?status=Close`}>
              <p>Close: {statusCounts.closed}</p>
            </Link>
            <Link to={`/user-panel/incident?status=InProgress`}>
              <p>In Progress: {statusCounts.inProgress}</p>
            </Link>
          </div>
        </div>
        <div className='card'>
          <h3>Assigned User Incidents</h3>
          <p>Total: {assignedUserIncidents.length}</p>
          <div>
            <h3>Status</h3>
            <Link to={`/incident-history?status=Open`}>
              <p>Open: {assignedUserStatusCounts.open}</p>
            </Link>
            <Link to={`/incident-history?status=Close`}>
              <p>Close: {assignedUserStatusCounts.closed}</p>
            </Link>
            <Link to={`/incident-history?status=InProgress`}>
              <p>In Progress: {assignedUserStatusCounts.inProgress}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
