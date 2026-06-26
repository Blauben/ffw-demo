import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Einsatz } from './model/types';
import { useEffect } from 'react';

// Inner component that has access to the map instance
function MapUpdater({ einsatz }: { einsatz: Einsatz }) {
  const map = useMap();

  useEffect(() => {
    const center: LatLngExpression = einsatz.selectedCoordinates
      ? [einsatz.selectedCoordinates.lat, einsatz.selectedCoordinates.lon]
      : [48.7008307, 11.345242];
    const zoom = einsatz.zoomLevel ?? 13;

    map.flyTo(center, zoom);
  }, [einsatz, map]);

  return null;
}

export default function Map({ einsatz }: { einsatz: Einsatz }) {
  const initialCenter: LatLngExpression = einsatz.selectedCoordinates
    ? [einsatz.selectedCoordinates.lat, einsatz.selectedCoordinates.lon]
    : [48.7008307, 11.345242];

  return (
    <MapContainer
      center={initialCenter}
      zoom={einsatz.zoomLevel ?? 13}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {einsatz.selectedCoordinates && (
        <Marker position={[einsatz.selectedCoordinates.lat, einsatz.selectedCoordinates.lon]} />
      )}
      <MapUpdater einsatz={einsatz} />
    </MapContainer>
  );
}