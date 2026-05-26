'use client';

import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Coordinates = {
    lat: number;
    lon: number;
};

type LocationPickerMapProps = {
    selectedCoordinates: Coordinates | null;
    onSelect: (coordinates: Coordinates) => void;
};

// Geographic center of Germany.
const DEFAULT_CENTER: [number, number] = [51.1657, 10.4515];
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 14;

function ClickHandler({ onSelect }: { onSelect: (coordinates: Coordinates) => void }) {
    useMapEvents({
        click(event) {
            onSelect({ lat: event.latlng.lat, lon: event.latlng.lng });
        },
    });

    return null;
}

function RecenterOnSelection({ selectedCoordinates }: { selectedCoordinates: Coordinates | null }) {
    const map = useMap();

    if (selectedCoordinates) {
        map.setView([selectedCoordinates.lat, selectedCoordinates.lon], SELECTED_ZOOM);
    }

    return null;
}

export default function LocationPickerMap({ selectedCoordinates, onSelect }: LocationPickerMapProps) {
    const center = selectedCoordinates
        ? [selectedCoordinates.lat, selectedCoordinates.lon] as [number, number]
        : DEFAULT_CENTER;
    const zoom = selectedCoordinates ? SELECTED_ZOOM : DEFAULT_ZOOM;

    return (
        <div className="map-wrapper">
            <MapContainer
                center={center}
                zoom={zoom}
                className="location-map"
                aria-label="Interaktive Karte zur Ortsauswahl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler onSelect={onSelect} />
                <RecenterOnSelection selectedCoordinates={selectedCoordinates} />
                {selectedCoordinates && (
                    <CircleMarker
                        center={[selectedCoordinates.lat, selectedCoordinates.lon]}
                        radius={8}
                        pathOptions={{ color: '#cc0000', fillColor: '#cc0000', fillOpacity: 0.8 }}
                    />
                )}
            </MapContainer>
            <p className="map-hint">Klicken Sie in die Karte, um den Ort zu übernehmen.</p>
        </div>
    );
}
