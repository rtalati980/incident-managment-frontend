import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import './dash.css';
import config from '../../../config';


export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });
  const [assignedUserIncidents, setAssignedUserIncidents] = useState([]);
  const [assignedUserStatusCounts, setAssignedUserStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/id/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data);
      calculateStatusCounts(data, setStatusCounts);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const fetchAssignedUserData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/assignto/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned user incidents');
      }

      const data = await response.json();
      setAssignedUserIncidents(data);
      calculateStatusCounts(data, setAssignedUserStatusCounts);
    } catch (error) {
      console.error('Error fetching assigned user incidents:', error);
    }
  };

  const calculateStatusCounts = (data, setCounts) => {
    const counts = { open: 0, closed: 0, inProgress: 0 };
    data.forEach((incident) => {
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

  useEffect(() => {
    fetchData();
    fetchAssignedUserData();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        DASHBOARD
      </Typography>
      <Grid container spacing={3}>
        {/* Incident Reported Card */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Incident Reported</Typography>
              <Link to={`/user-panel/incident`} style={{ textDecoration: 'none' }}>
                <Typography variant="body1">Total: {incidents.length}</Typography>
              </Link>
              <Box mt={2}>
                <Typography variant="subtitle1">Status</Typography>
                <Link to={`/user-panel/incident?status=Open`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">Open: {statusCounts.open}</Typography>
                </Link>
                <Link to={`/user-panel/incident?status=Close`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">Close: {statusCounts.closed}</Typography>
                </Link>
                <Link to={`/user-panel/incident?status=InProgress`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">In Progress: {statusCounts.inProgress}</Typography>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned User Incidents Card */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Assigned User Incidents</Typography>
              <Typography variant="body1">Total: {assignedUserIncidents.length}</Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Status</Typography>
                <Link to={`/incident-history?status=Open`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">Open: {assignedUserStatusCounts.open}</Typography>
                </Link>
                <Link to={`/incident-history?status=Close`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">Close: {assignedUserStatusCounts.closed}</Typography>
                </Link>
                <Link to={`/incident-history?status=InProgress`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2">In Progress: {assignedUserStatusCounts.inProgress}</Typography>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
