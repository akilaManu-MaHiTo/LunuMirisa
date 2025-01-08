import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignInSupplier() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    axios.post("https://lunu-mirisa.vercel.app/SignInSupplier", { email, password })
      .then((response) => {
        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);
        
        // Navigate to the supplier's specific dashboard using supplierId
        const supplierId = response.data.supplierId;
        navigate(`/SupplierDashboard/${supplierId}`); // Redirect to the specific supplier dashboard
      })
      .catch(err => setError("Invalid credentials, please try again."));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Supplier Sign In</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignInSupplier;
