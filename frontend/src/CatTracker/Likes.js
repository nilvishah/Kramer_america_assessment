import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import catwalk2 from '../assets/cat-walk2.json';  // 🐾 Walking cat animation

function Likes() {
  const navigate = useNavigate();

  // State to store liked cat facts
  const [likes, setLikes] = useState([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Message state for success or error feedback
  const [message, setMessage] = useState('');

  // Search term for filtering liked facts
  const [search, setSearch] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || '';

  // Fetch all liked facts on page load
  useEffect(() => {
    fetch(`${API_URL}/likes`)
      .then(res => res.json())
      .then(data => {
        setLikes(data);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to load liked facts.');
        setLoading(false);
      });
  }, [API_URL]);

  // Handle unliking a fact
  const handleUnlike = async (fact_id) => {
    setMessage('');
    const res = await fetch(`${API_URL}/likes/${fact_id}`, { method: 'DELETE' });

    if (res.ok) {
      setLikes(prev => prev.filter(like => like.fact_id !== fact_id));
      setMessage('Fact unliked!');
    } else {
      setMessage('Error unliking fact.');
    }
  };

  // Filter liked facts based on search query
  const filteredLikes = likes.filter(like =>
    like.fact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cat-tracker-container">
      <div className="cat-tracker-card">

        {/* Likes Header with Back Button */}
        <div style={{
          maxWidth: 600,
          margin: '40px auto',
          padding: 24,
          background: '#f8fafc',
          borderRadius: 12,
          boxShadow: '0 2px 8px #0001'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 24
          }}>
            <button
              onClick={() => navigate('/tracker')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                marginRight: 12,
                color: '#6366f1',
                padding: 0
              }}
              title="Back to Tracker"
            >
              ←
            </button>
            <h2 style={{ color: '#6366f1', margin: 0 }}>Liked Cat Facts</h2>
          </div>

          {/* Search Bar */}
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search liked facts..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #c7d2fe',
                borderRadius: 8,
                fontSize: 16,
                background: '#f1f5f9',
                color: '#334155'
              }}
            />
          </form>

          {/* Liked Facts List */}
          {loading ? (
            <div>Loading...</div>
          ) : filteredLikes.length === 0 ? (
            <div>No liked facts found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredLikes.map(like => (
                <li
                  key={like.like_id}
                  style={{
                    marginBottom: 18,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: '0 1px 4px #0001',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: 17, color: '#334155' }}>{like.fact}</span>
                  <button
                    onClick={() => handleUnlike(like.fact_id)}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Unlike
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: 18,
              color: '#dc2626',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Walking Cat Animation */}
      <Lottie
        animationData={catwalk2}
        loop
        style={{
          width: 120,
          height: 120,
          position: 'absolute',
          bottom: 0,
          left: '-160px',
          animation: 'walk 14s linear infinite',
          zIndex: 0,
        }}
      />
    </div>
  );
}

export default Likes;
