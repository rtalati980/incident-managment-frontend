import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../../config";


export default function IncidentDetailsAction() {
  const { No } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [historyData,setHistoryData] = useState("");
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

  const fetchIncidentHistory = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/incident-history/incident/${incident.id}`, {
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
        UserID: localStorage.getItem("userId"), // Ensure UserID is included
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
  
      alert("Incident history recorded successfully!");
      navigate("/incidents");
  
    } catch (error) {
      console.error("Error creating incident history:", error);
    }
  };
  

  if (!incident) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Incident Details</h2>
      <p><strong>ID:</strong> {incident.id}</p>
      <p><strong>Description:</strong> {incident.observerDescription}</p>
      <p><strong>Reported Date:</strong> {incident.repoDate}</p>
      <p><strong>Incident Date:</strong> {incident.inciDate}</p>
      <p><strong>Incident Time:</strong> {incident.inciTime}</p>
      <p><strong>Location:</strong> {incident.workLocation}</p>

      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
        </select>
      </div>

      <div>
        <label>Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label>Assign To:</label>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          {assignees.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Comments:</label>
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
      </div>

      <button onClick={handleUpdateIncident}>Update Incident</button>
    </div>
  );
}
