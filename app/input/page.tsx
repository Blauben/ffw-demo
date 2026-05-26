'use client';

import { useState } from 'react';
import './style.css';
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function InputPage() {
    const [description, setDescription] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [location, setLocation] = useState("");

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
                </form>
                <LocationPicker />
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