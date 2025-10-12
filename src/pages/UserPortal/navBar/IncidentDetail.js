import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import { Assignment, History, Person } from '@mui/icons-material';
import config from '../../../config';

function IncidentDetail() {
  const { No, id } = useParams();
  const [incident, setIncident] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('JWT token not found');

        const response = await fetch(`${config.API_BASE_URL}/api/incidents/No/${No}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch incident');

        const data = await response.json();
        setIncident(data);
      } catch (error) {
        console.error('Error fetching incident:', error);
      }
    };

    const fetchIncidentHistory = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('JWT token not found');

        const response = await fetch(`${config.API_BASE_URL}/api/incident-history/incident/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch incident history');

        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching incident history:', error);
      }
    };

    fetchIncident();
    fetchIncidentHistory();
  }, [No, id]);

  if (!incident) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f9fafc', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={600} color="primary.main" gutterBottom>
        Incident Details
      </Typography>

      <Grid container spacing={3}>
        {/* Incident Details Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Assignment />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  Incident #{incident.No}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {[
                ['Bay', incident.workLocation],
                ['Observer Description', incident.observerDescription],
                ['Type', incident.type],
                ['Category', incident.category],
                ['Sub Category', incident.subcategory],
                ['Status', <Chip label={incident.status} color="info" size="small" />],
                ['Action Taken', incident.actionTaken || 'N/A'],
              ].map(([label, value]) => (
                <Box key={label} display="flex" justifyContent="space-between" mb={1.2}>
                  <Typography fontWeight={500} color="text.secondary">
                    {label}:
                  </Typography>
                  <Typography sx={{ textAlign: 'right', ml: 2 }}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <History />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  Incident History
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Timeline position="right">
                {historyData.length > 0 ? (
                  historyData.map((record, index) => (
                    <TimelineItem key={record.HistoryID}>
                      <TimelineOppositeContent sx={{ flex: 0.3, pr: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(record.ChangeTimestamp).toLocaleString()}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index !== historyData.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={2} sx={{ p: 1.5, borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Status Change
                          </Typography>
                          <Typography variant="body2">
                            <strong>Previous Status:</strong> {record.PreviousStatus}
                          </Typography>
                          <Typography variant="body2">
                            <strong>New Status:</strong> {record.NewStatus}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Assignee:</strong> {record.PreviousAssigneeID} →{' '}
                            {record.NewAssigneeID}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Comment:</strong> {record.Comment || 'No comment'}
                          </Typography>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                ) : (
                  <Typography color="text.secondary" align="center">
                    No history records found.
                  </Typography>
                )}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default IncidentDetail;
