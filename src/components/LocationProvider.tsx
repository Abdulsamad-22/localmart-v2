"use client";

import getBuyerLocation from "@/lib/buyers/getBuyersLocation";
import useBuyerStore from "@/state-store/buyerStore";
import { useEffect } from "react";

export function LocationProvider() {
  const setLocation = useBuyerStore((state) => state.setLocation);
  const setLocationError = useBuyerStore((state) => state.setLocationError);

  useEffect(() => {
    getBuyerLocation()
      .then((location) => setLocation(location))
      .catch((error) => setLocationError(error.message));
  }, [setLocation, setLocationError]);

  return null;
}
