import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './navBar/header/Header';
import Wrklctn from './navBar/wrklctn';
import TypeAdd from './navBar/typeAdd';
import Severity from './navBar/Severity';
import ManageEntities from './navBar/ManageEntities';
import ManageStatus from './navBar/ManageStatus';
import ManageRepeated from './navBar/ManageRepeated';
import ManageBehaviours from './navBar/ManageBehaviours';
import IncidentReports from './navBar/IncidentReports';
import Dashboard from './DashBoard';
import Profile from './navBar/Profile';
import AddUser from './navBar/Users';

const UserRoutes = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wrklctn" element={<Wrklctn />} />
        <Route path="/typeAdd" element={<TypeAdd />} />
        <Route path="/severity" element={<Severity />} />
        <Route path="/manageEntities" element={<ManageEntities />} />
        <Route path="/manageSatus" element={<ManageStatus />} />
        <Route path="/manageRepeated" element={<ManageRepeated />} />
        <Route path="/manageBehaviours" element={<ManageBehaviours />} />
        <Route path="/inciReports" element={<IncidentReports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/user' element={<AddUser/>}/>
      </Routes>
    </div>
  );
};

export default UserRoutes;
