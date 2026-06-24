import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { Coordinates } from '../model/types';

// Geographic center of Germany.
const DEFAULT_CENTER: [number, number] = [48.7008307, 11.345242];
const DEFAULT_ZOOM = 15;

function ClickHandler({ onSelect }: { onSelect: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click(event: { latlng: { lat: number; lng: number } }) {
      onSelect({ lat: event.latlng.lat, lon: event.latlng.lng });
    },
  });

  return null;
}

export default function LocationPicker({
  markerUpdate,
}: {
  markerUpdate: (coordinates: Coordinates) => void;
}) {
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(
    DEFAULT_CENTER ? { lat: DEFAULT_CENTER[0], lon: DEFAULT_CENTER[1] } : null
  );
  useEffect(() => {
    if (selectedCoordinates) {
      markerUpdate(selectedCoordinates);
    }
  }, [selectedCoordinates, markerUpdate]);

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onSelect={setSelectedCoordinates} />
      <Marker
        position={
          selectedCoordinates ? [selectedCoordinates.lat, selectedCoordinates.lon] : DEFAULT_CENTER
        }
      >
        <Popup>
          {selectedCoordinates
            ? `[${selectedCoordinates.lat}, ${selectedCoordinates.lon}]`
            : `[${DEFAULT_CENTER[0]}, ${DEFAULT_CENTER[1]}]`}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
