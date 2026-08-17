"use client";

import { useEffect, useState } from "react";
import { getRouteInfo } from "@/lib/mapbox/getRouteInfo";
import useBuyerStore from "@/state-store/buyerStore";
import formatDuration from "@/utils/formatDeliveryTime";
import { Truck } from "@phosphor-icons/react";

type VendorLocation = {
  id: string;
  business_name: string;
  business_address: string;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  vendor: VendorLocation;
};

type RouteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "withinRange"; distanceKm: number; durationMinutes: number }
  | { status: "tooFar"; vendorAddress: string }
  | { status: "error" };

export function VendorDistance({ vendor }: Props) {
  const location = useBuyerStore((state) => state.location);
  const [route, setRoute] = useState<RouteState>({ status: "idle" });

  useEffect(() => {
    if (!location) return;

    // vendor has no coordinates stored — can't calculate
    if (!vendor.latitude || !vendor.longitude) {
      setRoute({ status: "tooFar", vendorAddress: vendor.business_address });
      return;
    }

    setRoute({ status: "loading" });

    getRouteInfo(
      location.lat,
      location.lng,
      vendor.latitude,
      vendor.longitude,
      vendor.business_address,
    )
      .then((result) => {
        if (result.withinRange) {
          setRoute({
            status: "withinRange",
            distanceKm: result.distanceKm,
            durationMinutes: result.durationMinutes,
          });
        } else {
          setRoute({
            status: "tooFar",
            vendorAddress: result.vendorAddress,
          });
        }
      })
      .catch(() => setRoute({ status: "error" }));
  }, [location, vendor.latitude, vendor.longitude]);

  if (!location) return <p>Enable location to see distance</p>;
  if (route.status === "idle" || route.status === "loading")
    return <p>Calculating...</p>;
  if (route.status === "error") return <p>Could not calculate distance</p>;
  if (route.status === "tooFar") return <p>{route.vendorAddress}</p>;

  return (
    <p className="line-clamp-1">
      <Truck size={16} className="inline-block mr-1" />
      {formatDuration(route.durationMinutes)} drive
    </p>
  );
}
