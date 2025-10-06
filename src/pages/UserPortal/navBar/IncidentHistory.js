import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import config from '../../../config';

const IncidentHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(0); // DataGrid page is 0-indexed
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  const fetchIncidentHistory = async (page, pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('JWT token not found');

      // Fetch paginated data from API
      const response = await fetch(`${config.API_BASE_URL}/api/incident-history?page=${page + 1}&limit=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to fetch incident history: ${response.statusText}`);

      const data = await response.json();

      // Apply optional status filter
      const filtered = statusFilter
        ? data.incidents.filter((record) => record.NewStatus === statusFilter)
        : data.incidents;

      setHistoryData(filtered);
      setRowCount(data.totalItems); // total items for DataGrid pagination
    } catch (err) {
      console.error('Error fetching incident history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentHistory(page, pageSize);
  }, [page, pageSize, statusFilter]);

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
        getRowId={(row) => row.HistoryID}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[5, 10, 20]}
        rowCount={rowCount} // total items from backend
        pagination
        paginationMode="server" // enable server-side pagination
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
        checkboxSelection
        disableSelectionOnClick
        sx={{ '& .MuiDataGrid-cell': { whiteSpace: 'nowrap' } }}
      />
    </Box>
  );
};

export default IncidentHistory;
