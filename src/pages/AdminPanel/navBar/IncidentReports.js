import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import '../../UserPortal/navBar/incidentRepo.css';
import config from  '../../../config'; // Import the CSS file

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

      const response = await fetch(`${config.API_BASE_URL}/api/incidents`, {
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
  const handleAccordionChange = (incidentId) => {
    setSelectedIncident(selectedIncident === incidentId ? null : incidentId);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`http://localhost:5000/api/incidents/${selectedIncident}`, {
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

      fetchData(); // Refresh incident data
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  // Export incidents to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredIncidents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidents');
    XLSX.writeFile(workbook, 'incident_reports.xlsx');
  };

  return (
    <div className="incident-container">
      <Typography variant="h4" gutterBottom>Incident Reports</Typography>

      <TextField
        label="Search by Ticket No."
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      {/* Filter Option for Status */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          label="Status"
        >
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </Select>
      </FormControl>

      {/* Export Button */}
      <Button variant="contained" color="primary" onClick={exportToExcel}>
        Export to Excel
      </Button>

      {filteredIncidents.map((incident, index) => (
        <Accordion key={incident.id} expanded={selectedIncident === incident.id} onChange={() => handleAccordionChange(incident.id)}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`panel-${incident.id}`} id={`header-${incident.id}`}>
            <Typography>{incident.No}: {incident.workLocation}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>No.</strong></TableCell>
                  <TableCell><strong>Work Location</strong></TableCell>
                  <TableCell><strong>Severity</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Action Taken</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{incident.No}</TableCell>
                  <TableCell>{incident.workLocation}</TableCell>
                  <TableCell>{incident.severity}</TableCell>
                  <TableCell>{incident.status}</TableCell>
                  <TableCell>{incident.actionTaken}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Action Form */}
            {selectedIncident === incident.id && (
              <form onSubmit={handleSubmit}>
                <Typography variant="h6">Update Incident</Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </form>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
