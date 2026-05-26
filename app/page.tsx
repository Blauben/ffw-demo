  'use client';

  import { useEffect, useState } from 'react';
  import './input/style.css';

  export default function App() {
    type Einsatz = {
      description: string;
      vehicle: string;
      location: string;
    };
    const [einsatz, setEinsatz] = useState<Einsatz | null>(null);

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
            <p>{einsatz.location}</p>
          </div>
        ) : (
          <p>Keine Einsätze vorhanden</p>
        )}
      </main>
    );
  }