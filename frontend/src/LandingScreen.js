import React, { useState } from 'react';
// import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import paw from './assets/paw.svg';
import catwalk2 from './assets/cat-walk2.json'; // Optional: if you want to use a static cat image
import catWalkAnimation from './assets/cat-walk.json';
import happyCatAnim from './assets/happy-cat.json';
import sadCatAnim from './assets/sad-cat.json';

const LandingScreen = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null); // null | "yes" | "no"

  const bgGradient = 'linear-gradient(to top right, #fff7fb, #e0f7fa)';
  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      background: bgGradient,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      zIndex: 1,
    }}>
      {/* Floating Paws Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
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

      {/* Question */}
      <h1 style={{
        fontSize: '2.6rem',
        color: '#444',
        textShadow: '0 4px 12px rgba(0,0,0,0.2)',
        marginBottom: '2rem',
        animation: 'fadeInUp 1s ease',
        zIndex: 1,
      }}>
        Oh hello, you like cats?
      </h1>
      <p style={{ color: '#888', marginTop: '-1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
        P.S. We know Alejandra’s cat would definitely say “Yes” 😺
      </p>


      {/* Yes / No Buttons */}
      {!answer && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', zIndex: 1 }}>
          <button onClick={() => setAnswer("yes")} style={buttonStyle('#6366f1')}>Yes 😺</button>
          <button onClick={() => setAnswer("no")} style={buttonStyle('#ef4444')}>No 😿</button>
          <button onClick={() => navigate('/random-fact')} style={buttonStyle('#10b981')}>Maybe 🤔</button>
        </div>
      )}

      {/* Response Animation */}
      {answer === 'yes' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.8s ease',
          zIndex: 1
        }}>
          <div style={{ width: 140, height: 140 }}>
            <Lottie animationData={happyCatAnim} loop />
          </div>
          <h2 style={{ color: '#444', marginTop: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Yay! You’re in the right place 😻
          </h2>
          <button
          onClick={() => navigate(answer === 'yes' ? '/tracker' : '/game')}
          style={buttonStyle('#6366f1')}
          >
          Get Started →
        </button>
        </div>
        
      )}

      {answer === 'no' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.8s ease',
          zIndex: 1
        }}>
          <div style={{ width: 140, height: 140 }}>
            <Lottie animationData={sadCatAnim} loop />
          </div>
          <h2 style={{ color: '#444', marginTop: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Aww... that’s okay. Maybe you’ll change your mind 🐾
          </h2>
          <button
          onClick={() => navigate(answer === 'no' ? '/game' : '/game')}
          style={buttonStyle('#6366f1')}
          >
          Try this game →
        </button>
        </div>
      )}

      {/* Get Started Button */}
      {/* {answer && (
        <button
          onClick={() => navigate(answer === 'yes' ? '/tracker' : '/game')}
          style={buttonStyle('#6366f1')}
        >
          Get Started →
        </button>
      )} */}

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
};

const buttonStyle = (bgColor) => ({
  padding: '0.8rem 2rem',
  fontSize: '1.1rem',
  color: '#fff',
  background: bgColor,
  border: 'none',
  borderRadius: '999px',
  boxShadow: `0 0 12px ${bgColor}99`,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
});

export default LandingScreen;
