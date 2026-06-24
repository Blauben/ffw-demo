import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Einsatz } from './model/types';

export default function Map({ einsatz }: { einsatz: Einsatz }) {
  return (
    <MapContainer
      center={
        einsatz.selectedCoordinates
          ? [einsatz.selectedCoordinates.lat, einsatz.selectedCoordinates.lon]
          : [48.7008307, 11.345242]
      }
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {einsatz.selectedCoordinates && (
        <Marker position={[einsatz.selectedCoordinates.lat, einsatz.selectedCoordinates.lon]} />
      )}
    </MapContainer>
  );
}
