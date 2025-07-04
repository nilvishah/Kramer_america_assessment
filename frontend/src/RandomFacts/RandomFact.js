import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../assets/background.mp4'; // Ensure this path is correct
import paw from '../assets/paw.svg'; // black paw icon to click
import Lottie from 'lottie-react';
import catwalk2 from '../assets/cat-walk2.json'; 
function RandomFact() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || '';

  const fetchRandomFact = async () => {
    setLoading(true);
    setMessage('');
    setFact(null);
    try {
      const res = await fetch(`${API_URL}/catfacts/fetch_external`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data && data.fact) {
        setFact(data.fact);
      } else {
        setMessage(data.message || 'Could not fetch a new fact.');
      }
    } catch (err) {
      setMessage('Error fetching fact.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#e0f7fa',
      alignItems: 'stretch',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Left: video (more area) */}
      <div style={{ flex: 1.7, position: 'relative', minWidth: 0 }}>
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Optional overlay for effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.15)',
        }} />
      </div>
      {/* Right: random fact UI (less area) */}
      <div style={{
        flex: 1,
        position: 'relative',
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '0 16px 16px 0',
      }}>
        {/* Floating Paws and Gradient Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top right, #fff7fb, #e0f7fa)',
          zIndex: 0,
        }}>
          {[...Array(4)].map((_, row) =>
            [...Array(5)].map((_, col) => (
              <img
                key={`${row}-${col}`}
                src={paw}
                alt="paw"
                style={{
                  position: 'absolute',
                  top: `${row * 25 + 5}%`,
                  left: `${col * 20 + 5}%`,
                  width: 24,
                  height: 24,
                  opacity: 0.1,
                  transform: `rotate(${(row + col) * 15}deg)`,
                  animation: `float ${6 + row + col}s ease-in-out infinite`
                }}
              />
            ))
          )}
        </div>
        {/* Random Fact UI Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 500,
          margin: '0 auto',
          padding: 32,
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#6366f1', marginBottom: 16 }}>Tell Me Something Purr-fect 🐾</h2>
          <button onClick={fetchRandomFact} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginBottom: 24 }} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch New Cat Fact'}
          </button>
          {fact && <div style={{ marginTop: 24, fontSize: 18, color: '#334155', background: '#f1f5f9', borderRadius: 8, padding: 16, maxWidth: 400, margin: '0 auto' }}>{fact}</div>}
          {message && <div style={{ marginTop: 16, color: '#dc2626' }}>{message}</div>}
          {/* Tracker redirect below fact/message */}
          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 16, color: '#555', marginBottom: 12, fontStyle: 'italic' }}>
              Feline intrigued? Let’s explore even more pawsome facts together!
            </div>
            <button
              onClick={() => navigate('/tracker')}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 1.4rem',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
            >
              Take Me to the Cat Tracker →
            </button>
          </div>
          
        </div>
        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0); }
            }
          `}
        </style>
      </div>
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
                <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes walk {
            0% { left: -160px; }
            100% { left: 100%; }
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default RandomFact;
