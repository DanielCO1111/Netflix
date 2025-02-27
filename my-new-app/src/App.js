import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider, useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import MainScreen from './components/MainScreen';
import MovieInfo from './components/MovieInfo';
import MoviePlayer from './components/MoviePlayer';
import AdminManagement from './components/AdminManagement';
import RandomMovie from './components/RandomMovie';

// ProtectedRoute component: shows a loading message while auth state is determined.
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading authentication...</div>; // Prevent premature redirects
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// AdminRoute component: checks both auth and admin role.
const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <div>Loading authentication...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/main" replace />;

  return children;
};

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/main" element={<ProtectedRoute><MainScreen /></ProtectedRoute>} />
          <Route path="/movies/:id" element={<ProtectedRoute><MovieInfo /></ProtectedRoute>} />
          <Route path="/movies/:id/watch" element={<ProtectedRoute><MoviePlayer /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminManagement /></AdminRoute>} />
          <Route path="/randomMovie" element={<ProtectedRoute><RandomMovie /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;