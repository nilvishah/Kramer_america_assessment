import React, { useState, useEffect } from 'react';
import './CatGame.css';
import pawImg from './assets/paw.svg';       // black paw icon to click
import catFace from './assets/cat-face.png'; // floating bubble icon
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';


const NUM_BUBBLES = 20;

const CatGame = () => {
  const [score, setScore] = useState(0);
  const [pawPos, setPawPos] = useState({ x: 100, y: 100 });
  const navigate = useNavigate();

  const handlePawClick = () => {
  if (score < 5) {
    setScore(prev => prev + 1);
    movePaw();

    // Heart/Confetti burst
    confetti({
      particleCount: 40,
      spread: 70,
      origin: {
        x: pawPos.x / window.innerWidth,
        y: pawPos.y / window.innerHeight
      },
      shapes: ['circle'],
      scalar: 1.2,
      colors: ['#ff6ec4', '#ffc1cc', '#fde2e2', '#ff9aa2'],
    });
  }
};


  const movePaw = () => {
    const x = Math.random() * (window.innerWidth - 60);
    const y = Math.random() * (window.innerHeight - 60);
    setPawPos({ x, y });
  };

  useEffect(() => {
    movePaw(); // initial paw position
  }, []);

  return (
    <div className="bubble-bg">
      <h1 className="game-title">Catch the paw!</h1>

      {/* Paw to click */}
      {score < 5 && (
        <img
          src={pawImg}
          alt="paw"
          className="paw-icon"
          style={{ top: pawPos.y, left: pawPos.x }}
          onClick={handlePawClick}
        />
      )}

      {/* Final Button */}
      {score >= 5 && (
        <button className="final-button" onClick={() => navigate('/')}>
          Okay okay, back →
        </button>
      )}

      {/* Floating cat face bubbles only */}
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
    </div>
  );
};

export default CatGame;
