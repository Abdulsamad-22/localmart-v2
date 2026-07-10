export type Color = { code: string; name: string };

export type ProductRow = {
  id: string;
  image_url: string;
  item_name: string;
  item_description: string;
  item_price: number;
  item_category: string;
  vendorId: number;
  item_sizes?: string[] | null;
  item_colors?: Color[] | null;
  item_units: number;
  quantity: number;
  in_stock: number;
};

export interface DraftProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description: string;
  units: number;
  sizes?: string[] | null;
  colors?: Color[];
}

export type WishlistProducts = ProductRow;

export type ProductsWithVendor = ProductRow & {
  vendor: {
    id: string;
    business_name: string;
    business_address: string;
    latitude: number | null;
    longitude: number | null;
  };
};
