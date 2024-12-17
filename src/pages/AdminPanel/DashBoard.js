import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { AccessAlarm, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import config from '../../config';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });
  const [error, setError] = useState(null);

  // Function to fetch incident data
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      setIncidents(data); // Update the state with fetched data
      calculateStatusCounts(data); // Calculate status counts
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setError(error.message);
    }
  }, []);

  // Function to calculate status counts
  const calculateStatusCounts = useCallback((data) => {
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
    setStatusCounts(counts);
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ padding: 2 }}>
      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {/* Card for total incidents */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                INCIDENT REPORTED
              </Typography>
              <Typography variant="h4">{incidents.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card for status counts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                STATUS
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <AccessAlarm sx={{ color: 'orange', marginRight: 1 }} />
                    <Typography variant="body1">Open: {statusCounts.open}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ color: 'green', marginRight: 1 }} />
                    <Typography variant="body1">Closed: {statusCounts.closed}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center">
                    <HourglassEmpty sx={{ color: 'yellow', marginRight: 1 }} />
                    <Typography variant="body1">In Progress: {statusCounts.inProgress}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
