import React, { useState, useEffect } from 'react';
import './incidentRepo.css'; // Import the CSS file
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import config from '../../../config';

export default function AssignIncident() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isArrowUp, setIsArrowUp] = useState(true);
  const [statusOptions] = useState(['OPEN', 'CLOSED', 'IN PROGRESS']);
  const [assignees, setAssignees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [comments, setComments] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle arrow state
  const toggleArrow = () => {
    setIsArrowUp(!isArrowUp);
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch incidents data
  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/assignto/getuser`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data);
      setFilteredIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  // Fetch assignees data
  const fetchAssignees = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}api/auth`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignees');
      }

      const data = await response.json();
      setAssignees(data);
    } catch (error) {
      console.error('Error fetching assignees:', error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchIncidents();
    fetchAssignees();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === '') {
      setFilteredIncidents(incidents);
    } else {
      const filtered = incidents.filter(incident =>
        incident.id.toString().includes(query)
      );
      setFilteredIncidents(filtered);
    }
  };

  // Handle action
  const handleAction = async (incidentId) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const actionData = {
        IncidentID: incidentId,
        NewStatus: selectedStatus,
        NewAssigneeID: selectedAssignee,
        Comment: comments,
      };

      const response = await fetch(`${config.API_BASE_URL}api/incident-history/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) {
        throw new Error('Failed to update incident history');
      }

      console.log(`Action taken for incident with ID ${incidentId}`);
    } catch (error) {
      console.error('Error updating incident history:', error);
    }
  };

  return (
    <div className="incident-container">
      <h2>Incident Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Ticket No."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Incident List */}
      <table className="incident-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Bay</th>
            <th>Observer Description</th>
            <th>Type</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>

      {filteredIncidents.map((incident, index) => (
        <div key={incident.id}>
          <button className="accordion" onClick={() => toggleArrow(index)}>
            {incident.id}: {incident.workLocation} : {incident.userId}
            {isArrowUp ? (
              <ArrowDropUpIcon style={{ color: 'white', fontSize: '40px', cursor: 'pointer' }} />
            ) : (
              <ArrowDropDownIcon style={{ color: 'white', fontSize: '40px', cursor: 'pointer' }} />
            )}
          </button>
          <div id={`panel-${index}`} className="panel">
            <table className="incident-table">
              <tbody>
                <tr>
                  <th>No.</th>
                  <td>{incident.id}</td>
                </tr>
                <tr>
                  <th>Bay</th>
                  <td>{incident.workLocation}</td>
                </tr>
                <tr>
                  <th>Observer Description</th>
                  <td>{incident.observerDescription}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{incident.type}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{incident.category}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{incident.status}</td>
                </tr>
              </tbody>
            </table>
            {/* Dropdowns and Action */}
            <div className="action-container">
              <select onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select onChange={(e) => setSelectedAssignee(e.target.value)} value={selectedAssignee}>
                <option value="">Select Assignee</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Comments"
                onChange={(e) => setComments(e.target.value)}
                value={comments}
              />

              <button onClick={() => handleAction(incident.id)}>Take Action</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
