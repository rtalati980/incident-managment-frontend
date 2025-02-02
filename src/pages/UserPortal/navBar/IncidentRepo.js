import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import config from "../../../config";

const columns = [
  { field: "No", headerName: "No", width: 100 },
  { field: "observerDescription", headerName: "Observer Description", width: 200 },
  { field: "repoDate", headerName: "Reported Date", width: 130 },
  { field: "workLocation", headerName: "Work Location", width: 130 },
  { field: "inciDate", headerName: "Incident Date", width: 130 },
  { field: "inciTime", headerName: "Incident Time", width: 130 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "category", headerName: "Category", width: 120 },
  { field: "subCategory", headerName: "Subcategory", width: 120 },
  {field:"assignedUsers",hesder:"Assigned user",width:50},
  {
    field: "action",
    headerName: "Track",
    width: 100,
    renderCell: (params) => (
      <Button variant="contained" size="small" color="primary">
        <Link
          to={`/user-panel/incident/${params.row.No}`}
          style={{ color: "white", textDecoration: "none" }}
        >
          Track
        </Link>
      </Button>
    ),
  },
];

export default function IncidentRepo() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("JWT token not found");

      const response = await fetch(`${config.API_BASE_URL}/api/incidents/id/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch incidents");

      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  return (
    <Paper sx={{ height: 600,  padding: "20px  70px" }}>
      <DataGrid
        rows={incidents}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        getRowId={(row) => row.No}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
