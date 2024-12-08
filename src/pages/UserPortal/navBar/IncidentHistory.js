import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch incident history: ${response.statusText}`);
        }

        const data = await response.json();

        if (statusFilter) {
          const filteredData = data.filter((record) => record.NewStatus === statusFilter);
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

  const columns = [
    { field: 'HistoryID', headerName: 'History ID', width: 150 },
    { field: 'IncidentID', headerName: 'Incident ID', width: 150 },
    { field: 'PreviousStatus', headerName: 'Previous Status', width: 200 },
    { field: 'NewStatus', headerName: 'New Status', width: 200 },
    { field: 'PreviousAssigneeID', headerName: 'Previous Assignee ID', width: 200 },
    { field: 'NewAssigneeID', headerName: 'New Assignee ID', width: 200 },
    { 
      field: 'ChangeTimestamp', 
      headerName: 'Change Date', 
      width: 200, 
      valueGetter: (params) => new Date(params.row.ChangeTimestamp).toLocaleString(),
    },
    { field: 'Comment', headerName: 'Comment', width: 300 },
    { field: 'UserID', headerName: 'User ID', width: 150 },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Incident History
      </Typography>
      <DataGrid
        rows={historyData}
        columns={columns}
        getRowId={(row) => row.HistoryID} // Specify unique identifier
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            whiteSpace: 'nowrap',
          },
        }}
      />
    </Box>
  );
};

export default IncidentHistory;
