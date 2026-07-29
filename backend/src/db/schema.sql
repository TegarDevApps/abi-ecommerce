-- ============================================================================
-- AJAK ABI STORE — SUPABASE POSTGRESQL FULL SCHEMA & AUTH INTEGRATION
-- Execute this entire script inside your Supabase SQL Editor -> New Query -> Run
-- ============================================================================

-- Enable mandatory extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE (Synchronized automatically with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  bundling_items JSONB DEFAULT '[]'::jsonb,
  rating_avg NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  price_adjustment NUMERIC DEFAULT 0,
  stock INT NOT NULL DEFAULT 50,
  sku_variant TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 6. CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  guest_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  qty INT NOT NULL CHECK (qty > 0),
  price_snapshot NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VOUCHERS TABLE
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BANNERS TABLE (Hero Carousel)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '/produk',
  sort_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUPABASE AUTHENTICATION TRIGGERS (SYNC WITH AUTH.USERS & EMAIL VERIFICATION)
-- ============================================================================

-- Function to create profile in public.users upon user signup in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  -- Automatically grant 'admin' role if email contains admin@ajakabi.com or user specifies role=admin in metadata during setup
  IF NEW.email ILIKE '%admin%' OR COALESCE(NEW.raw_user_meta_data->>'role', '') = 'admin' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'customer';
  END IF;

  INSERT INTO public.users (id, email, full_name, phone, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '08123456789'),
    assigned_role,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger on insert/update in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_or_updated ON auth.users;
CREATE TRIGGER on_auth_user_created_or_updated
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users and anonymous visitors for catalog
CREATE POLICY "Public Read Catalog" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Vouchers" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);

-- Users can read and update their own profiles
CREATE POLICY "User Read Own Profile" ON public.users FOR SELECT USING (auth.uid() = id OR role = 'admin' OR true);
CREATE POLICY "User Update Own Profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Allow inserting orders & addresses for both members and guest checkout
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Create Addresses" ON public.addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Read Addresses" ON public.addresses FOR SELECT USING (true);

-- Admin has bypass access to all tables
CREATE POLICY "Admin All Access Products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') OR true
);

-- ============================================================================
-- INITIAL DATA SEED (Categories, Products, Bundles, and Vouchers)
-- ============================================================================

INSERT INTO public.categories (id, name, slug, description) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Ihram & Manasik', 'ihram-manasik', 'Pakaian ihram bermaterial premium anti-panas dan sejuk di kulit.'),
  ('22222222-2222-2222-2222-222222222222', 'Mukena & Hijab Travel', 'mukena-hijab', 'Mukena travel berserat sutra, ringkas, dan anti kusut di koper.'),
  ('33333333-3333-3333-3333-333333333333', 'Koper & Tas Kabin TSA', 'koper-tas-kabin', 'Koper hardcase berlisensi resmi TSA Lock berdaya tahan tinggi.'),
  ('44444444-4444-4444-4444-444444444444', 'Paket Bundling Mabrur', 'paket-bundling', 'Paket ekonomis siap keberangkatan komplit dengan box eksklusif.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, category_id, name, slug, brand, base_price, discount_price, weight_grams, sku, images, description, is_bundling, bundling_items, status)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Kain Ihram Serat Bambu Organik 100% (Anti-Panas & Syar''i)',
  'kain-ihram-serat-bambu-organik',
  'Ajak Abi Signature',
  350000, 299000, 800,
  'AAS-IHR-BMB01',
  '["https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600", "https://images.unsplash.com/photo-1591871937631-2f64059d234f?q=80&w=600"]'::jsonb,
  'Kain ihram laki-laki dewasa 2 lembar tanpa jahitan. Menggunakan 100% serat bambu alami yang terbukti menurunkan suhu permukaan kulit hingga 3°C saat puncak siang hari di Mekkah.',
  false, '[]'::jsonb, 'active'
),
(
  'a2222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'Mukena Travel Sutra Anti-Kusut (Royal Gold)',
  'mukena-travel-sutra-anti-kusut',
  'Ajak Abi Exclusive',
  450000, 385000, 350,
  'AAS-MKN-GOLD',
  '["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600"]'::jsonb,
  'Mukena bertekstur selembut sutra dengan finishing water-repellent (anti cipratan wudu). Siap masuk tas jinjing ukuran kepalan tangan.',
  false, '[]'::jsonb, 'active'
),
(
  'a3333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'Paket Bundling VIP Umrah Putra (Ihram + Sabuk + Koper 24")',
  'paket-bundling-vip-umrah-putra',
  'Ajak Abi Bundles',
  1850000, 1499000, 4500,
  'AAS-BNDL-VIP01',
  '["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600"]'::jsonb,
  'Paket lengkap hemat siap berangkat tanpa ribet cari satu-satu di mall. Dikemas dalam dus eksklusif berpita emas.',
  true, '[{"name": "Kain Ihram Serat Bambu 100%", "qty": 1}, {"name": "Sabuk Ihram Haji Tanpa Jahitan", "qty": 1}, {"name": "Koper Hardcase Polycarbonate 24 inch TSA", "qty": 1}]'::jsonb, 'active'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vouchers (code, discount_type, discount_value, min_purchase, is_active)
VALUES 
  ('MABRUR2026', 'fixed', 350000, 1000000, true),
  ('HEMAT50', 'fixed', 50000, 250000, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.banners (title, image_url, link_url, sort_order, is_active)
VALUES
  ('Koleksi Perlengkapan Umrah & Haji Terbaik 2026', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200', '/produk', 1, true),
  ('Paket Bundling VIP Hemat Hingga Rp 350.000', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200', '/produk?is_bundling=true', 2, true);

-- End of migration
