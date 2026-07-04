const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type GeocodedLocation = {
  lat: number;
  lng: number;
};

export async function geocodeAddress(
  address: string,
): Promise<GeocodedLocation | null> {
  const encoded = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&country=NG&limit=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features || data.features.length === 0) {
    console.warn(`Could not geocode address: ${address}`);
    return null;
  }

  const [lng, lat] = data.features[0].center;
  return { lat, lng };
}
