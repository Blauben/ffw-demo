import emitter from '@/lib/emitter';

const BOUNDING_BOX_OFFSET = 0.01;
const DEFAULT_MAP_ZOOM_LEVEL = 15;
const NOMINATIM_TIMEOUT_MS = 5000;
const NOMINATIM_MIN_INTERVAL_MS = 1000;
let lastNominatimLookupAt = 0;
let nominatimQueue = Promise.resolve(null);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const parseCoordinate = (value) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

const lookupLocation = async (location) => {
  const now = Date.now();
  const elapsed = now - lastNominatimLookupAt;
  if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
    await wait(NOMINATIM_MIN_INTERVAL_MS - elapsed);
  }

  const query = new URLSearchParams({
    q: location,
    format: 'jsonv2',
    limit: '1',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
    signal: AbortSignal.timeout(NOMINATIM_TIMEOUT_MS),
    headers: {
      'User-Agent': 'ffw-demo/1.0 (https://github.com/Blauben/ffw-demo)',
    },
  });

  lastNominatimLookupAt = Date.now();
  if (!response.ok) {
    return null;
  }

  const [result] = await response.json();
  if (!result?.lat || !result?.lon) {
    return null;
  }

  const lat = parseCoordinate(result.lat);
  const lon = parseCoordinate(result.lon);
  if (lat === null || lon === null) {
    return null;
  }

  return { lat, lon };
};

export async function POST(req) {
  const body = await req.json();
  const enrichedBody = { ...body };
  const location = typeof body.location === 'string' ? body.location.trim() : '';

  if (location) {
    try {
      const lookupPromise = nominatimQueue.then(() => lookupLocation(location));
      nominatimQueue = lookupPromise.catch(() => null);
      const coordinates = await lookupPromise;

      if (coordinates) {
        const { lat, lon } = coordinates;
        const bbox = [
          (lon - BOUNDING_BOX_OFFSET).toFixed(5),
          (lat - BOUNDING_BOX_OFFSET).toFixed(5),
          (lon + BOUNDING_BOX_OFFSET).toFixed(5),
          (lat + BOUNDING_BOX_OFFSET).toFixed(5),
        ];

        enrichedBody.location = {
          label: location,
          lat,
          lon,
          osmUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${DEFAULT_MAP_ZOOM_LEVEL}/${lat}/${lon}`,
          embedUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join('%2C')}&layer=mapnik&marker=${lat}%2C${lon}`,
        };
      }
    } catch (error) {
      console.warn('OpenStreetMap lookup failed for location:', location, error);
    }
  }

  emitter.emit('einsatz-update', enrichedBody);

  return Response.json({ success: true });
}