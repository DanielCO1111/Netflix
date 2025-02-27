import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(role && role.toLowerCase() === 'admin');
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }

    setLoading(false); // Only set loading false after checking authentication
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setIsAdmin(role.toLowerCase() === 'admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const updateAuthState = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role.toLowerCase()); 
    setIsAuthenticated(true);
    setIsAdmin(role.toLowerCase() === 'admin');
  };

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated, isAdmin, handleLogin, handleLogout, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);