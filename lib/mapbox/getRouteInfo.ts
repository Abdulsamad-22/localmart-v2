const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;

type RouteInfo =
  | { withinRange: true; distanceKm: number; durationMinutes: number }
  | { withinRange: false; vendorAddress: string };

export async function getRouteInfo(
  buyerLat: number,
  buyerLng: number,
  vendorLat: number,
  vendorLng: number,
  vendorAddress: string,
): Promise<RouteInfo> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${buyerLng},${buyerLat};${vendorLng},${vendorLat}?access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || data.routes.length === 0) {
    // no route found — fall back to showing address
    return { withinRange: false, vendorAddress };
  }

  const route = data.routes[0];
  const durationSeconds: number = route.duration;
  const distanceMeters: number = route.distance;

  if (durationSeconds > THREE_HOURS_IN_SECONDS) {
    return { withinRange: false, vendorAddress };
  }

  return {
    withinRange: true,
    distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
    durationMinutes: Math.round(durationSeconds / 60),
  };
}
