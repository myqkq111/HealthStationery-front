// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  if (!localStorage.getItem("admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
