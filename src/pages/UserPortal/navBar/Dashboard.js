import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, Divider, Chip, Stack } from '@mui/material';
import './dash.css';
import config from '../../../config';
import { AssignmentTurnedIn, PeopleAlt } from '@mui/icons-material';


export default function Dashboard() {
const reported = { total: 0, open: 0, close: 0, inProgress: 0 };
  const assigned = { total: 0, open: 0, close: 0, inProgress: 0 };

  const statusChip = (label, count, color) => (
    <Chip
      label={`${label}: ${count}`}
      color={color}
      size="small"
      variant="outlined"
      component={Link}
      to={`/user-panel/incident?status=${label}`}
      clickable
      sx={{ fontWeight: 500 }}
    />
  );
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
              {/* Incident Reported */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <AssignmentTurnedIn color="primary" />
                      <Typography variant="h6" fontWeight="600">
                        Incident Reported
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" fontWeight={500}>
                      Total: <Typography component="span" color="primary"> {incidents.length}</Typography>
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2}>
                      {statusChip('Open', statusCounts.open, 'warning')}
                      {statusChip('In Progress', statusCounts.inProgress, 'info')}
                      {statusChip('Close', statusCounts.close, 'success')}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Assigned User Incidents */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <PeopleAlt color="secondary" />
                      <Typography variant="h6" fontWeight="600">
                        Assigned User Incidents
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" fontWeight={500}>
                      Total: <Typography component="span" color="secondary">{assignedUserIncidents.length}</Typography>
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2}>
                      {statusChip('Open', assignedUserStatusCounts.open, 'warning')}
                      {statusChip('In Progress', assignedUserStatusCounts.inProgress, 'info')}
                      {statusChip('Close', assignedUserStatusCounts.close, 'success')}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
    </Box>
  );
}
