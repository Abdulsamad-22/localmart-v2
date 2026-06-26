type Color = { code: string; name: string };

export type ProductRow = {
  id: number;
  image_url: string;
  item_name: string;
  name: string;
  description: string;
  item_price: number;
  price: number;
  category: string;
  vendorId: number;
  sizes?: string[];
  colors?: Color[];
  item_units: number;
  // quantity: number
  in_stock: number;
};

export interface DraftProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  description: string;
  units: number;
  sizes?: string[];
  colors?: Color[];
}

export type WishlistProducts = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes?: string[];
  colors?: Color[];
};
