import React, { useEffect, useState } from 'react';
// import { useTheme } from './ThemeContext';
import CatPaw3D from './CatPaw3D';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pawAction, setPawAction] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');


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
      setPawAction(true);
      setTimeout(() => setPawAction(false), 500);
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
      setPawAction(true);
      setTimeout(() => setPawAction(false), 500);
    } else {
      setMessage(data.message || "Error deleting fact");
    }
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    if (!facts.length) return;
    const header = ['id', 'fact', 'created_at'];
    const rows = facts.map(f => [f.id, '"' + (f.fact || '').replace(/"/g, '""') + '"', f.created_at]);
    const csvContent = [header, ...rows]
      .map(e => e.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    let filename = window.prompt('Enter a filename for your CSV (without extension):', 'cat_facts_export');
    if (filename === null) {
      // User cancelled the prompt, do not download
      URL.revokeObjectURL(url);
      return;
    }
    if (!filename) {
      filename = 'cat_facts_export';
    }
    if (!filename.endsWith('.csv')) {
      filename += '.csv';
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Inline edit handlers
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
    fetch(`/catfacts/${factObj.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fact: newFact })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setFacts(facts.map(f => f.id === factObj.id ? { ...f, fact: newFact } : f));
          setMessage('Fact updated!');
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

  // Styles for light mode only (consistent with landing page)
  const bgGradient = 'linear-gradient(to top right, #fff7fb, #e0f7fa)';
  const cardBg = '#fff';
  const cardShadow = '0 4px 24px #c7d2fe55';
  const textColor = '#334155';
  const inputBg = '#f1f5f9';
  const inputBorder = '#c7d2fe';
  const factBg = '#f1f5f9';
  const deleteBtnBg = '#dc2626';
  const deleteBtnColor = '#fff';

  // Animation CSS
  const transitionStyles = `
    .fact-enter {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    .fact-enter-active {
      opacity: 1;
      transform: translateY(0) scale(1);
      transition: opacity 350ms, transform 350ms;
    }
    .fact-exit {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .fact-exit-active {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
      transition: opacity 350ms, transform 350ms;
    }
  `;

  return (
  <div style={{
    height: '100vh',
    background: bgGradient,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0rem'
  }}>
    <style>{transitionStyles}</style>
    <div style={{
      width: '100%',
      maxWidth: 600,
      background: cardBg,
      borderRadius: 16,
      boxShadow: cardShadow,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      padding: '0 2rem 0rem 2rem'
    }}>
      {/* Header and form */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#6366f1', fontWeight: 700 }}>🐱 Cat Fact Tracker</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            type="text"
            value={newFact}
            onChange={e => setNewFact(e.target.value)}
            placeholder="Add a new cat fact"
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: `1px solid ${inputBorder}`,
              borderRadius: 8,
              fontSize: 16,
              background: inputBg,
              color: textColor
            }}
          />
          <button type="submit" style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            Add
          </button>
          <button type="button" onClick={handleExportCSV} style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            Export to CSV
          </button>
        </form>

        {message && (
          <div style={{
            marginBottom: 16,
            color: message.includes('added') || message.includes('deleted') ? '#16a34a' : '#dc2626',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {message}
          </div>
        )}

        <h2 style={{ color: textColor, fontWeight: 600, marginBottom: 12 }}>All Cat Facts</h2>
      </div>

      {/* Scrollable list area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#6366f1', fontSize: 18 }}>Loading...</div>
        ) : facts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: 16 }}>No cat facts found.</div>
        ) : (
          <TransitionGroup component="ul" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {facts.map(f => (
              <CSSTransition key={f.id || f.fact} timeout={350} classNames="fact">
                <li style={{
                  background: factBg,
                  borderRadius: '1rem',
                  marginBottom: '1rem',
                  padding: '1.2rem 1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {editingId === f.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        style={{
                          flex: 1,
                          fontSize: '1.05rem',
                          padding: '0.3rem 0.5rem',
                          border: `1px solid ${inputBorder}`,
                          borderRadius: 6,
                          color: textColor
                        }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEditFact(f);
                          if (e.key === 'Escape') cancelEditFact();
                        }}
                      />
                      <button onClick={() => saveEditFact(f)} style={{ marginLeft: 4, color: '#10b981', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Save">✔️</button>
                      <button onClick={cancelEditFact} style={{ color: '#dc2626', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} title="Cancel">✖️</button>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '1.05rem', color: textColor }}>
                      {f.fact}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 14,
                    // color: darkMode ? '#a5b4fc' : '#64748b'
                  }}>
                    <span>{f.created_at}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {/* Edit icon */}
                      <button
                        onClick={() => startEditFact(f)}
                        title="Edit"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6366f1',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}
                        disabled={editingId !== null && editingId !== f.id}
                      >
                        ✏️
                      </button>
                      <button
                        title="Like"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        onClick={() => { }}
                      >
                        ❤️ {f.likes || 0}
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        title="Delete"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          fontSize: '1.1rem',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </div>
    </div>
  </div>
);

}

export default App;