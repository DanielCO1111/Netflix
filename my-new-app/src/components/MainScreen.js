import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MainScreen.css';

import CategoryList from '../components/CategoryList';
import MovieList from '../components/MovieList';
import MovieInfo from '../components/MovieInfo';
import RandomMovie from '../components/RandomMovie';
import TopMenu from '../components/TopMenu';

const MainScreen = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth(); 

  useEffect(() => {
    console.log("MainScreen - isAuthenticated:", isAuthenticated);
    console.log("MainScreen - isAdmin:", isAdmin);

    fetchMoviesAndCategories();
    fetchRandomMovie();

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchWatchedMovies(userId);
    }
  }, [isAuthenticated, isAdmin]);

  // 1) Fetch all movies & categories
  const fetchMoviesAndCategories = async () => {
    try {
      const movieResponse = await fetch("http://localhost:3000/api/movies");
      const categoryResponse = await fetch("http://localhost:3000/api/categories");

      if (!movieResponse.ok || !categoryResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const movieData = await movieResponse.json();
      const categoryData = await categoryResponse.json();

      setMovies(movieData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching movies or categories:', error);
    }
  };

  // 2) Fetch random movie from aggregator
  const fetchRandomMovie = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/movies/randomMovie");
      if (!response.ok) {
        throw new Error('Failed to fetch random movie');
      }
      const data = await response.json();
      setRandomMovie(data);
    } catch (error) {
      console.error('Error fetching random movie:', error);
    }
  };

  // 3) Fetch watched movies for the current user
  const fetchWatchedMovies = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/movies/users/${userId}/watched`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });      
      if (!response.ok) {
        throw new Error('Failed to fetch watched movies');
      }
      const data = await response.json();
      setWatchedMovies(data.watchedMovies || []);
      if (data.watchedMovies && data.watchedMovies.length > 0) {
        const lastWatchedMovieId = data.watchedMovies[data.watchedMovies.length - 1]._id;
        fetchRecommendedMovies(lastWatchedMovieId);
      }
    } catch (err) {
      console.error("Error fetching watched movies:", err);
    }
  };

  const fetchRecommendedMovies = async (baseMovieId) => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error("User ID is not available");
        }
        const url = `http://localhost:3000/api/movies/${baseMovieId}/recommend?userId=${userId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (!response.ok || !data.recommendedMovies) {
            console.warn("No recommended movies received:", data.message || response.statusText);
            setRecommendedMovies([]);
        } else {
            setRecommendedMovies(data.recommendedMovies || []);
        }
    } catch (error) {
        console.error("Error fetching recommended movies:", error);
        setRecommendedMovies([]);  // Prevent app crash
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Show movie info
  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  // Category filter
  const handleCategoryClick = (categoryName) => {
    setSearchQuery(categoryName);
    setSearchResults(movies.filter(movie => movie.genre === categoryName));
} ;

  // Search
  const handleSearch = async (query) => {
    if (!query.trim()) {
        setSearchResults([]);
        setSearchQuery('');
        return;
    }

    setSearchQuery(query);
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`http://localhost:3000/api/movies/search/${encodedQuery}`);

        if (!response.ok) {
            throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]); 
  };


  return (
    <div className={`main-screen ${theme}`}>
      <TopMenu
        toggleTheme={toggleTheme}
        theme={theme}
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        navigate={navigate}
        onSearch={handleSearch}
      />
      <div className="container-fluid">
        {searchQuery ? (
          searchResults.length > 0 ? (
            <div className="category-section">
              <div className="category-row">
                <h2 className="category-title">Search Results</h2>
                <MovieList movies={searchResults} handleMovieClick={handleMovieClick} />
              </div>
              <button className="btn btn-secondary" onClick={() => resetSearch()}>
                Back to Main Page
              </button>
            </div>
          ) : (
            <div className="alert alert-warning">
              No results found. Try searching for something else.
              <button className="btn btn-secondary" onClick={resetSearch}>
                Back to Main Page
              </button>
            </div>
          )
        ) : (
          <>
            <div className="hero-section">
              <RandomMovie randomMovie={randomMovie} />
            </div>

            <div className="category-section">
              <CategoryList
                categories={categories}
                movies={movies}
                handleCategoryClick={handleCategoryClick}
              />

              {watchedMovies.length > 0 && (
                <div className="category-row">
                  <h2 className="category-title">Your Watched Movies</h2>
                  <MovieList
                    movies={watchedMovies}
                    handleMovieClick={handleMovieClick}
                  />
                </div>
              )}

              {recommendedMovies.length > 0 && (
                <div className="category-row">
                  <h2 className="category-title">Recommended For You</h2>
                  <MovieList
                    movies={recommendedMovies}
                    handleMovieClick={handleMovieClick}
                  />
                </div>
              )}
              
              <div className="category-row">
                <h2 className="category-title">All Movies</h2>
                <MovieList
                  movies={movies}
                  handleMovieClick={handleMovieClick}
                />
              </div>
            </div>
          </>
        )}
        {selectedMovie && <MovieInfo movie={selectedMovie} />}
      </div>
    </div>
  );
};

export default MainScreen;