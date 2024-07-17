import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './views/Users';
import CreateUsers from './views/CreateUser';
import UpdateUsers from './views/UpdateUser';
import CreateEmployee from './views/Employees';
import AddImage from './views/AddImage';
import ShowImage from './views/ShowImages';
import LoginUser from './views/login'
import UserHome from './views/UserHome'
import AdminPage from './views/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>      
        <Route path='/' element={<Users />}></Route>
        <Route path='/create' element={<CreateUsers />}></Route>
        <Route path='/update/:id' element={<UpdateUsers />}></Route>
        <Route path='/createEmployee' element={<CreateEmployee />}></Route>
        <Route path='/addImage' element={<AddImage />}></Route>
        <Route path='/showImages' element={<ShowImage />}></Route>
        <Route path='/login' element={<LoginUser />}></Route>
        <Route path='/UserHome' element={<UserHome />}></Route>
        <Route path='/AdminPage' element={<AdminPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
