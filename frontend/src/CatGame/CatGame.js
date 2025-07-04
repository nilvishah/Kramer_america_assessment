import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Lottie from 'lottie-react';

import './CatGame.css';

// Assets
import pawImg from '../assets/paw.svg';          // Paw icon to click
import catFace from '../assets/cat-face.png';    // Floating cat face bubbles
import catwalk2 from '../assets/cat-walk2.json'; // Walking cat animation

const NUM_BUBBLES = 20; // Number of floating bubbles

const CatGame = () => {
  const [score, setScore] = useState(0);                // Track how many times paw is clicked
  const [pawPos, setPawPos] = useState({ x: 100, y: 100 }); // Paw icon position
  const navigate = useNavigate();

  // Handle clicking the paw
  const handlePawClick = () => {
    if (score < 5) {
      setScore(prev => prev + 1);
      movePaw();

      // Confetti effect on each click
      confetti({
        particleCount: 40,
        spread: 70,
        origin: {
          x: pawPos.x / window.innerWidth,
          y: pawPos.y / window.innerHeight,
        },
        shapes: ['circle'],
        scalar: 1.2,
        colors: ['#ff6ec4', '#ffc1cc', '#fde2e2', '#ff9aa2'],
      });
    }
  };

  // Move the paw to a new random position
  const movePaw = () => {
    const x = Math.random() * (window.innerWidth - 60);
    const y = Math.random() * (window.innerHeight - 60);
    setPawPos({ x, y });
  };

  // On mount: place paw somewhere random
  useEffect(() => {
    movePaw();
  }, []);

  return (
    <div className="bubble-bg">
      {/* Game Title */}
      <h1 className="game-title">Click the paw 5 times to win!</h1>

      {/* Interactive Paw */}
      {score < 5 && (
        <img
          src={pawImg}
          alt="paw"
          className="paw-icon"
          style={{ top: pawPos.y, left: pawPos.x }}
          onClick={handlePawClick}
        />
      )}

      {/* Final Button after winning */}
      {score >= 5 && (
        <button className="final-button" onClick={() => navigate('/')}>
          Okay okay, back →
        </button>
      )}

      {/* Floating Cat Face Bubbles */}
      {[...Array(NUM_BUBBLES)].map((_, i) => {
        const left = Math.random() * 100;
        const duration = 5 + Math.random() * 5;
        const delay = Math.random() * 3;

        return (
          <div
            className="bubble"
            key={i}
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <img
              src={catFace}
              alt="cat-bubble"
              className="bubble-icon"
            />
          </div>
        );
      })}

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

      {/* Custom Animations */}
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

export default CatGame;