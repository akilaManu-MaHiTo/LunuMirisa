import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './views/Users';
import CreateUsers from './views/CreateUser';
import UpdateUsers from './views/UpdateUser';
import CreateEmployee from './views/Employees';
import AddImage from './views/AddImage';
import ShowImage from './views/ShowImages';
import LoginUser from './views/login'; // Ensure the path is correct
import UserHome from './views/UserHome';
import AdminPage from './views/AdminPage';
import Session from './views/Session';
import Profile from './views/UserProfile';
import AddMenuList from './views/AddMenuList';
import ShowMenuList from './views/ShowMenuList';
import Inventory from './views/Inventory';
import ShowInventory from './views/ShowInventory';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/create' element={<CreateUsers />} />
        <Route path='/update/:id' element={<UpdateUsers />} />
        <Route path='/createEmployee' element={<CreateEmployee />} />
        <Route path='/addImage' element={<AddImage />} />
        <Route path='/showImages' element={<ShowImage />} />
        <Route path='/login' element={<LoginUser />} />
        <Route path='/UserHome/:userId' element={<UserHome />} /> {/* Add :userId */}
        <Route path='/AdminPage' element={<AdminPage />} />
        <Route path='/Session' element={<Session />} />
        <Route path='/UserProfile/:userId' element={<Profile />} />
        <Route path='/AddMenuList' element={<AddMenuList />} />
        <Route path='/ShowMenuList/:userId' element={<ShowMenuList />} />
        <Route path='/Inventory' element={<Inventory />} />
        <Route path='/ShowInventory' element={<ShowInventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
