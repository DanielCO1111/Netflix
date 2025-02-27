import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CategoryList.css';

const CategoryList = ({ categories, movies, handleCategoryClick }) => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    return (
        <div className="category-list">
            <h2>Categories</h2>
            <button className="handle handlePrev btn btn-dark" onClick={scrollLeft} aria-label="Show previous categories">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>

            <div className="category-grid" ref={sliderRef}>
                {categories.map((category) => {
                    const categoryId = category.id || category._id;
                    const categoryMovie = movies.find(movie => movie.genre === category.name);

                    return (
                        <div key={categoryId} className="category-card" onClick={() => handleCategoryClick(category.name)}>
                            {categoryMovie ? (
                                <div className="boxart-container">
                                    <img 
                                        src={categoryMovie.thumbnail || "https://via.placeholder.com/150"} 
                                        alt={category.name} 
                                        className="boxart-image img-fluid rounded" 
                                    />
                                    <div className="fallback-text-container">
                                        <p className="fallback-text">{category.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="boxart-container no-movie">
                                    <div className="fallback-text-container">
                                        <p className="fallback-text">{category.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button className="handle handleNext btn btn-dark" onClick={scrollRight} aria-label="Show more categories">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
            </button>
        </div>
    );
};

export default CategoryList;