const NOMINATIM_TIMEOUT_MS = 5000;
const NOMINATIM_MIN_INTERVAL_MS = 1000;
let lastLookupAt = 0;
let lookupQueue = Promise.resolve();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseCoordinate = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const isValidCoordinate = (lat, lon) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;

const reverseLookup = async (lat, lon) => {
    const elapsed = Date.now() - lastLookupAt;
    if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
        await wait(NOMINATIM_MIN_INTERVAL_MS - elapsed);
    }

    const query = new URLSearchParams({
        format: 'jsonv2',
        lat: String(lat),
        lon: String(lon),
        zoom: '18',
        addressdetails: '1',
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query.toString()}`, {
        signal: AbortSignal.timeout(NOMINATIM_TIMEOUT_MS),
        headers: {
            'User-Agent': 'ffw-demo/1.0 (https://github.com/Blauben/ffw-demo)',
        },
    });

    lastLookupAt = Date.now();

    if (!response.ok) {
        return null;
    }

    const payload = await response.json();
    return typeof payload.display_name === 'string' ? payload.display_name : null;
};

export async function POST(req) {
    try {
        const body = await req.json();
        const lat = parseCoordinate(body?.lat);
        const lon = parseCoordinate(body?.lon);

        if (lat === null || lon === null || !isValidCoordinate(lat, lon)) {
            return Response.json({ error: 'Ungültige Koordinaten' }, { status: 400 });
        }

        const lookupPromise = lookupQueue.then(() => reverseLookup(lat, lon));
        lookupQueue = lookupPromise.catch(() => null);
        const location = await lookupPromise;

        return Response.json({
            location: location || `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
        });
    } catch (error) {
        console.warn('OpenStreetMap reverse lookup failed.', error);
        return Response.json({ error: 'Ort konnte nicht bestimmt werden' }, { status: 500 });
    }
}
