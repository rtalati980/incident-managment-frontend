import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Paper, Typography } from '@mui/material';
import './incidentRepo.css';

function IncidentDetail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('JWT token not found');
        }

        const response = await fetch(`http://localhost:5000/api/incidents/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch incident');
        }

        const data = await response.json();
        setIncident(data);
      } catch (error) {
        console.error('Error fetching incident:', error);
      }
    };

    const fetchIncidentHistory = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('JWT token not found');
        }

        const response = await fetch(`http://localhost:5000/api/incident-history/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch incident history');
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching incident history:', error);
      }
    };

    fetchIncident();
    fetchIncidentHistory();
  }, [id]);

  if (!incident) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Incident Detail - {incident.No}</h2>
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

      <h2>Incident History Timeline</h2>
      <Timeline>
        {historyData.map((record, index) => (
          <TimelineItem key={record.HistoryID}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index !== historyData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} style={{ padding: '10px' }}>
                <Typography variant="h6">Status Change</Typography>
                <Typography>
                  <strong>Previous Status:</strong> {record.PreviousStatus}
                </Typography>
                <Typography>
                  <strong>New Status:</strong> {record.NewStatus}
                </Typography>
                <Typography>
                  <strong>Assignee:</strong> {record.PreviousAssigneeID} → {record.NewAssigneeID}
                </Typography>
                <Typography>
                  <strong>Change Date:</strong> {new Date(record.ChangeTimestamp).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Comment:</strong> {record.Comment || 'No comment'}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

export default IncidentDetail;
