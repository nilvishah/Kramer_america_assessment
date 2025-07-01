import React, { useEffect, useState } from 'react';


function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('/catfacts')
      .then(res => res.json())
      .then(data => {
        setFacts(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newFact.trim()) {
      setMessage('Please enter a cat fact.');
      return;
    }
    const formData = new FormData();
    formData.append('fact', newFact);
    const res = await fetch('/catfacts', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      setFacts([...facts, { id: facts.length + 1, fact: newFact, created_at: new Date().toISOString().slice(0,10) }]);
      setNewFact('');
      setMessage('Fact added!');
    } else {
      setMessage(data.message || 'Error');
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    setMessage("");
    const res = await fetch(`/catfacts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setFacts(facts.filter(f => f.id !== id));
      setMessage("Fact deleted!");
    } else {
      setMessage(data.message || "Error deleting fact");
    }
  };

  // Styles for light and dark mode
  const bgGradient = darkMode
    ? 'linear-gradient(135deg, #18181b 0%, #312e81 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)';
  const cardBg = darkMode ? '#232336' : '#fff';
  const cardShadow = darkMode ? '0 4px 24px #312e8155' : '0 4px 24px #c7d2fe55';
  const textColor = darkMode ? '#e0e7ff' : '#334155';
  const inputBg = darkMode ? '#232336' : '#f1f5f9';
  const inputBorder = darkMode ? '#6366f1' : '#c7d2fe';
  const factBg = darkMode ? '#18181b' : '#f1f5f9';
  const deleteBtnBg = darkMode ? '#ef4444' : '#dc2626';
  const deleteBtnColor = '#fff';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 600, margin: '3rem auto', background: cardBg, borderRadius: 16, boxShadow: cardShadow, padding: '2.5rem 2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ textAlign: 'center', color: '#6366f1', fontWeight: 700, letterSpacing: 1, marginBottom: 0 }}>🐱 Cat Fact Tracker</h1>
          <button
            onClick={() => setDarkMode(dm => !dm)}
            style={{ background: darkMode ? '#6366f1' : '#e0e7ff', color: darkMode ? '#fff' : '#6366f1', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginLeft: 16 }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            type="text"
            value={newFact}
            onChange={e => setNewFact(e.target.value)}
            placeholder="Add a new cat fact"
            style={{ flex: 1, padding: '0.75rem 1rem', border: `1px solid ${inputBorder}`, borderRadius: 8, fontSize: 16, outline: 'none', background: inputBg, color: textColor }}
          />
          <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
            Add
          </button>
        </form>
        {message && <div style={{ marginBottom: 24, color: message === 'Fact added!' || message === 'Fact deleted!' ? '#16a34a' : '#dc2626', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
        <h2 style={{ color: textColor, fontWeight: 600, marginBottom: 18, fontSize: 22 }}>All Cat Facts</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#6366f1', fontSize: 18 }}>Loading...</div>
        ) : facts.length === 0 ? (
          <div style={{ textAlign: 'center', color: darkMode ? '#a5b4fc' : '#64748b', fontSize: 16 }}>No cat facts found.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {facts.map(f => (
              <li key={f.id || f.fact} style={{ background: factBg, borderRadius: 8, marginBottom: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', boxShadow: darkMode ? '0 1px 4px #312e8122' : '0 1px 4px #c7d2fe22' }}>
                <span style={{ flex: 1, color: textColor, fontSize: 16 }}>{f.fact}</span>
                <span style={{ color: '#6366f1', fontSize: 13, marginLeft: 16 }}>{f.created_at}</span>
                <button onClick={() => handleDelete(f.id)} style={{ marginLeft: 16, background: deleteBtnBg, color: deleteBtnColor, border: 'none', borderRadius: 6, padding: '0.4rem 0.9rem', fontWeight: 500, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;