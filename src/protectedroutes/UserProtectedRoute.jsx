import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = () => {
  const { isLoggedIn, isAuthLoading, token } = useAuth();
  const location = useLocation();
    console.log("protedte route data :>>". isLoggedIn,token, isAuthLoading)
    if (isAuthLoading) {
        return <div>Loading...</div>;
    }         
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          redirectTo: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};

export default UserProtectedRoute;