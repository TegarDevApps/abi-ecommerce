-- ============================================================================
-- AJAK ABI STORE (E-Commerce Perlengkapan Umrah & Haji)
-- Migration 01: Initial Schema & Row Level Security (RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. store_users: Customer and Admin accounts
CREATE TABLE IF NOT EXISTS store_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. store_categories: Nested categories for mega menu & catalog filtering
CREATE TABLE IF NOT EXISTS store_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  parent_id UUID REFERENCES store_categories(id) ON DELETE SET NULL,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. store_products: Core product catalog including bundle item recipes
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES store_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  brand VARCHAR(150),
  base_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(15, 2),
  weight_grams INTEGER NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  is_bundling BOOLEAN DEFAULT FALSE,
  bundling_items JSONB DEFAULT '[]'::jsonb,
  rating_avg NUMERIC(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. store_product_variants: Color, Size, or Edition choices
CREATE TABLE IF NOT EXISTS store_product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES store_products(id) ON DELETE CASCADE NOT NULL,
  variant_name VARCHAR(50) NOT NULL,
  variant_value VARCHAR(100) NOT NULL,
  price_adjustment NUMERIC(15, 2) DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  sku_variant VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. store_carts & store_cart_items: Shopping carts with guest session capability
CREATE TABLE IF NOT EXISTS store_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE,
  guest_session_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES store_carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES store_products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES store_product_variants(id) ON DELETE SET NULL,
  qty INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  price_snapshot NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. store_wishlists: Saved favorites
CREATE TABLE IF NOT EXISTS store_wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES store_products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 7. store_addresses: User delivery destinations
CREATE TABLE IF NOT EXISTS store_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE NOT NULL,
  label VARCHAR(50) DEFAULT 'Rumah',
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  full_address TEXT NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. store_orders: E-commerce order lifecycle
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES store_users(id) ON DELETE SET NULL,
  guest_email VARCHAR(255),
  address_id UUID REFERENCES store_addresses(id) ON DELETE SET NULL,
  address_snapshot JSONB,
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total NUMERIC(15, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(100),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status VARCHAR(30) DEFAULT 'menunggu_pembayaran' CHECK (order_status IN ('menunggu_pembayaran', 'diproses', 'dikemas', 'dikirim', 'selesai', 'dibatalkan')),
  shipping_courier VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. store_order_items: Purchased products inside orders
CREATE TABLE IF NOT EXISTS store_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES store_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES store_products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES store_product_variants(id) ON DELETE SET NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  price_snapshot NUMERIC(15, 2) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. store_payments: Midtrans / Xendit transactional webhook tracking
CREATE TABLE IF NOT EXISTS store_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES store_orders(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(30) DEFAULT 'midtrans' CHECK (provider IN ('midtrans', 'xendit')),
  provider_ref_id VARCHAR(255),
  amount NUMERIC(15, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  paid_at TIMESTAMPTZ,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. store_reviews: Customer feedback with photos and admin replies
CREATE TABLE IF NOT EXISTS store_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES store_products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE NOT NULL,
  order_item_id UUID REFERENCES store_order_items(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photo_urls JSONB DEFAULT '[]'::jsonb,
  admin_reply TEXT,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. store_vouchers: Promotional discounts and quota tracking
CREATE TABLE IF NOT EXISTS store_vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value NUMERIC(15, 2) NOT NULL,
  min_purchase NUMERIC(15, 2) DEFAULT 0,
  max_discount NUMERIC(15, 2),
  quota INTEGER NOT NULL DEFAULT 100,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  applicable_category_id UUID REFERENCES store_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. store_banners: CMS-lite homepage hero and promotional slider
CREATE TABLE IF NOT EXISTS store_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) DEFAULT '/produk',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. store_audit_logs: Administrative activity trail
CREATE TABLE IF NOT EXISTS store_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES store_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON store_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON store_products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON store_product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON store_cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON store_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON store_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON store_reviews(product_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Supabase Standard)
-- ============================================================================
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;

-- Allow read access to public products, categories, reviews, banners, vouchers
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON store_categories FOR SELECT USING (true);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products" ON store_products FOR SELECT USING (status = 'active');

ALTER TABLE store_product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read variants" ON store_product_variants FOR SELECT USING (true);

ALTER TABLE store_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read banners" ON store_banners FOR SELECT USING (is_active = true);

-- Customer specific isolation policies
CREATE POLICY "Users access own profile" ON store_users
  FOR ALL USING (auth.uid() = id OR (SELECT role FROM store_users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users access own addresses" ON store_addresses
  FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM store_users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users access own orders" ON store_orders
  FOR ALL USING (auth.uid() = user_id OR (SELECT role FROM store_users WHERE id = auth.uid()) = 'admin');
