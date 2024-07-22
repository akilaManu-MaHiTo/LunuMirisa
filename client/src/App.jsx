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
        <Route path='/UserHome' element={<UserHome />} /> {/* Add :userId */}
        <Route path='/AdminPage' element={<AdminPage />} />
        <Route path='/Session' element={<Session />} />
        <Route path='/UserProfile/:userId' element={<Profile />} />
        <Route path='/AddMenuList' element={<AddMenuList />} />
        <Route path='/ShowMenuList' element={<ShowMenuList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
