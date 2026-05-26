import emitter from '@/lib/emitter';

const BOUNDING_BOX_OFFSET = 0.01;

export async function POST(req) {
  const body = await req.json();
  const enrichedBody = { ...body };
  const location = typeof body.location === 'string' ? body.location.trim() : '';

  if (location) {
    try {
      const query = new URLSearchParams({
        q: location,
        format: 'jsonv2',
        limit: '1',
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
        headers: {
          'User-Agent': 'ffw-demo/1.0 (https://github.com/Blauben/ffw-demo)',
        },
      });

      if (response.ok) {
        const [result] = await response.json();
        if (result?.lat && result?.lon) {
          const lat = Number(result.lat);
          const lon = Number(result.lon);

          if (Number.isFinite(lat) && Number.isFinite(lon)) {
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
              osmUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`,
              embedUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join('%2C')}&layer=mapnik&marker=${lat}%2C${lon}`,
            };
          }
        }
      }
    } catch (error) {
      console.warn('OpenStreetMap lookup failed for location payload.', error);
    }
  }

  emitter.emit('einsatz-update', enrichedBody);

  return Response.json({ success: true });
}