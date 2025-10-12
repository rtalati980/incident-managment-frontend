import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../../config';

const IncidentHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(0);
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

      const response = await fetch(
        `${config.API_BASE_URL}/api/incident-history?page=${page + 1}&limit=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Failed to fetch incident history');

      const data = await response.json();
      const filtered = statusFilter
        ? data.incidents.filter((record) => record.NewStatus === statusFilter)
        : data.incidents;

      setHistoryData(filtered);
      setRowCount(data.totalItems);
    } catch (err) {
      console.error('Error fetching incident history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentHistory(page, pageSize);
  }, [page, pageSize, statusFilter]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'warning';
      case 'in progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'primary';
    }
  };

  const columns = [
    { field: 'HistoryID', headerName: 'History ID', width: 130 },
    { field: 'IncidentID', headerName: 'Incident ID', width: 130 },
    {
      field: 'PreviousStatus',
      headerName: 'Previous Status',
      width: 180,
      renderCell: (params) => (
        <Chip label={params.value || 'N/A'} color="default" size="small" />
      ),
    },
    {
      field: 'NewStatus',
      headerName: 'New Status',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          color={statusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'PreviousAssigneeID',
      headerName: 'Previous Assignee',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'NewAssigneeID',
      headerName: 'New Assignee',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'ChangeTimestamp',
      headerName: 'Change Date',
      width: 200,
      valueGetter: (params) =>
        new Date(params.row.ChangeTimestamp).toLocaleString(),
    },
    {
      field: 'Comment',
      headerName: 'Comment',
      width: 300,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {params.value || 'No comment'}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: 'white',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Incident History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Records: {rowCount}
          </Typography>
        </Stack>

        <DataGrid
          rows={historyData}
          columns={columns}
          getRowId={(row) => row.HistoryID}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          rowsPerPageOptions={[5, 10, 20]}
          rowCount={rowCount}
          pagination
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
          components={{
            LoadingOverlay: LinearProgress,
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1976d2',
              color: '#fff',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #eee',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default IncidentHistory;
