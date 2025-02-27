// Home.js
import React, { useState } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="home">
      {/* Language selector at top-right */}
      <div className="language-container">
        <select
          id="Language"
          value={language}
          onChange={handleLanguageChange}
          className="language-dropdown"
        >
          <option value="English">English</option>
          <option value="עברית">עברית</option>
          <option value="Русский">Русский</option>
        </select>
      </div>

      {/* Netflix logo */}
      <img
        src="/Nsymbol.svg"
        alt="Netflix Logo"
        className="netflix-logo"
      />

      {/* Optional background */}
      {/* 
        <img
          src="/netback2.jpg"
          alt="back"
          className="netflix-bg"
        />
      */}
      <div className="bg-img"></div>

      {/* Headings */}
      <h1 style={{ marginBottom: 0 }}>Unlimited movies,</h1>
      <h1 style={{ marginTop: 0 }}>TV shows, and more</h1>

      <p>Ready to watch? Please register or sign in to continue.</p>

      {/* Buttons */}
      <div>
        <button
          onClick={() => navigate('/register')}   // Now goes to Register
          className="loginpage-button"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/login')}      // Now goes to Login
          className="signinpage-button"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Home;