import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/Registration.css'; 

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.first_name.trim()) validationErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) validationErrors.last_name = 'Last name is required';
    if (!formData.username.trim()) validationErrors.username = 'Username is required';
    if (formData.password.length < 8)
      validationErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData(); 
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('password', formData.password);
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage); 
    }

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/login'); 
      } else {
        setErrors({ general: result.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo-text">NETFLIX</h1>
      <div className="login-box">
        <h2>Create a new account</h2>
        <form onSubmit={handleSubmit}>
          {/* First name field */}
          <div className="form-group">
            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            <input
              type="text"
              name="first_name"
              placeholder="First name"
              className="login-input"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          {/* Last name field */}
          <div className="form-group">
            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              className="login-input"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          {/* Username field */}
          <div className="form-group">
            {errors.username && <span className="error-message">{errors.username}</span>}
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="login-input"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            {errors.password && <span className="error-message">{errors.password}</span>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm password field */}
          <div className="form-group">
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="login-input"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Profile image field */}
          <div className="form-group">
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="custom-file-upload"
              onClick={() => document.getElementById('profileImage').click()}
            >
              Upload a Picture
            </button>
            {profileImage && <span className="file-name">{profileImage.name}</span>}
          </div>

          {/* Submit button */}
          <button type="submit" className="login-button">
            Sign up
          </button>

          {/* General error message */}
          {errors.general && <span className="error-message">{errors.general}</span>}
        </form>
      </div>
    </div>
  );
}

export default Registration;