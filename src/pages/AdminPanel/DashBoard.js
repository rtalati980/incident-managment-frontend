import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import config from '../../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, closed: 0, inProgress: 0 });
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({ mostFrequentDay: '', mostReportedCategory: '', statusCounts: {} });

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
      setIncidents(data);
      calculateAnalytics(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setError(error.message);
    }
  }, []);

  // Function to analyze incident data
  const calculateAnalytics = useCallback((data) => {
    const dateCounts = {};
    const categoryCounts = {};
    const statusCounts = { Open: 0, Closed: 0, InProgress: 0 };

    data.forEach((incident) => {
      dateCounts[incident.inciDate] = (dateCounts[incident.inciDate] || 0) + 1;
      categoryCounts[incident.category] = (categoryCounts[incident.category] || 0) + 1;
      if (statusCounts[incident.status] !== undefined) {
        statusCounts[incident.status] += 1;
      }
    });

    const mostFrequentDay = Object.keys(dateCounts).reduce((a, b) => (dateCounts[a] > dateCounts[b] ? a : b), '');
    const mostReportedCategory = Object.keys(categoryCounts).reduce((a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b), '');

    setAnalytics({ mostFrequentDay, mostReportedCategory, statusCounts });
    setStatusCounts(statusCounts);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bar Chart for Incidents by Date
  const barData = {
    labels: Object.keys(analytics.statusCounts),
    datasets: [
      {
        label: 'Incidents by Status',
        data: Object.values(analytics.statusCounts),
        backgroundColor: ['#FFA500', '#008000', '#FFD700'],
      },
    ],
  };

  // Pie Chart for Status Distribution
  const pieData = {
    labels: ['Open', 'Closed', 'In Progress'],
    datasets: [
      {
        data: [statusCounts.Open, statusCounts.Closed, statusCounts.InProgress],
        backgroundColor: ['#FFA500', '#008000', '#FFD700'],
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {/* Incident Summary Cards */}
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
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Frequent Incident Day
              </Typography>
              <Typography variant="h5">{analytics.mostFrequentDay}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Reported Category
              </Typography>
              <Typography variant="h5">{analytics.mostReportedCategory}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Incidents by Status
              </Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status Distribution
              </Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}