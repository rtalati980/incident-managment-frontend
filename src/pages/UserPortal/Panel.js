import React from 'react';
import { Routes, Route} from 'react-router-dom';

import Header from './navBar/haeder/Header';

import AddNew from './navBar/AddNew';
import Dashboard from './navBar/Dashboard';
import IncidentRepo from './navBar/IncidentRepo';
import Profile from './navBar/Profile';
import AssignIncident from './navBar/AssignIncident';
import IncidentHistory from './navBar/IncidentHistory';
import IncidentDetail from './navBar/IncidentDetail';
import Exp from './Exp';



const UserRoutes = ({email}) => {
  return (
    <div>
      <Header />
      <Routes>
      <Route path='/'  element={<Dashboard/>}/>
      <Route path="/addNew" element={<AddNew />} />
      <Route path="/incident" element={<IncidentRepo />} />
      <Route path="/profile" element={<Profile />} />
      <Route path='/assignincdent' element={<AssignIncident />}/>
      <Route path='/incdentHistory' element ={<IncidentHistory/>}/>
      <Route path="/incident/id/:id" element={<IncidentDetail/>} />
      <Route path="/exp/"  element={<Exp/>} />
      </Routes>
    </div>
  );
};

export default UserRoutes;
