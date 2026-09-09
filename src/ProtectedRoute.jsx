// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  // Change this according to how you store auth
  const isAuthenticated = Boolean(localStorage.getItem('token')) 
  // or: const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    // Redirect to login and save the current location
    return <Navigate to="/authentication/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute