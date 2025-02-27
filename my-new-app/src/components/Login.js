import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth(); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.username || !formData.password) {
      setErrors({ general: "Username and password are required" });
      return;
    }
  
    try {
      // 1) Login to get JWT
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
  
        // 2) Fetch current user info
        const meResponse = await fetch(`http://localhost:3000/api/users/self/${result.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${result.token}`,
          },
        });
  
        if (meResponse.ok) {
          const meData = await meResponse.json();
          console.log("User info fetched:", meData);
  
          // Store role properly and update auth state
          const userRole = meData.role.toLowerCase(); 
          localStorage.setItem("role", userRole);
          updateAuthState(result.token, userRole);
  
          // Redirect based on role
          navigate(userRole === "admin" ? "/admin" : "/main");
        } else {
          console.error("Failed to fetch user info");
        }
      } else {
        setErrors({ general: result.error || "Login failed" });
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again later." });
    }
  };  

  return (
    <div className="login-container">
      <h1 className="logo-text">NETFLIX</h1>
      <div className="login-box">
        <h2>Welcome back!</h2>
        <h3>Enter your details to log in.</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="login-input"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {errors.general && <span className="error-message">{errors.general}</span>}
        </form>
      </div>
    </div>
  );
}

export default Login;