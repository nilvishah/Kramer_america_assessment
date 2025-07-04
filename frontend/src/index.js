import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Screens / Pages
import LandingScreen from './LandingScreen';
import CatGame from './CatGame/CatGame';
import RandomFact from './RandomFacts/RandomFact';
import Likes from './CatTracker/Likes';
import CatTracker from './CatTracker/CatTracker';

// Optional Theme Context (currently unused, but future-proofed)
import { ThemeProvider } from './ThemeContext';

// Create root and render app with routes
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingScreen />} />

          {/* Cat Fact Tracker */}
          <Route path="/tracker" element={<CatTracker />} />

          {/* Cat Paw Game */}
          <Route path="/game" element={<CatGame />} />

          {/* Random Cat Fact */}
          <Route path="/random-fact" element={<RandomFact />} />

          {/* Liked Cat Facts */}
          <Route path="/likes" element={<Likes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
