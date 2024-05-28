import React, { useState, useEffect } from 'react';
import './incidentRepo.css'; // Import the CSS file
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function IncidentRepo() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isArrowUp, setIsArrowUp] = useState(true);
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

        {filteredIncidents.map((incident, index) => (
          <div key={incident.id}>
            <button className="accordion" onClick={() => toggleAccordion(index)}>
              {incident.No}: {incident.workLocation} 
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
                    <td>{incident.No}</td>
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
                  
                  
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
