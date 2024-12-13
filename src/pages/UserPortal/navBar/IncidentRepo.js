import React, { useState, useEffect } from 'react';
import './incidentRepo.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import config from '../../../config';

export default function IncidentRepo() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openPanels, setOpenPanels] = useState({});
  
  // Function to fetch incident data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/id/getuser`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();

      // Update the state with fetched data
      setIncidents(data);
      setFilteredIncidents(data); // Initially show all incidents

      // Fetch additional data for each incident
      const updatedData = await Promise.all(data.map(async incident => {
        // Fetch workLocation data
        const workLocationResponse = await fetch(`${config.API_BASE_URL}/api/workLocations/name/${incident.workLocation}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const workLocationData = await workLocationResponse.json();
        
        // Fetch user data
        const userResponse = await fetch(`${config.API_BASE_URL}/api/auth/id/${incident.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();
      
        return {
          ...incident,
          workLocationType: workLocationData.type,
          username: userData.username,
          email: userData.email
        };
      }));

      setIncidents(updatedData);
      setFilteredIncidents(updatedData);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterIncidents(query, statusFilter);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterIncidents(searchQuery, status);
  };

  const filterIncidents = (query, status) => {
    let filtered = incidents;

    if (query) {
      filtered = filtered.filter(incident => incident.id.toString().includes(query));
    }

    if (status) {
      filtered = filtered.filter(incident => incident.status === status);
    }

    setFilteredIncidents(filtered);
  };

  // Function to toggle the accordion panels
  const toggleAccordion = (index) => {
    setOpenPanels(prevOpenPanels => ({
      ...prevOpenPanels,
      [index]: !prevOpenPanels[index]
    }));
  };

  return (
    <div>
      <div className="incident-container">
        <h2>Incident Data</h2>
        
        <input
          type="text"
          placeholder="Search by Ticket No."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        
        <select value={statusFilter} onChange={handleStatusChange} className="status-select">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Close">Closed</option>
          <option value="in progress">In Progress</option>
        </select>

        {filteredIncidents.map((incident, index) => (
          <div key={incident.id}>
            <button className="accordion" onClick={() => toggleAccordion(index)}>
              {incident.No}: {incident.workLocation} 
              {openPanels[index] ? (
                <ArrowDropUpIcon style={{ color: 'white', marginLeft:'40px', fontSize: '40px', cursor: 'pointer' }} />
              ) : (
                <ArrowDropDownIcon style={{ color: 'white', marginLeft:'40px', fontSize: '40px', cursor: 'pointer' }} />
              )}
            </button>
            <div id={`panel-${index}`} className="panel" style={{ display: openPanels[index] ? 'block' : 'none' }}>
              <table className="incident-details-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Bay</th>
                    <th>Observer Description</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Status</th>
                    <th>Action Taken</th>
                    <th>Work Location Type</th>
                    <th>Username</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{incident.No}</td>
                    <td>{incident.workLocation}</td>
                    <td>{incident.observerDescription}</td>
                    <td>{incident.type}</td>
                    <td>{incident.category}</td>
                    <td>{incident.subcategory}</td>
                    <td>{incident.status}</td>
                    <td>{incident.actionTaken}</td>
                    <td>{incident.workLocationType}</td>
                    <td>{incident.username}</td>
                    <td>{incident.email}</td>
                  </tr>
                </tbody>
              </table>
              <Link to={`/user-panel/incident/id/${incident.id}`} className="track-button">
                Track
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
