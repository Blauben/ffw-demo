'use client';

import { useEffect, useState } from 'react';
import './input/style.css';
import { Einsatz } from './model/types';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function App() {
  const [einsatz, setEinsatz] = useState<Einsatz | null>(null);

  useEffect(() => {
    const es = new EventSource('/api/einsatz/stream');

    es.onmessage = event => {
      try {
        const payload = JSON.parse(event.data);
        console.log('Einsatz-Update erhalten:', payload);
        setEinsatz(payload);
      } catch (e) {
        // ignore keep-alive/comment frames
        console.error('Fehler beim Parsen des Einsatz-Updates:', e);
      }
    };

    return () => es.close();
  }, []);

  return (
    <main>
      <h1>FFL Einsatz</h1>

      {einsatz ? (
        <div className="input-grid">
          <div className="card">
            <h2>Einsatz</h2>
            <p>{einsatz.description}</p>

            <h3>Fahrzeug</h3>
            <p>{einsatz.vehicle}</p>

            <h3>Ort</h3>
            <p>{einsatz.location}</p>
          </div>
          <div>
            <Map einsatz={einsatz} />
          </div>
        </div>
      ) : (
        <p>Keine Einsätze vorhanden</p>
      )}
    </main>
  );
}
