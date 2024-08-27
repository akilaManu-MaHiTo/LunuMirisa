import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Admin</h1>
        <p className="text-center">This is the user Admin page.</p>
      </div>

      <Link to="/AddMenuList"><button>Menu List</button></Link>
      <Link to="/ShowInventory"><button>Inventory</button></Link>
      <Link to="/ShowSupplierOrder"><button>Supplier Orders</button></Link>





    </div>
  );
};

export default AdminPage;
