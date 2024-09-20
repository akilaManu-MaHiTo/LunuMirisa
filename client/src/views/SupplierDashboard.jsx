import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SupplierDashboard() {
  const { supplierId } = useParams(); 
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/ShowSupplierProfile/${supplierId}`)
      .then(response => {
        setSupplierData(response.data);
      })
      .catch(error => {
        console.error("Error fetching supplier data:", error);
      });
  }, [supplierId]);

  return (
    <div>
      <h1>Supplier Dashboard</h1>
      {supplierData ? (
        <div>
          <h2>Welcome, {supplierData.name}!</h2>
          <p>Email: {supplierData.email}</p>
          <p>Category: {supplierData.category}</p>
          {/* Other supplier-specific information */}
        </div>
      ) : (
        <p>Loading supplier data...</p>
      )}
    </div>
  );
}

export default SupplierDashboard;
