import { CartItem } from "./cart";
import { CheckoutVendor, CheckoutFormData } from "./checkout";

export type CreateOrderParams = {
  cartItems: CartItem[];
  vendors: CheckoutVendor[];
  checkoutData: CheckoutFormData;
  paymentReference: string;
  paymentData: {
    totalAmount: number;
    vendorTotals: Record<string, number>;
    summary: {
      platformFee: number;
      vendorPayouts: number;
    };
  };
  buyerId: string;
};

export type OrderStatus =
  | "paid"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  order_id: number;
  vendor_id: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  total: number;
  selected_size: string | null;
  selected_color: { name: string; code: string } | null;
  status: OrderStatus;
  status_updated_at: string;
  is_read: boolean;
  created_at: string;
};

export type Order = {
  id: number;
  created_at: string;
  customer_id: string;
  payment_reference: string;
  total_amount: number;
  platform_fee: number;
  vendor_amount: number;
  status: string;
  updated_at: string;
  contact_firstname: string;
  contact_surname: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  delivery_firstname: string;
  delivery_surname: string;
  delivery_email: string;
  delivery_phone: string;
  delivery_address: string;
  is_different_delivery: boolean;
  is_read: boolean;
};

// shared base — fields common to both
type OrderItemBase = {
  id: number;
  order_id: number;
  vendor_id: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  total: number;
  selected_size: string | null;
  selected_color: { name: string; code: string } | null;
  status: OrderStatus;
  is_read: boolean;
  created_at: string;
  status_updated_at: string;
};

// list page — minimal order fields
export type OrderItemWithOrder = OrderItemBase & {
  orders: {
    id: number;
    payment_reference: string;
    total_amount: number;
    contact_firstname: string;
    contact_surname: string;
    contact_email: string;
    created_at: string;
  } | null;
};

// detail page — full order fields
export type OrderItemDetail = OrderItemBase & {
  orders: {
    id: number;
    payment_reference: string;
    total_amount: number;
    contact_firstname: string;
    contact_surname: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    delivery_firstname?: string;
    delivery_surname?: string;
    delivery_email?: string;
    delivery_phone?: string;
    delivery_address?: string;
    is_different_delivery: boolean;
    created_at: string;
  } | null;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
