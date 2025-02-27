import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MoviePlayer.css';

function extractVideoIdFromUrl(url) {
  try {
    if (!url || !url.includes('youtube.com/watch?v=')) {
      console.error('Invalid or missing YouTube URL:', url);
      return null;
    }
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch (err) {
    console.error('Error parsing YouTube URL:', url);
    return null;
  }
}

function MoviePlayer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [streamingUrl, setStreamingUrl] = useState(location.state?.streamingUrl || '');
  const playerRef = useRef(null);

  useEffect(() => {
    if (!streamingUrl) {
      fetch(`http://localhost:3000/api/movies/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setStreamingUrl(data.streamingUrl);
        })
        .catch((err) => console.error('Error fetching movie:', err));
    }
  }, [id, streamingUrl]);

  const videoId = extractVideoIdFromUrl(streamingUrl);

  const playerOpts = {
    width: '100%',
    height: '400',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
    },
  };

  const handleBack = () => {
    const from = location.state?.from;
    if (from === 'movie-info' && location.state?.movieId) {
      navigate(`/movies/${location.state.movieId}`);
    } else if (from === 'main') {
      navigate('/main');
    } else {
      navigate(-1);
    }
  };

  if (!videoId) {
    return (
      <div className="movie-player">
        <div className="hero-image-wrapper">
          <div className="video-layer">
            <p style={{ color: 'white', padding: '20px' }}>
              Invalid or missing YouTube URL. Please provide a valid URL such as
              <br />
              <code>https://www.youtube.com/watch?v=VIDEO_ID</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-player">
      {/* Back Button */}
      <div className="back-button-container">
        <button className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
      </div>
      <div className="hero-image-wrapper">
        <div className="video-layer">
          <YouTube
            videoId={videoId}
            opts={playerOpts}
            onReady={(event) => (playerRef.current = event.target)}
          />
        </div>
      </div>
    </div>
  );
}

export default MoviePlayer;