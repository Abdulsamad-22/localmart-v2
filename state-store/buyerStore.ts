import { create } from "zustand";

type BuyerLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
};

type BuyerStore = {
  location: BuyerLocation | null;
  locationError: string | null;
  setLocation: (location: BuyerLocation) => void;
  setLocationError: (error: string) => void;
};

const useBuyerStore = create<BuyerStore>((set) => ({
  location: null,
  locationError: null,
  setLocation: (location) => set({ location, locationError: null }),
  setLocationError: (error) => set({ locationError: error, location: null }),
}));

export default useBuyerStore;
