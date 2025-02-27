import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminManagement.css';

const AdminManagement = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newMovie, setNewMovie] = useState({ title: '', genre: '', description: '', year: '', streamingUrl: '', thumbnail: '' });
  const navigate = useNavigate();

  // Function to handle API requests
  const fetchData = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);

      const text = await response.text();
      return text ? JSON.parse(text) : null; // Handle empty response
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMovies();
  }, []);

  const fetchCategories = () => {
    fetchData("http://localhost:3000/api/categories").then(data => {
      console.log("Fetched categories:", data);
      setCategories(data || []);
    });
  };

  const fetchMovies = () => {
    fetchData("http://localhost:3000/api/movies").then(data => {
      console.log("Fetched movies:", data);
      setMovies(data || []);
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
        console.error("Category name cannot be empty");
        return;
    }

    fetchData("http://localhost:3000/api/categories", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, promoted: false }),
    }).then(response => {
        if (!response) {
            console.error("Error: No response received when adding category.");
            return;
        }
        console.log("Category added successfully:", response);
        setCategories(prevCategories => [...prevCategories, response]); 
        setNewCategoryName('');
    }).catch(error => console.error("Error adding category:", error));
  };


  const handleEditCategory = (id) => {
    if (!id) {
        console.error("Error: Category ID is undefined when attempting to edit a category.");
        return;
    }

    const newName = prompt('Enter new category name:');
    if (newName) {
        fetchData(`http://localhost:3000/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name: newName, promoted: false }),
        }).then(response => {
            if (!response) {
                console.error("Error: No response received when updating category.");
                return;
            }
            fetchCategories();  // Refresh categories after successful update
        }).catch(error => console.error("Error updating category:", error));
    }
};

  const handleDeleteCategory = (id) => {
    fetchData(`http://localhost:3000/api/categories/${id}`, { method: 'DELETE' })
      .then(() => fetchCategories());
  };

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.genre || !newMovie.description) {
      console.error("Missing required fields for new movie");
      return;
    }

    const movieData = {
      title: newMovie.title,
      genre: newMovie.genre,
      year: newMovie.year || "2024",
      description: newMovie.description,
      streamingUrl: newMovie.streamingUrl || "",
      thumbnail: newMovie.thumbnail || "",
      promoted: false,
    };

    console.log("Sending movie data:", movieData); 

    fetchData("http://localhost:3000/api/movies", {
      method: 'POST',
      body: JSON.stringify(movieData),
    })
      .then(response => {
        console.log("Movie added successfully:", response);
        setNewMovie({ title: '', genre: '', description: '', year: '', streamingUrl: '', thumbnail: '' });
        fetchMovies();
      })
      .catch(error => console.error("Error adding movie:", error));
  };

  const handleEditMovie = (id) => {
    if (!id) {
      console.error("Error: Movie ID is undefined when attempting to edit a movie.");
      return;
    }

    const newTitle = prompt('Enter new movie title:');
    const newGenre = prompt('Enter new movie genre:');
    const newDescription = prompt('Enter new movie description:');

    if (newTitle && newGenre && newDescription) {
      fetchData(`http://localhost:3000/api/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: newTitle, genre: newGenre, description: newDescription }),
      }).then(() => fetchMovies())
      .catch(error => console.error("Error updating movie:", error));
    }
  };

  const handleDeleteMovie = (id) => {
    if (!id) {
      console.error("Error: Movie ID is undefined when attempting to delete a movie.");
      return;
    }

    fetchData(`http://localhost:3000/api/movies/${id}`, { method: 'DELETE' })
      .then(() => fetchMovies())
      .catch(error => console.error("Error deleting movie:", error));
  };

  return (
    <div className="admin-management">
      <h1>Admin Management</h1>
      {/* Back to Main Button */}
      <button className="btn btn-secondary" onClick={() => navigate('/main')}>
        ← Back to Main Screen
      </button>
      <div>
        <h2>Categories</h2>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
        <ul>
          {categories.map(category => (
            <li key={category.id || category._id}>
              {category.name}
              <button onClick={() => handleEditCategory(category.id || category._id)}>Edit</button>
              <button onClick={() => handleDeleteCategory(category.id || category._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Movies</h2>
        <input
          type="text"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          placeholder="New movie title"
        />
        <input
          type="text"
          value={newMovie.genre}
          onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
          placeholder="New movie genre"
        />
        <input
          type="text"
          value={newMovie.description}
          onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
          placeholder="New movie description"
        />
        <button onClick={handleAddMovie}>Add Movie</button>
        <ul>
          {movies.map(movie => (
            <li key={movie.id || movie._id}>
              {movie.title} - {movie.genre}
              <button onClick={() => handleEditMovie(movie.id || movie._id)}>Edit</button>
              <button onClick={() => handleDeleteMovie(movie.id || movie._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminManagement;