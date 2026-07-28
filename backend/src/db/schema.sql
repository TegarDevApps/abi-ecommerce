-- ============================================================================
-- AJAK ABI STORE — SUPABASE POSTGRESQL SCHEMA & MIGRATIONS (Section 2)
-- Execute this file directly inside your Supabase Project -> SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Linked to auth.users or standalone customer profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (Includes Bundling Support - Section 5.5)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  brand TEXT DEFAULT 'Ajak Abi Signature',
  base_price NUMERIC NOT NULL CHECK (base_price >= 0),
  discount_price NUMERIC,
  weight_grams INT NOT NULL DEFAULT 500,
  sku TEXT UNIQUE NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  is_bundling BOOLEAN DEFAULT false,
  bundling_items JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name":"Ihram","qty":1}]
  rating_avg NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,  -- e.g., "Warna", "Ukuran"
  variant_value TEXT NOT NULL, -- e.g., "Putih Bersih", "XL / Jumbo"
  price_adjustment NUMERIC DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  sku_variant TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_address TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CARTS TABLE (Supports Guest Session ID & Authenticated User)
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  guest_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  qty INT NOT NULL CHECK (qty > 0),
  price_snapshot NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VOUCHERS TABLE
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_purchase NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  quota INT DEFAULT 100,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS & PAYMENT LIFECYCLE TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_session_id TEXT,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'menunggu_pembayaran' CHECK (order_status IN ('menunggu_pembayaran', 'diproses', 'dikemas', 'dikirim', 'selesai', 'dibatalkan')),
  payment_method_label TEXT,
  midtrans_transaction_id TEXT,
  shipping_courier TEXT NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  address_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  variant_name_snapshot TEXT,
  qty INT NOT NULL CHECK (qty > 0),
  unit_price NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REVIEWS & TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BANNERS TABLE (CMS Lite Hero Slider)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '/produk',
  sort_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_ossp(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public customer read-only policies for storefront items
CREATE POLICY "Allow public read on active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read on active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on active vouchers" ON public.vouchers FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on reviews" ON public.reviews FOR SELECT USING (true);

-- Insert sample category & product to kickstart cloud database
INSERT INTO public.categories (id, name, slug, description) 
VALUES ('c1111111-1111-1111-1111-111111111111', 'Ihram & Manasik', 'ihram-manasik', 'Pakaian ihram bermaterial premium anti-panas.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, category_id, name, slug, brand, base_price, discount_price, weight_grams, sku, images, description)
VALUES (
  'p1111111-1111-1111-1111-111111111111',
  'c1111111-1111-1111-1111-111111111111',
  'Kain Ihram Serat Bambu Organik 100%',
  'kain-ihram-serat-bambu-organik',
  'Ajak Abi Signature',
  350000, 299000, 800,
  'AAS-IHR-BMB01',
  '["https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600"]'::jsonb,
  'Material khusus anti-panas dengan daya serap keringat tinggi untuk kenyamanan beribadah.'
)
ON CONFLICT (slug) DO NOTHING;
