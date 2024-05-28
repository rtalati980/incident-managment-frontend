import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Header from './navBar/haeder/Header';

import AddNew from './navBar/AddNew';
import Dashboard from './navBar/Dashboard';
import IncidentRepo from './navBar/IncidentRepo';
import Profile from './navBar/Profile';


const UserRoutes = ({email}) => {
  return (
    <div>
      <Header />
      <Routes>
      <Route path='/'  element={<Dashboard/>}/>
      <Route path="/addNew" element={<AddNew />} />
      <Route path="/incident" element={<IncidentRepo />} />
      <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default UserRoutes;
