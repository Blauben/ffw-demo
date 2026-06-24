'use client';
import { useCallback, useState } from 'react';
import './style.css';
import dynamic from 'next/dynamic';
import { Coordinates } from '../model/types';

const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function InputPage() {
  const [description, setDescription] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/einsatz/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, vehicle, location, selectedCoordinates }),
      });
      if (!response.ok) throw new Error('Einsatz konnte nicht gesendet werden');
      console.log('Einsatz-Update gesendet:', {
        description,
        vehicle,
        location,
        selectedCoordinates,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationSelect = useCallback((coords: Coordinates) => {
    setSelectedCoordinates(coords);
  }, []); // empty deps — function never needs to change

  return (
    <div className="input-grid">
      <div className="input-fields">
        <h1>Einsatz einspielen</h1>
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="vehicle">Fahrzeug:</label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            value={vehicle}
            onChange={e => setVehicle(e.target.value)}
            placeholder="Fahrzeug..."
          />
        </form>
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="location">Ort:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Ort..."
          />
        </form>
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="description">Beschreibung:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Beschreiben Sie den Einsatz..."
          />
        </form>
        <div className="save-button-container">
          <button type="button" onClick={handleSave}>
            Einsatz senden
          </button>
        </div>
      </div>

      <div className="location-picker-container">
        <LocationPicker markerUpdate={handleLocationSelect} />
      </div>
    </div>
  );
}
