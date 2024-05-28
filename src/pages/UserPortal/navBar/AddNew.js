import React, { useState, useEffect } from 'react';
import './table.css';
import {jwtDecode} from 'jwt-decode';

export default function IncidentForm() {
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [incidentNumber, setIncidentNumber] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [assignments, setAssignments] = useState([{ id: Date.now(), selectedUsers: [] }]);
  const [files, setFiles] = useState([{ id: Date.now(), file: null }]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/wrklctns').then(response => response.json()),
      fetch('http://localhost:5000/api/types').then(response => response.json()),
      fetch('http://localhost:5000/api/categories').then(response => response.json()),
      fetch('http://localhost:5000/api/subcategories').then(response => response.json()),
      fetch('http://localhost:5000/api/auth').then(response => response.json()) // Fetch users from API
    ])
      .then(([locationsData, typesData, categoriesData, subcategoriesData, usersData]) => {
        setLocations(locationsData);
        setTypes(typesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setUsers(usersData);
        console.log('Fetched data:', { locationsData, typesData, categoriesData, subcategoriesData, usersData });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setErrorMessage('Error fetching data');
      });
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('JWT token not found');
      }

      const response = await fetch('http://localhost:5000/api/incidents/id/getuser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const data = await response.json();
      console.log('Fetched incidents:', data); // Debug: Log the fetched data
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setErrorMessage('Error fetching incidents');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('jwt');
    if (!token) {
      setErrorMessage('JWT token not found');
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      setErrorMessage('Error decoding JWT token: ' + error.message);
      return;
    }

    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Convert assignedUsers to an array of integers
    const assignedUsersArray = assignments.map(assignment => assignment.selectedUsers.map(Number));
    formDataObject.assignedUsers = assignedUsersArray.flat();

    formDataObject.userId = userId;

    try {
      const response = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataObject)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const responseData = await response.json();
      const incidentNo = responseData.No; // Assuming the incident number key is 'No' in the response data
      setIncidentNumber(incidentNo);

      console.log(incidentNo);
      setIsPopupVisible(true);
      fetchData();
    } catch (error) {
      setErrorMessage('Error submitting form: ' + error.message);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const addAssignment = () => {
    setAssignments([...assignments, { id: Date.now(), selectedUsers: [] }]);
  };

  const removeAssignment = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleUserChange = (id, selectedOptions) => {
    const selectedValues = Array.from(selectedOptions).map(option => option.value);
    setAssignments(assignments.map(assignment =>
      assignment.id === id ? { ...assignment, selectedUsers: selectedValues } : assignment
    ));
  };

  

  const handleFileChange = (id, file) => {
    setFiles(files.map(fileObj =>
      fileObj.id === id ? { ...fileObj, file } : fileObj
    ));
  };

  const addFile = () => {
    setFiles([...files, { id: Date.now(), file: null }]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(fileObj => fileObj.id !== id));
  };

  return (
    <div className='incident-form-container'>
      <form onSubmit={handleSubmit}>
        <div className='form-row'>
          <div className='form-group'>
            <label>Bay:</label>
            <select name="workLocation">
              <option value="">select</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Type:</label>
            <select name="type">
              <option value="">select</option>
              {types.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Category:</label>
            <select name='category'>
              <option value="">select</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Sub Category:</label>
            <select name='subcategory'>
              <option value="">select</option>
           {/*   {subcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
              ))} */}
            </select>
          </div>
        </div>
        <div className='second-row'>
          <div className='form-group full-width'>
            <label>Observer Description:</label>
            <input name='observerDescription' type="text" maxLength={100} />
          </div>
          <div className='form-group half-width'>
            <label>Incident Date:</label>
            <input name='inciDate' type="date" />
          </div>
          <div className='form-group half-width'>
            <label>Incident Time:</label>
            <input name='inciTime' type="time" />
          </div>
        </div>
        <div className='form-group'>
          <label>Assign Users:</label>
          <div id="assignmentsContainer">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment">
                <select
                  name="assignedUsers"
                  onChange={(e) => handleUserChange(assignment.id, e.target.selectedOptions)}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.id}</option>
                  ))}
                </select>
                <button type="button" onClick={addAssignment}>+</button>
                <button type="button" onClick={() => removeAssignment(assignment.id)}>-</button>
              </div>
            ))}
          </div>
        </div>
        <div className='form-group'>
          <label>Action Taken (Optional):</label>
          <input name='actionTaken' type="text" maxLength={100} />
        </div>
        <div className='form-group'>
          <label>Attach Files (Optional):</label>
          <div id="filesContainer">
            {files.map(fileObj => (
              <div key={fileObj.id} className="file-upload">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(fileObj.id, e.target.files[0])}
                />
                <button type="button" onClick={addFile}>+</button>
                <button type="button" onClick={() => removeFile(fileObj.id)}>-</button>
              </div>
            ))}
          </div>
        </div>
       
        <div style={{ textAlign: 'center' }}>
          <button type="submit">Submit</button>
        </div>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>Incident Submitted Successfully</h2>
            <p>Your incident number is: {incidentNumber}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
