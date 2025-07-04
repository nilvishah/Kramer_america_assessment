import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingScreen from './LandingScreen';
import CatGame from './CatGame/CatGame';
import RandomFact from './RandomFacts/RandomFact';
import Likes from './CatTracker/Likes';
import { ThemeProvider } from './ThemeContext';
import CatTracker from './CatTracker/CatTracker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/tracker" element={<CatTracker />} />
          <Route path="/game" element={<CatGame />} />
          <Route path="/random-fact" element={<RandomFact />} />
          <Route path="/likes" element={<Likes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
