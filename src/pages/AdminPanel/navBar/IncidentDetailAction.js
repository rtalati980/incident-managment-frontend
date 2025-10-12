import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import config from "../../../config";

export default function AdminIncidentDetailAction() {
  const { No, id } = useParams();
  const [incident, setIncident] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [comments, setComments] = useState("");
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    fetchIncident();
    fetchIncidentHistory();
    fetchAssignees();
  }, [No]);

  const fetchIncident = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${config.API_BASE_URL}/api/incidents/No/${No}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIncident(data);
      setStatus(data.status);
      setAssignee(data.assignedTo);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIncidentHistory = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${config.API_BASE_URL}/api/incident-history/incident/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistoryData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignees = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${config.API_BASE_URL}/api/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAssignees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = () => {
    // Call API to update status, assignee, and add comment
    console.log({ status, assignee, comments });
  };

  if (!incident) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      {/* Incident Summary */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Incident #{incident.No} - Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Bay</Typography>
            <Typography>{incident.workLocation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Type</Typography>
            <Typography>{incident.type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Category</Typography>
            <Typography>{incident.category}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Subcategory</Typography>
            <Typography>{incident.subcategory}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography>{incident.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Action Taken</Typography>
            <Typography>{incident.actionTaken}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Observer Description</Typography>
            <Typography>{incident.observerDescription}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Admin Actions */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Admin Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography>Status</Typography>
            <Select fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>Assign To</Typography>
            <Select fullWidth value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              {assignees.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>Comments</Typography>
            <TextField
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add a comment..."
              multiline
              minRows={1}
              maxRows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update Incident
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Incident History Timeline */}
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Incident History
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Timeline>
          {historyData.map((record, index) => (
            <TimelineItem key={record.HistoryID}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index !== historyData.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper sx={{ p: 2 }} elevation={2}>
                  <Typography variant="subtitle1">Status Change</Typography>
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
                    <strong>Comment:</strong> {record.Comment || "No comment"}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>
    </Box>
  );
}
