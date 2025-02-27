import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MovieInfo.css';
import MovieList from '../components/MovieList';

const MovieInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
    fetchRecommendations();
  }, [id]); // Run when the movie ID changes

  const fetchMovieDetails = () => {
    fetch(`http://localhost:3000/api/movies/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched movie details:", data);
        setMovie(data);
      })
      .catch(err => console.error('Error fetching movie details:', err));
  };

  const fetchRecommendations = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      fetch(`http://localhost:3000/api/movies/${id}/recommend?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched recommendations:", data);
        setRecommendations(data.recommendedMovies || []);
      })
      .catch(err => console.error('Error fetching recommendations:', err));
    }
  };

  // If movie details haven't loaded yet
  if (!movie) return <div>Loading...</div>;

  // Function to mark the movie as watched.
  // NOTE: This assumes you have a POST /api/movies/:id/watched endpoint on your backend.
  const markAsWatched = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${id}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      console.log("response:", response);
      if (!response.ok) {
        throw new Error('Failed to mark movie as watched');
      }
      const result = await response.json();
      console.log("Mark as Watched response:", result);
    } catch (error) {
      console.error("Error marking movie as watched:", error);
    }
  };

  // When the user clicks "Watch Movie", first mark the movie as watched then navigate
  const handleWatchMovie = async () => {
    await markAsWatched();
    // Navigate to the watch page; pass the streamingUrl via location state if needed
    navigate(`/movies/${id}/watch`, { from: 'movie-info', state: { streamingUrl: movie.streamingUrl } });
  };

  return (
    <div className="container mt-4 movie-info">
      {movie.thumbnail && (
        <div className="text-center mb-4">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="img-fluid rounded"
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}

      <h1>{movie.title}</h1>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Description:</strong> {movie.description}</p>

      {movie.streamingUrl && (
        <>
          <button
            className="btn btn-primary"
            onClick={handleWatchMovie}
          >
            Watch Movie
          </button>
        </>
      )}

      <h3>Recommended Movies</h3>
      {recommendations.length > 0 ? (
        <MovieList
          movies={recommendations}
          handleMovieClick={(recommendedMovieId) => navigate(`/movies/${recommendedMovieId}`)}
        />
      ) : (
        <p>No recommendations available</p>
      )}

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/main')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default MovieInfo;