import React, { useEffect, useState } from 'react';

function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/catfacts')
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
    const res = await fetch('http://127.0.0.1:8000/catfacts', {
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 600, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #c7d2fe55', padding: '2.5rem 2rem', fontFamily: 'Segoe UI, sans-serif' }}>
        <h1 style={{ textAlign: 'center', color: '#6366f1', fontWeight: 700, letterSpacing: 1, marginBottom: 32 }}>🐱 Cat Fact Tracker</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            type="text"
            value={newFact}
            onChange={e => setNewFact(e.target.value)}
            placeholder="Add a new cat fact"
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #c7d2fe', borderRadius: 8, fontSize: 16, outline: 'none', background: '#f1f5f9' }}
          />
          <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>
            Add
          </button>
        </form>
        {message && <div style={{ marginBottom: 24, color: message === 'Fact added!' ? '#16a34a' : '#dc2626', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
        <h2 style={{ color: '#334155', fontWeight: 600, marginBottom: 18, fontSize: 22 }}>All Cat Facts</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#6366f1', fontSize: 18 }}>Loading...</div>
        ) : facts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 16 }}>No cat facts found.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {facts.map(f => (
              <li key={f.id || f.fact} style={{ background: '#f1f5f9', borderRadius: 8, marginBottom: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #c7d2fe22' }}>
                <span style={{ flex: 1, color: '#334155', fontSize: 16 }}>{f.fact}</span>
                <span style={{ color: '#6366f1', fontSize: 13, marginLeft: 16 }}>{f.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
