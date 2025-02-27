import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RandomMovie.css';

const RandomMovie = () => {
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRandomMovie();
    }, []);

    const fetchRandomMovie = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/movies/randomMovie');
            if (!response.ok) throw new Error(`Failed to fetch movie: ${response.statusText}`);
            const data = await response.json();
            setMovie(data);
        } catch (err) {
            console.error("Error fetching random movie:", err);
        }
    };
    // Function to mark the movie as watched by sending a POST request
    const markAsWatched = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${movie._id}/recommend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) {
        throw new Error('Failed to mark movie as watched');
      }
      const result = await response.json();
      console.log("Mark as Watched response:", result);
    } catch (error) {
      console.error("Error marking movie as watched:", error);
    }};

  // Handle Play button click: mark the movie as watched and navigate to watch page
  const handlePlayClick = async () => {
    await markAsWatched();
    navigate(`/movies/${movie._id}/watch`, { state: { from: 'main', streamingUrl: movie.streamingUrl } });
  };

    // If the movie data has not yet loaded, display a loading message
    if (!movie) return <div>Loading...</div>;

    return (
        <div className="random-movie-container">
            <div 
                className="random-movie-background" 
                style={{ backgroundImage: `url(${movie.thumbnail})` }}
            >
                <div className="random-movie-info">
                    <h1 className="movie-title">{movie.title}</h1>
                    <p className="movie-genre">{movie.genre} | {movie.year}</p>
                    <p className="movie-description">{movie.description}</p>

                    <div className="random-movie-buttons">
                        <button 
                            className="btn btn-primary me-2" 
                            onClick={handlePlayClick}
                        >
                            ▶ Play
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => navigate(`/movies/${movie._id}`)}
                        >
                            ℹ More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomMovie;