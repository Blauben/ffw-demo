export type Coordinates = {
  lat: number;
  lon: number;
};

export type Einsatz = {
  description: string;
  vehicle: string;
  location: string;
  selectedCoordinates: Coordinates | null;
  zoomLevel: number;
};
