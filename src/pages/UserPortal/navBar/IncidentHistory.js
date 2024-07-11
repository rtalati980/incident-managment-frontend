import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './table.css';

const IncidentHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  useEffect(() => {
    const fetchIncidentHistory = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('JWT token not found');
        }

        const response = await fetch('http://localhost:5000/api/incident-history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch incident history: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (statusFilter) {
          const filteredData = data.filter(record => record.NewStatus === statusFilter);
          console.log('Filtered data:', filteredData);
          setHistoryData(filteredData);
        } else {
          setHistoryData(data);
        }
      } catch (error) {
        console.error('Error fetching incident history:', error);
      }
    };

    fetchIncidentHistory();
  }, [statusFilter]);

  return (
    <div>
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
};

export default IncidentHistory;
