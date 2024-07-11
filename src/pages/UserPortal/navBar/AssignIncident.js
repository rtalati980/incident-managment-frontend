import React, { useState, useEffect } from 'react';
import './incidentRepo.css'; // Import the CSS file
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function AssignIncident() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isArrowUp, setIsArrowUp] = useState(true);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleArrow = () => {
    setIsArrowUp(!isArrowUp);
    setIsMenuOpen(!isMenuOpen); // Toggle the arrow state
  };

  // Function to fetch incident data
  const fetchData = async () => {
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
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data); // Update the state with fetched data
      setFilteredIncidents(data); // Initially show all incidents
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
    if (query === '') {
      setFilteredIncidents(incidents);
    } else {
      const filtered = incidents.filter(incident =>
        incident.id.toString().includes(query)
      );
      setFilteredIncidents(filtered);
    }
  };

  // Function to toggle the accordion panels
  const toggleAccordion = (index) => {
    const panel = document.getElementById(`panel-${index}`);
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  };

  // Function to handle action on an incident
  const getUserIdFromToken = (token) => {
    if (!token) return null;
  
    // Split the token into its parts
    const tokenParts = token.split('.');
  
    // Decode the payload (second part of the token)
    const payload = JSON.parse(atob(tokenParts[1]));
  
    // Extract and return the user ID from the payload
    return payload.userId;
  };
  
  const handleAction = async (incidentId, status, comments) => {
    try {
      // Prepare the data to send in the request body
      const actionData = {
        IncidentID: incidentId,
        PreviousStatus: null, // You might need to fetch these values from the current incident status and assignee
        NewStatus: status,
        PreviousAssigneeID: null,
        NewAssigneeID: null,
        Comment: comments,
        UserID: getUserIdFromToken(localStorage.getItem('jwt')), // Get the user ID from the token
      };
  
      // Implement logic to post the action data to the incident history
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }
  
      const response = await fetch(`http://localhost:5000/api/incident-history/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(actionData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update incident history');
      }
  
      console.log(`Action taken for incident with ID ${incidentId}. Status: ${status}, Comments: ${comments}`);
      
      // Optionally, you can update the UI or state here to reflect the changes.
    } catch (error) {
      console.error('Error updating incident history:', error);
    }
  };
  
  // Function to track an incident
  const handleTrack = (incidentId) => {
    // Implement tracking functionality here
    console.log(`Tracking incident with ID ${incidentId}`);
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
        <table className="incident-table">
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
              <th>Actions</th> {/* Added column for Actions */}
            </tr>
          </thead>
        </table>

        {filteredIncidents.map((incident, index) => (
          <div key={incident.id}>
            <button className="accordion" onClick={() => toggleAccordion(index)}>
              {incident.No}: {incident.workLocation} : {incident.userId}
              {isArrowUp ? (
                <ArrowDropUpIcon onClick={toggleArrow} style={{ color: 'white', marginLeft:'40px', fontSize: '40px', cursor: 'pointer' }} />
              ) : (
                <ArrowDropDownIcon onClick={toggleArrow} style={{ color: 'white', marginLeft:'40px', fontSize: '40px', cursor: 'pointer' }} />
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
                    <th>Sub Category</th>
                    <td>{incident.subcategory}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{incident.status}</td>
                  </tr>
                  <tr>
                    <th>Action Taken</th>
                    <td>{incident.actionTaken}</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <input type="text" placeholder="Status" onChange={(e) => setStatus(e.target.value)} />
                      <input type="text" placeholder="Comments" onChange={(e) => setComments(e.target.value)} />
                      <button onClick={() => handleAction(incident.id, status, comments)}>Action</button>
                      <button onClick={() => handleTrack(incident.id)}>Track</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
