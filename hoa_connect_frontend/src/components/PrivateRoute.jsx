// import React from 'react';
// import { Navigate } from 'react-router-dom';

// // Checks if the token exists in localStorage
// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   const location = useLocation();

//   if (loading) return <div>Loading...</div>;

//   if (!user) {
//     // Allow going to /login
//     if (location.pathname === '/login') return children;
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;