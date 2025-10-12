import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import config from "../../../config";

export default function IncidentDetailsAction() {
  const { No } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [comments, setComments] = useState("");

  useEffect(() => {
    fetchIncidentDetails();
    fetchAssignees();
  }, []);

  const fetchIncidentDetails = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("JWT token not found");

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/No/${No}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch incident details");

      const data = await response.json();
      setIncident(data);
      setStatus(data.status);
      setPriority(data.priority || "Medium");
      setAssignee(data.assignedTo);
    } catch (error) {
      console.error("Error fetching incident:", error);
    }
  };

  const fetchAssignees = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("JWT token not found");

      const response = await fetch(`${config.API_BASE_URL}/api/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch assignees");

      const data = await response.json();
      setAssignees(data);
    } catch (error) {
      console.error("Error fetching assignees:", error);
    }
  };

  const handleUpdateIncident = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("JWT token not found");

      const historyData = {
        IncidentID: incident.id,
        PreviousStatus: incident.status,
        NewStatus: status,
        PreviousAssigneeID: incident.assignedTo,
        NewAssigneeID: assignee,
        Comment: comments,
        UserID: localStorage.getItem("userId"),
      };

      const response = await fetch(`${config.API_BASE_URL}/api/incident-history`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historyData),
      });

      if (!response.ok) throw new Error("Failed to create incident history");

      alert("Incident updated successfully!");
      navigate("/user-panel/assignincdent");
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  if (!incident) return <Typography align="center" sx={{ mt: 10 }}>Loading...</Typography>;

  const statusColor = {
    OPEN: "error",
    "IN PROGRESS": "warning",
    CLOSED: "success",
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Incident Details - {incident.No}
      </Typography>
      <Grid container spacing={3}>
        {/* Left: Incident Info + Update */}
        <Grid item xs={12} md={6}>
          {/* Incident Info */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={4}>
            <Typography variant="h6" gutterBottom>Incident Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><b>ID:</b> {incident.id}</Typography>
            <Typography><b>Description:</b> {incident.observerDescription}</Typography>
            <Typography><b>Date:</b> {incident.inciDate}</Typography>
            <Typography><b>Time:</b> {incident.inciTime}</Typography>
            <Typography><b>Location:</b> {incident.workLocation}</Typography>
            <Typography><b>Category:</b> {incident.category} / {incident.subcategory}</Typography>
            <Typography>
              <b>Status:</b> <Chip label={incident.status} color={statusColor[incident.status]} size="small"/>
            </Typography>
            <Typography><b>Priority:</b> {incident.priority || "Medium"}</Typography>
          </Paper>

          {/* Update Form */}
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={4}>
            <Typography variant="h6" gutterBottom>Update Incident</Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="OPEN">OPEN</MenuItem>
                <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
                <MenuItem value="CLOSED">CLOSED</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign To</InputLabel>
              <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} label="Assign To">
                {assignees.map((user) => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleUpdateIncident}>
              Update Incident
            </Button>
          </Paper>
        </Grid>

        {/* Right: Incident History Timeline */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={4}>
            <Typography variant="h6" gutterBottom>Incident History</Typography>
            <Divider sx={{ mb: 2 }} />
            {incident.history && incident.history.length > 0 ? (
              <Timeline position="right">
                {incident.history.map((record, idx) => (
                  <TimelineItem key={record.HistoryID}>
                    <TimelineSeparator>
                      <TimelineDot color={statusColor[record.NewStatus]} />
                      {idx !== incident.history.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                        <Typography><b>Status:</b> {record.PreviousStatus} → {record.NewStatus}</Typography>
                        <Typography><b>Assignee:</b> {record.PreviousAssigneeID} → {record.NewAssigneeID}</Typography>
                        <Typography><b>Date:</b> {new Date(record.ChangeTimestamp).toLocaleString()}</Typography>
                        <Typography><b>Comment:</b> {record.Comment || "No comment"}</Typography>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Typography>No history available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
