import React, { useState, useEffect } from 'react';
import '../../UserPortal/navBar/incidentRepo.css'; // Import the CSS file

export default function IncidentRepo() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [comment, setComment] = useState('');

  // Function to fetch incident data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents', {
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

  // Function to handle action button click
  const handleActionClick = (incident) => {
    setSelectedIncident(incident);
    // Reset assignee and comment when a new incident is selected
    setAssignee('');
    setComment('');
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      // Send a request to update the incident
      const response = await fetch(`http://localhost:5000/api/incidents/${selectedIncident.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: selectedStatus,
          assignee,
          comment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update incident');
      }

      // Refresh incident data
      fetchData();
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  return (
    <div>
      <div className="incident-container">
        <h2>INCIDENT REPORTS</h2>
        
        <input
          type="text"
          placeholder="Search by Ticket No."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />

        {filteredIncidents.map((incident, index) => (
          <div key={incident.id}>
            <button className="accordion" onClick={() => toggleAccordion(index)}>
              {incident.No}: {incident.workLocation} 
            </button>
            <div id={`panel-${index}`} className="panel">
              <table className="incident-table">
                <tbody>
                  <tr>
                    <th>No.</th>
                    <td>{index + 1}</td>
                  </tr>
                  <tr>
                    <th>Work Location</th>
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
                    <th>Occurrence</th>
                    <td>{incident.occurence}</td>
                  </tr>
                  <tr>
                    <th>Severity</th>
                    <td>{incident.severity}</td>
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
                    <th>Consequences Discussion</th>
                    <td>{incident.consequencesDiscussion}</td>
                  </tr>
                  <tr>
                    <th>Behavior</th>
                    <td>{incident.behavior}</td>
                  </tr>
                </tbody>
              </table>

              {/* Action form */}
              {selectedIncident === incident && (
                <form onSubmit={handleSubmit}>
                  <label>Status:</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="Resolved">Resolved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <label>Assignee:</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  />

                  <label>Comment:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button type="submit">Submit</button>
                </form>
              )}
              <button onClick={() => handleActionClick(incident)}>Action</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
