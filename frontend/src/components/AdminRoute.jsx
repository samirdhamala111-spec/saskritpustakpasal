import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500 animate-pulse">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    // Redirect non-admin users to Home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
