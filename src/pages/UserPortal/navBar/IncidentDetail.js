import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './table.css';

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
            'Authorization': `Bearer ${token}`
          }
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
            'Authorization': `Bearer ${token}`
          }
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

      <h2>Incident History</h2>
      <table className="incident-table">
        <thead>
          <tr>
            <th>History ID</th>
            <th>Incident ID</th>
            <th>Previous Status</th>
            <th>New Status</th>
            <th>Previous Assignee ID</th>
            <th>New Assignee ID</th>
            <th>Change Date</th>
            <th>Comment</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((record) => (
            <tr key={record.HistoryID}>
              <td>{record.HistoryID}</td>
              <td>{record.IncidentID}</td>
              <td>{record.PreviousStatus}</td>
              <td>{record.NewStatus}</td>
              <td>{record.PreviousAssigneeID}</td>
              <td>{record.NewAssigneeID}</td>
              <td>{new Date(record.ChangeTimestamp).toLocaleString()}</td>
              <td>{record.Comment}</td>
              <td>{record.UserID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentDetail;
