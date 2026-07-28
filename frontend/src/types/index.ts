// Frontend TypeScript Models for Ajak Abi Store

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  icon_url: string;
  sort_order: number;
}

export interface BundlingItemRecipe {
  product_id: string;
  name: string;
  qty: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock: number;
  sku_variant: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  photo_urls: string[];
  admin_reply?: string;
  user_name?: string;
  user_avatar?: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  base_price: number;
  discount_price?: number | null;
  weight_grams: number;
  sku: string;
  images: string[];
  is_bundling: boolean;
  bundling_items: BundlingItemRecipe[];
  rating_avg: number;
  review_count: number;
  status: 'active' | 'draft' | 'out_of_stock';
  is_featured: boolean;
  variants?: ProductVariant[];
  category?: Category;
  related_products?: Product[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string | null;
  qty: number;
  price_snapshot: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  full_address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  is_default: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string | null;
  product_name_snapshot: string;
  price_snapshot: number;
  qty: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  address_snapshot: {
    recipient_name: string;
    phone: string;
    full_address: string;
    city?: string;
  };
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'menunggu_pembayaran' | 'diproses' | 'dikemas' | 'dikirim' | 'selesai' | 'dibatalkan';
  shipping_courier: string;
  tracking_number?: string | null;
  notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface ShippingRateOption {
  courier_code: string;
  courier_name: string;
  service_name: string;
  price: number;
  estimated_days: string;
  description: string;
}
