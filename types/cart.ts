import { ProductRow, Color } from "./product";

export type CartItem = {
  product: ProductRow;
  quantity: number;
  selectedColor?: Color | null;
  selectedSize?: string | null;
};
