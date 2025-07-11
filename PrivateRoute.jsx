import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is logged in and is a vendor
  if (!token || (user.role !== 'vendor' && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute; 