import React, { useState, useEffect } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import config from '../../config';

const AssignUsersComponent = () => {
  const [users, setUsers] = useState([]); // State to store fetched assignees
  const [assignments, setAssignments] = useState([]); // State to manage assignments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch assignee names from the API
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/auth`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch assignees");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data); // Store the fetched data in `users` state
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        setError(error.message); // Capture error message
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  // Add a new assignment
  const addAssignment = () => {
    setAssignments((prevAssignments) => [
      ...prevAssignments,
      {
        id: Date.now(),
        selectedUsers: [], // Initial empty selection
      },
    ]);
  };

  // Remove an assignment by ID
  const removeAssignment = (id) => {
    setAssignments((prevAssignments) =>
      prevAssignments.filter((assignment) => assignment.id !== id)
    );
  };

  // Handle user selection changes
  const handleUserChange = (id, event) => {
    const selectedValues = event.target.value; // MUI Select passes selected values here
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, selectedUsers: selectedValues }
          : assignment
      )
    );
  };

  return (
    <div>
      <h3>Assign Users</h3>

      {/* Error and Loading States */}
      {loading && <p>Loading assignees...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Display Assignments */}
      {!loading && !error && (
        <>
          {assignments.map((assignment) => (
            <Grid container spacing={2} key={assignment.id}>
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel>Assign Users</InputLabel>
                  <Select
                    name="assignedUsers"
                    multiple
                    value={assignment.selectedUsers}
                    onChange={(e) => handleUserChange(assignment.id, e)}
                    renderValue={(selected) =>
                      selected
                        .map((userId) => users.find((user) => user.id === userId)?.name || "Unknown")
                        .join(", ")
                    }
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name || `User ${user.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={addAssignment}>+</Button>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={() => removeAssignment(assignment.id)}>-</Button>
              </Grid>
            </Grid>
          ))}

          {/* Add Assignment Button */}
          <div style={{ marginTop: "1rem" }}>
            <Button variant="contained" color="primary" onClick={addAssignment}>
              Add Assignment
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignUsersComponent;
