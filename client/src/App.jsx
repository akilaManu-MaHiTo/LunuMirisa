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
import Inventory from './views/Inventory';
import ShowInventory from './views/ShowInventory';
import AddTables from './views/AddTables';
import  ShowSupplier  from './views/ShowSupplierOrder';
import CreateSupplier from './views/SupplierOrder';
import UpdateSupplier from './views/UpdateSupplierOrder';
import ManagerMenuList from './views/ManagerMenuList';
import UpdateMenuList from './views/UpdateMenuList';
import ShowMenuLists from './views/ShowMenuLists';
import EmailVerify from "./views/E-mailVerify";
import UpdateTable from "./views/UpdateTable";
import UpdateTablePage from "./views/UpdateTablePage";
import TableReservationPage from "./views/TableReservationPage";
import ReservedTables from "./views/ReservedTables";
import InOrder from "./views/InOrder";
import Navigation from "./views/Components/NavigationSignup";
import AddSupplier from "./views/AddSupplier";
import ShowSupplierProfiles from "./views/ShowSupplierProfiles";
import AddSupplierCategory  from "./views/AddSupplierCategory";
import  ShowSupplierCategory from "./views/ShowSupplierCategory";
import  UpdateSupplierCategory from "./views/UpdateSupplierCategory";
import  UserCart from "./views/UserCart";
import SupplierManagerDashBoard from "./views/SupplierManagerDashBoard";
import SupplierLogin from "./views/SignInSupplier";
import SupplierDashboard from "./views/SupplierDashboard";
import  PlaceOrderInventory from "./views/InventoryOrder";
import AddEmployeeForm from './views/AddEmployeeForm';
import EmployeeTable from './views/EmployeeTable';
import ProfilePage from './views/ProfilePage';


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
        <Route path='/ShowMenuList/:userId' element={<ShowMenuLists />} />
        <Route path='/Inventory' element={<Inventory />} />
        <Route path='/ShowInventory' element={<ShowInventory />} />
        <Route path='/AddTables' element={<AddTables />} />
        <Route path='/ShowSupplierOrder' element={<ShowSupplier />} />
        <Route path='/SupplierOrder' element={<CreateSupplier />} />
        <Route path='/UpdateSupplierOrder/:id' element={<UpdateSupplier />} />
        <Route path='/ManagerMenuList' element={<ManagerMenuList />} />
        <Route path='/UpdateMenuList/:id' element={<UpdateMenuList />} />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/UpdateTable" element={<UpdateTable/>} />
        <Route path="/UpdateTablePage/:id" element={<UpdateTablePage/>} />
        <Route path="/TableReservationPage/:userId" element={<TableReservationPage/>} />
        <Route path="/ReservedTables/:id/:userId" element={<ReservedTables/>} />
        <Route path="/InOrder" element={<InOrder/>} />
        <Route path="/Navigation" element={<Navigation/>} />
        <Route path="/AddSupplier" element={<AddSupplier/>} />
        <Route path="/ShowSupplierProfiles" element={<ShowSupplierProfiles/>} />
        <Route path="/AddSupplierCategory" element={<AddSupplierCategory/>} />
        <Route path="/ShowSupplierCategory" element={<ShowSupplierCategory/>} />
        <Route path="/UpdateSupplierCategory/:id" element={<UpdateSupplierCategory/>} />
        <Route path="/UserCart/:userId" element={<UserCart/>} />
        <Route path='/SignInSupplier' element={<SupplierLogin />} />
        <Route path='/SupplierManagerDashBoard' element={<SupplierManagerDashBoard />} />
        <Route path='/SupplierDashboard' element={<SupplierDashboard />} />
        <Route path="/PlaceOrderInventory/:id" element={<PlaceOrderInventory/>} />
        <Route path="/addemployee" element={<AddEmployeeForm/>} />
        <Route path="/viewemployee" element={<EmployeeTable/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
