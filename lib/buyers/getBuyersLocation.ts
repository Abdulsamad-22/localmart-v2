const DEFAULT_TIMEOUT = 10000;

type LocationData = {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
};

export default function getBuyerLocation(
  timeout = DEFAULT_TIMEOUT,
): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.code, error.message);

        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position unavailable. Please check your GPS.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred getting your location.";
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout,
        maximumAge: 300000,
      },
    );
  });
}
