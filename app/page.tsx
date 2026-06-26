'use client';

import { useEffect, useState } from 'react';
import { Einsatz } from './model/types';
import dynamic from 'next/dynamic';
import './style.css';
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

  return einsatz ? (
    <div className="input-grid" id="einsatz-display">
      <div>
        <h1>FFL Einsatz</h1>
        <div className="card" id="einsatz-details">
          <h2>Einsatz</h2>
          <p>{einsatz.description}</p>

          <h2>Fahrzeug</h2>
          <p>{einsatz.vehicle}</p>

          <h2>Ort</h2>
          <p>{einsatz.location}</p>
        </div>
      </div>

      <div className="leaflet-container">
        <Map einsatz={einsatz} />
      </div>
    </div>
  ) : (
    <div>
      <h1>FFL Einsatz</h1>
      <p>Keine Einsätze vorhanden</p>
    </div>
  );
}
