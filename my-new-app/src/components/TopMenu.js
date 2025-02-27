import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import '../styles/TopMenu.css';

const TopMenu = ({ toggleTheme, theme, isAdmin, isAuthenticated, handleLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/movies/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search');
      }
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (movieId) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    navigate(`/movies/${movieId}`);
  };

  // Handle clicking on the Admin button using a Link
  // Alternatively, you can use a button and call navigate('/admin')
  // e.g., onClick={() => navigate('/admin')}
  
  // Clear search if needed
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    if (onSearch) onSearch('');
  };

  return (
    <header className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        {/* Brand / Logo */}
        <Link className="navbar-brand" to="/main">
          <svg className="n-logo-svg" focusable="false" viewBox="225 0 552 1000" aria-hidden="true">
            <defs>
              <radialGradient id=":r0:-a" r="75%" gradientTransform="matrix(.38 0 .5785 1 .02 0)">
                <stop offset="60%" stopOpacity=".3"></stop>
                <stop offset="90%" stopOpacity=".05"></stop>
                <stop offset="100%" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <path d="M225 0v1000c60-8 138-14 198-17V0H225" fill="#b1060e"></path>
            <path d="M579 0v983c71 3 131 9 198 17V0H579" fill="#b1060e"></path>
            <path
              d="M225 0v200l198 600V557l151 426c76 3 136 9 203 17V800L579 200v240L423 0H225"
              fill="url(#:r0:-a)"
            ></path>
            <path d="M225 0l349 983c76 3 136 9 203 17L423 0H225" fill="#e50914"></path>
          </svg>
        </Link>

        {/* Navbar toggler */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Home Button */}
            <li className="nav-item">
              <Link className="nav-link" to="/main">
                Home
              </Link>
            </li>

            {/* Admin Button (Only visible to Admins) */}
            {isAdmin && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-warning nav-link"
                  onClick={() => {
                    console.log("Navigating to Admin...");
                    navigate("/admin");
                  }}
                >
                  Admin
                </button>
              </li>
            )}

            {/* Logout Button */}
            {isAuthenticated ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Logout
                </Link>
              </li>
            )}
          </ul>

          {/* Search Box */}
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search..."
              className="form-control me-2"
            />
            {searchQuery && (
              <button className="btn btn-outline-light" type="button" onClick={clearSearch}>
                X
              </button>
            )}
            <button className="btn btn-outline-light" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24">
                <path d="M796 936 516 655q-30 26-68.5 39.5T368 708q-92 0-156-64t-64-156q0-92 
                  64-156t156-64q92 0 156 64t64 156q0 40-13.5 78.5T631 654l281 280-116 116ZM368 628q58 0 99-41t41-99q0-58-41-99t-99-41
                  q-58 0-99 41t-41 99q0 58 41 99t99 41Z" />
              </svg>
            </button>

            {/* Dropdown of search results */}
            {showResults && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((movie) => (
                  <div key={movie._id} className="dropdown-item" onMouseDown={() => handleResultClick(movie._id)}>
                    <strong>{movie.title}</strong> <em>{movie.genre}</em>
                  </div>
                ))}
              </div>
            )}

            {/* If no search results */}
            {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
              <div className="search-dropdown">
                <div className="dropdown-item">No results found for "{searchQuery}"</div>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeSwitcher toggleTheme={toggleTheme} theme={theme} />
      </div>
    </header>
  );
};

export default TopMenu;