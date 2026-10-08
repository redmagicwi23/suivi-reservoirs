import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [reservoir, setReservoir] = useState('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [heure, setHeure] = useState(new Date().toTimeString().slice(0, 5));
  const [pression, setPression] = useState('');
  const [temperature, setTemperature] = useState('');
  const [niveau, setNiveau] = useState('');
  const [notes, setNotes] = useState('');
  const [releves, setReleves] = useState(() => {
    const saved = localStorage.getItem('releves_reservoirs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('releves_reservoirs', JSON.stringify(releves));
  }, [releves]);

  const enregistrer = () => {
    if (pression === '' || temperature === '' || niveau === '') {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    const nouveau = {
      id: Date.now(),
      reservoir,
      date,
      heure,
      pression: parseFloat(pression),
      temperature: parseFloat(temperature),
      niveau: parseFloat(niveau),
      notes,
    };
    setReleves([nouveau, ...releves]);
    setPression('');
    setTemperature('');
    setNiveau('');
    setNotes('');
    alert('✅ Relevé enregistré !');
  };

  const supprimer = (id) => {
    if (confirm('🗑️ Supprimer ce relevé ?')) {
      setReleves(releves.filter((r) => r.id !== id));
    }
  };

  const alertes = (r) => {
    const a = [];
    if (r.pression > 180) a.push(`🔴 Pression: ${r.pression} mbars`);
    if (r.temperature > 0) a.push(`🔴 Température: ${r.temperature}°C`);
    if (r.niveau > 17) a.push(`🔴 Niveau: ${r.niveau} m`);
    return a;
  };

  const donneesA = releves
    .filter((r) => r.reservoir === 'A')
    .sort((a, b) => new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`))
    .map((r) => ({
      date: `${r.date.slice(5)} ${r.heure}`,
      Pression: r.pression,
      Température: r.temperature,
      Niveau: r.niveau,
    }));

  const donneesB = releves
    .filter((r) => r.reservoir === 'B')
    .sort((a, b) => new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`))
    .map((r) => ({
      date: `${r.date.slice(5)} ${r.heure}`,
      Pression: r.pression,
      Température: r.temperature,
      Niveau: r.niveau,
    }));

  return (
    <div className="app">
      <header className="header">
        <h1>🛢️ Suivi Réservoirs</h1>
        <p>Pression • Température • Niveau</p>
      </header>

      <div className="tabs">
        <button className={reservoir === 'A' ? 'tab active' : 'tab'} onClick={() => setReservoir('A')}>
          Réservoir A
        </button>
        <button className={reservoir === 'B' ? 'tab active' : 'tab'} onClick={() => setReservoir('B')}>
          Réservoir B
        </button>
      </div>

      <div className="card">
        <h2>📝 Nouveau relevé — Réservoir {reservoir}</h2>
        <div className="form">
          <div className="field">
            <label>📅 Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>🕐 Heure</label>
            <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
          </div>
          <div className="field">
            <label>🔵 Pression (mbars)</label>
            <input type="number" step="0.1" value={pression} onChange={(e) => setPression(e.target.value)} placeholder="0 - 180" />
          </div>
          <div className="field">
            <label>🌡️ Température (°C)</label>
            <input type="number" step="0.1" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="-33 à 0" />
          </div>
          <div className="field">
            <label>📏 Niveau (m)</label>
            <input type="number" step="0.1" value={niveau} onChange={(e) => setNiveau(e.target.value)} placeholder="0 - 17" />
          </div>
          <div className="field full">
            <label>📝 Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations..." />
          </div>
        </div>
        <button className="btn-save" onClick={enregistrer}>💾 ENREGISTRER</button>
      </div>

      <div className="card">
        <h2>📊 Évolution — Réservoir A</h2>
        {donneesA.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donneesA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Pression" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Température" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Niveau" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="vide">Aucune donnée pour le Réservoir A</p>
        )}
      </div>

      <div className="card">
        <h2>📊 Évolution — Réservoir B</h2>
        {donneesB.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donneesB}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Pression" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Température" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Niveau" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="vide">Aucune donnée pour le Réservoir B</p>
        )}
      </div>

      <div className="card">
        <h2>📋 Historique ({releves.length})</h2>
        {releves.length === 0 ? (
          <p className="vide">Aucun relevé enregistré</p>
        ) : (
          <div className="liste">
            {releves.map((r) => {
              const alertesR = alertes(r);
              return (
                <div key={r.id} className={alertesR.length > 0 ? 'item alert' : 'item'}>
                  <div className="item-header">
                    <strong>🛢️ Réservoir {r.reservoir}</strong>
                    <span>📅 {r.date} 🕐 {r.heure}</span>
                  </div>
                  <div className="item-data">
                    <span>🔵 {r.pression} mbars</span>
                    <span>🌡️ {r.temperature}°C</span>
                    <span>📏 {r.niveau} m</span>
                  </div>
                  {r.notes && <p className="notes">📝 {r.notes}</p>}
                  {alertesR.length > 0 && (
                    <div className="alertes">
                      {alertesR.map((a, i) => <div key={i}>{a}</div>)}
                    </div>
                  )}
                  <button className="btn-delete" onClick={() => supprimer(r.id)}>🗑️ Supprimer</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>💾 Données sauvegardées localement sur votre appareil</p>
      </footer>
    </div>
  );
}

export default App;
