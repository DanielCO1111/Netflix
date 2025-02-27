import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MovieList.css';

const MovieList = ({ movies, handleMovieClick }) => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    return (
        <div className="movie-list">
            <button className="handle handlePrev btn btn-dark" onClick={scrollLeft} aria-label="Show previous titles">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>
            <div className="movie-grid" ref={sliderRef}>
                {movies.map((movie) => {
                    const movieId = movie.id || movie._id; 
                    return (
                        <div key={movieId} className="movie-card" onClick={() => handleMovieClick(movieId)}>
                            <img src={movie.thumbnail} alt={movie.title} className="img-fluid rounded" />
                            <h3>{movie.title}</h3>
                        </div>
                    );
                })}
            </div>
            <button className="handle handleNext btn btn-dark" onClick={scrollRight} aria-label="Show more titles">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
            </button>
        </div>
    );
};

export default MovieList;