// ============================================================================
// AJAK ABI STORE - CORE TYPEScript INTERFACES
// ============================================================================

export interface StoreUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
  created_at?: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  icon_url?: string;
  sort_order: number;
  sub_categories?: StoreCategory[];
}

export interface BundlingItemRecipe {
  product_id: string;
  name: string;
  qty: number;
}

export interface StoreProduct {
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
  variants?: StoreProductVariant[];
  category?: StoreCategory;
}

export interface StoreProductVariant {
  id: string;
  product_id: string;
  variant_name: string; // e.g. "Warna" or "Ukuran"
  variant_value: string; // e.g. "Putih Bersih" or "Jumbo"
  price_adjustment: number;
  stock: number;
  sku_variant: string;
}

export interface StoreCart {
  id: string;
  user_id?: string | null;
  guest_session_id?: string | null;
  items?: StoreCartItem[];
}

export interface StoreCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id?: string | null;
  qty: number;
  price_snapshot: number;
  product?: StoreProduct;
  variant?: StoreProductVariant;
}

export interface StoreWishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
}

export interface StoreAddress {
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

export interface StoreOrder {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  address_id?: string | null;
  address_snapshot: Record<string, any>;
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
  items?: StoreOrderItem[];
}

export interface StoreOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string | null;
  product_name_snapshot: string;
  price_snapshot: number;
  qty: number;
  subtotal: number;
}

export interface StorePayment {
  id: string;
  order_id: string;
  provider: 'midtrans' | 'xendit';
  provider_ref_id?: string;
  amount: number;
  status: string;
  paid_at?: string;
  raw_payload?: Record<string, any>;
}

export interface StoreReview {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id?: string | null;
  rating: number;
  comment: string;
  photo_urls: string[];
  admin_reply?: string;
  status: 'published' | 'hidden';
  user_name?: string;
  user_avatar?: string;
  created_at?: string;
}

export interface StoreVoucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount?: number | null;
  quota: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  applicable_category_id?: string | null;
}

export interface StoreBanner {
  id: string;
  image_url: string;
  title: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface StoreAuditLog {
  id: string;
  actor_id?: string | null;
  action: string;
  entity: string;
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
}
