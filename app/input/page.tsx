'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import './style.css';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
    ssr: false,
});

export default function InputPage() {
    const [description, setDescription] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [location, setLocation] = useState("");
    const [locationStatus, setLocationStatus] = useState("");
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    const handleMapSelect = async (coordinates: { lat: number; lon: number }) => {
        setSelectedCoordinates(coordinates);
        setLocation(`${coordinates.lat.toFixed(5)}, ${coordinates.lon.toFixed(5)}`);
        setLocationStatus('Suche Adresse...');

        try {
            const response = await fetch('/api/location/reverse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordinates),
            });

            if (!response.ok) {
                throw new Error('Reverse-Geocoding fehlgeschlagen');
            }

            const payload = await response.json();
            if (typeof payload.location === 'string' && payload.location.trim()) {
                setLocation(payload.location);
                setLocationStatus('Ort aus OpenStreetMap übernommen');
            } else {
                setLocationStatus('Koordinaten übernommen');
            }
        } catch (error) {
            console.error(error);
            setLocationStatus('Koordinaten übernommen (Adresse konnte nicht geladen werden)');
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/einsatz/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, vehicle, location }),
            });

            if (!response.ok) {
                throw new Error('Einsatz konnte nicht gesendet werden');
            }

            console.log('Einsatz-Update gesendet:', { description, vehicle, location });
        } catch (error) {
            console.error(error);
        } 
    };

    return (
        <div>
            <div>
                <h1>Einsatz einspielen</h1>
                <form>
                    <label htmlFor="vehicle">Fahrzeug:</label>
                    <input
                        type="text"
                        id="vehicle"
                        name="vehicle"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Fahrzeug..."
                    />
                </form>
                <form>
                    <label htmlFor="location">Ort:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ort..."
                    />
                    {locationStatus && <p className="location-status">{locationStatus}</p>}
                </form>
                <div className="map-picker">
                    <h2>Ort auf Karte wählen</h2>
                    <LocationPickerMap
                        selectedCoordinates={selectedCoordinates}
                        onSelect={handleMapSelect}
                    />
                </div>
                <form>
                    <label htmlFor="description">Beschreibung:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beschreiben Sie den Einsatz..."
                    />
                </form>
            </div>
            <div>
                <button id="save-button" type="button" onClick={handleSave}> Einsatz senden
                </button>
            </div>
        </div>
    )
}