import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // This is your Cat Fact Tracker
import LandingScreen from './LandingScreen'; // Create this component
import CatGame from './CatGame';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/tracker" element={<App />} />
        <Route path="/game" element={<CatGame />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
