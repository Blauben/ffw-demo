  'use client';

  import { useEffect, useState } from 'react';
  import './input/style.css';
  const MAP_IFRAME_HEIGHT = 250;

  type EinsatzLocation = string | {
    label: string;
    lat: number;
    lon: number;
    osmUrl: string;
    embedUrl: string;
  };

  type Einsatz = {
    description: string;
    vehicle: string;
    location: EinsatzLocation;
  };

  export default function App() {
    const [einsatz, setEinsatz] = useState<Einsatz | null>(null);
    const location = einsatz?.location;
    const hasMap = typeof location === 'object' && location !== null;

    useEffect(() => {
      const es = new EventSource('/api/einsatz/stream');

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('Einsatz-Update erhalten:', payload);
          setEinsatz(payload);
        } catch (e) {
          // ignore keep-alive/comment frames
        }
      };

      return () => es.close();
    }, []);

    return (
      <main>
        <h1>FFL Einsatz Demo</h1>

        {einsatz ? (
          <div className="card">
            <h2>Einsatz</h2>
            <p>{einsatz.description}</p>

            <h3>Fahrzeug</h3>
            <p>{einsatz.vehicle}</p>

            <h3>Ort</h3>
            <p>{hasMap ? location.label : location}</p>
            {hasMap && (
              <>
                <p>
                  <a href={location.osmUrl} target="_blank" rel="noreferrer">
                    In OpenStreetMap öffnen
                  </a>
                </p>
                <iframe
                  title="OpenStreetMap"
                  src={location.embedUrl}
                  style={{ border: 0, width: '100%', height: `${MAP_IFRAME_HEIGHT}px` }}
                />
              </>
            )}
          </div>
        ) : (
          <p>Keine Einsätze vorhanden</p>
        )}
      </main>
    );
  }