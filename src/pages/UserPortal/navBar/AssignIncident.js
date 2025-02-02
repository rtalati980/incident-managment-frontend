import React, { useState, useEffect } from 'react';
import './incidentRepo.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import config from '../../../config';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

// Handle row click
const handleOpenRows = (row) => {
  console.log("Row clicked:", row);
};

const columns: GridColDef[] = [
  { field: "No", headerName: "No", width: 200 }, // Ensure `id` is present
  { field: "observerDescription", headerName: "Observer Description", width: 130 },
  { field: "repoDate", headerName: "Reported Date", width: 130 },
  { field: "workLocation", headerName: "Work Location", width: 90 },
  { field: "inciDate", headerName: "Incident Date", width: 100 },
  { field: "inciTime", headerName: "Incident Time", width: 90 },
  { field: "status", headerName: "Status", width: 70 },
  { field: "category", headerName: "Category", width: 60 },
  { field: "subCategory", headerName: "Sub Category", width: 60 },
  {
    field: "action",
    headerName: "Track",
    width: 100,
    renderCell: (params) => (
      <Button variant="contained" size="small" color="primary">
        <Link
          to={`/user-panel/incident/action/${params.row.No}`}
          style={{ color: "white", textDecoration: "none" }}
        >
          Track
        </Link>
      </Button>
    ),
  },
];

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
      let data = await response.json();

      // Ensure each row has a unique `id` for DataGrid
      data = data.map((item, index) => ({ id: item.id || index + 1, ...item }));

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
      const response = await fetch(`${config.API_BASE_URL}/api/auth`, {
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
      const response = await fetch(`${config.API_BASE_URL}/api/incident-history/`, {
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
    <Paper sx={{ height: 600, width: "100%", padding: "20px 70px" }}>
      <DataGrid
        rows={filteredIncidents}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
