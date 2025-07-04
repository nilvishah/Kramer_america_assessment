import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

// import CatPaw3D from '../CatPaw3D';
import catwalk2 from '../assets/cat-walk2.json';
import likeButtonAnim from '../assets/like-button.json';

import './CatTracker.css'; // 

function CatTracker() {
  const navigate = useNavigate();
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pawAction, setPawAction] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || '';

  const fetchFacts = () => {
    setLoading(true);
    fetch(`${API_URL}/catfacts`)
      .then(res => res.json())
      .then(data => {
        setFacts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFacts();
  }, [API_URL]);

  const showMessage = (text) => {
    setMessage(text);
    setPawAction(true);
    setTimeout(() => setPawAction(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFact.trim()) {
      setMessage('Please enter a cat fact.');
      return;
    }
    const formData = new FormData();
    formData.append('fact', newFact);
    const res = await fetch(`${API_URL}/catfacts`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      fetchFacts();
      setNewFact('');
      showMessage('Fact added!');
    } else {
      setMessage(data.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/catfacts/${id}`, { method: 'DELETE' });
    const data = await res.json();
    fetchFacts();
    if (res.ok) {
      showMessage('Fact deleted!');
    } else {
      setMessage(data.message || 'Error deleting fact');
    }
  };

  const handleExportCSV = () => {
    if (!facts.length) return;
    const header = ['id', 'fact', 'created_at'];
    const rows = facts.map(f => [f.id, `"${(f.fact || '').replace(/"/g, '""')}"`, f.created_at]);
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    let filename = prompt('Enter a filename for your CSV:', 'cat_facts_export');
    if (!filename) {
      URL.revokeObjectURL(url);
      return;
    }
    if (!filename.endsWith('.csv')) filename += '.csv';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEditFact = (factObj) => {
    setEditingId(factObj.id);
    setEditingValue(factObj.fact);
  };

  const cancelEditFact = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const saveEditFact = (factObj) => {
    const newFact = editingValue.trim();
    if (!newFact || newFact === factObj.fact) {
      cancelEditFact();
      return;
    }
    fetch(`${API_URL}/catfacts/${factObj.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fact: newFact }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFacts(facts.map(f => (f.id === factObj.id ? { ...f, fact: newFact } : f)));
          showMessage('Fact updated!');
        } else {
          setMessage(data.message || 'Error updating fact');
        }
        cancelEditFact();
      })
      .catch(() => {
        setMessage('Error updating fact');
        cancelEditFact();
      });
  };

  return (
    <div className="cat-tracker-container">
      <div className="cat-tracker-card">
        <div className="cat-tracker-header">
          <h1>🐱 Cat Fact Tracker</h1>
          <div title="View Likes" onClick={() => navigate('/likes')} style={{ cursor: 'pointer'}}>
            <Lottie animationData={likeButtonAnim} loop style={{ width: 48, height: 48 }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cat-tracker-form">
          <input
            type="text"
            value={newFact}
            onChange={(e) => setNewFact(e.target.value)}
            placeholder="Add a new cat fact"
          />
          <button type="submit">Add</button>
          <button type="button" onClick={handleExportCSV}>Export to CSV</button>
        </form>

        {message && <div className="cat-tracker-message">{message}</div>}
        <h2>All Cat Facts</h2>

        <div className="cat-tracker-list">
          {loading ? (
            <div className="cat-tracker-loading">Loading...</div>
          ) : facts.length === 0 ? (
            <div className="cat-tracker-empty">No cat facts found.</div>
          ) : (
            <TransitionGroup component="ul" className="fact-list">
              {facts.map(f => (
                <CSSTransition key={f.id || f.fact} timeout={350} classNames="fact">
                  <li className="fact-item">
                    {editingId === f.id ? (
                      <div className="fact-edit">
                        <input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditFact(f);
                            if (e.key === 'Escape') cancelEditFact();
                          }}
                        />
                        <button onClick={() => saveEditFact(f)}>✔️</button>
                        <button onClick={cancelEditFact}>✖️</button>
                      </div>
                    ) : (
                      <p>{f.fact}</p>
                    )}
                    <div className="fact-meta">
                      <span>{f.created_at}</span>
                      <div className="fact-actions">
                        <button onClick={() => startEditFact(f)} disabled={editingId && editingId !== f.id}>✏️</button>
                        <button onClick={() => {
                          fetch(`${API_URL}/likes`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fact_id: f.id }),
                          });
                        }}>❤️</button>
                        <button onClick={() => handleDelete(f.id)}>🗑️</button>
                      </div>
                    </div>
                  </li>
                </CSSTransition>
              ))}
            </TransitionGroup>
          )}
        </div>
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
    </div>
  );
}

export default CatTracker;
