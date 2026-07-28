-- ============================================================================
-- AJAK ABI STORE (E-Commerce Perlengkapan Umrah & Haji)
-- Migration 02: Realistic Seed Data & Bundling Recipes
-- ============================================================================

-- 1. Insert Initial Admin & Customer Demo Users (Passwords hashed for 'password123')
INSERT INTO store_users (id, email, password_hash, full_name, phone, role, avatar_url) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@ajakabi.com', '$2b$10$YourHashedPasswordHere1234567890123456789012', 'Ust. Abi Zaki (Owner)', '081234567890', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'),
('c0000000-0000-0000-0000-000000000001', 'customer@gmail.com', '$2b$10$YourHashedPasswordHere1234567890123456789012', 'H. Ahmad Ihsan', '081987654321', 'customer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Store Categories (with custom icons & slugs)
INSERT INTO store_categories (id, name, slug, icon_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Perlengkapan Ihram', 'perlengkapan-ihram', 'Layers', 1),
('c2000000-0000-0000-0000-000000000002', 'Perlengkapan Sholat', 'perlengkapan-sholat', 'Heart', 2),
('c3000000-0000-0000-0000-000000000003', 'Koper & Tas Travel', 'koper-tas-travel', 'Briefcase', 3),
('c4000000-0000-0000-0000-000000000004', 'Kesehatan & Obat Perjalanan', 'kesehatan-obat-perjalanan', 'ShieldPlus', 4),
('c5000000-0000-0000-0000-000000000005', 'Buku & Panduan Doa', 'buku-panduan-doa', 'BookOpen', 5),
('c6000000-0000-0000-0000-000000000006', 'Fashion Muslim Travel', 'fashion-muslim-travel', 'Shirt', 6),
('c7000000-0000-0000-0000-000000000007', 'Oleh-oleh & Souvenir', 'oleh-oleh-souvenir', 'Gift', 7),
('c8000000-0000-0000-0000-000000000008', 'Paket Bundling', 'paket-bundling', 'PackageCheck', 8)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products (Premium Quality Niche Items & Bundle Recipes)
INSERT INTO store_products (id, category_id, name, slug, description, brand, base_price, discount_price, weight_grams, sku, images, is_bundling, bundling_items, rating_avg, review_count, status, is_featured) VALUES
-- Item 1: Kain Ihram Premium
('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Kain Ihram Premium Serat Bambu Organik (2 Lembar Tanpa Jahit)', 'kain-ihram-serat-bambu-organik', 
'Kain ihram berkualitas tinggi ditenun dari 100% serat bambu organik alami. Memiliki sirkulasi udara luar biasa (breathable), anti-bakterialami anti-bau saat dikenakan berhari-hari di cuaca panas Mekkah dan Madinah. Halus di kulit dan berdaya serap keringat tinggi. Satu set berisi 2 lembar (atasan & bawahan) tanpa jahitan sesuai syariat.',
'Ajak Abi Signature', 480000, 420000, 1100, 'AAS-IHR-001', 
'["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
FALSE, '[]'::jsonb, 4.9, 86, 'active', TRUE),

-- Item 2: Mukena Travel Sutra Anti Kusut
('p2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Mukena Travel Sutra Parasut Mewah (Ultra Compact Pouch)', 'mukena-travel-sutra-parasut-mewah', 
'Mukena revolusioner bertekstur sutra lembut yang tidak mudah kusut meski digulung ringkas ke dalam pouch mini berukuran 12 cm. Sangat praktis untuk sholat di Raudhah atau di pesawat saat perjalanan jarak jauh. Bagian dagu memakai sleting fleksibel anti-tercekik dan mudah disesuaikan dengan kontur wajah.',
'Madina Royale', 550000, 485000, 350, 'AAS-MUK-002', 
'["https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop"]'::jsonb,
FALSE, '[]'::jsonb, 4.95, 142, 'active', TRUE),

-- Item 3: Koper Hardcase TSA
('p3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'Koper Hardcase Aluminium TSA Lock 24 Inch (Umrah Edition)', 'koper-hardcase-aluminium-tsa-24-inch', 
'Koper tangguh berbahan paduan Polycarbonate dan Aluminium Frame tahan banting untuk penanganan bagasi penerbangan internasional. Dilengkapi TSA Combination Lock standar global, roda silent 360 derajat berbahan karet redam goncangan, dan kompartemen dalam tahan air (waterproof zip) untuk perlengkapan basah atau cairan Zamzam.',
'Lugggard Pro', 1850000, 1620000, 4500, 'AAS-KOP-003', 
'["https://images.unsplash.com/photo-1581553680321-4fffae59fcf9?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"]'::jsonb,
FALSE, '[]'::jsonb, 4.85, 59, 'active', TRUE),

-- Item 4: Kit Kesehatan & Obat Perjalanan
('p4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000004', 'Kit Herbal & Medical Stamina Umrah (Immunity & Foot Care)', 'kit-herbal-medical-stamina-umrah', 
'Paket khusus perawatan fisik dan vitalitas untuk ibadah Umrah dan Haji. Berisi vitamin C+Zn dosis tinggi, balsam relaksasi kaki pasca Sa-i dan Thawaf, lip balm pelembab bibir pecah-pecah akibat kelembapan ekstrim rendah di padang pasir, dan spray hidrasi wajah air murni.',
'BioSahara', 225000, NULL, 400, 'AAS-KES-004', 
'["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop"]'::jsonb,
FALSE, '[]'::jsonb, 4.8, 91, 'active', FALSE),

-- Item 5: Buku Panduan Doa Eksklusif
('p5000000-0000-0000-0000-000000000005', 'c5000000-0000-0000-0000-000000000005', 'Buku Saku Panduan Umrah Exclusive dengan QR Audio Masyair', 'buku-saku-panduan-umrah-qr-audio', 
'Buku panduan manasik umrah lengkap dari niat hingga tahalul dengan cetakan kertas tahan robek kalis air dan font Arab ukuran ekstra besar yang jelas terbaca di siang hari. Dilengkapi scan barcode QR yang terhubung ke rekaman audio pembimbing doa lisan di setiap titik Masyair.',
'Qalam Press', 95000, 75000, 200, 'AAS-BUK-005', 
'["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"]'::jsonb,
FALSE, '[]'::jsonb, 4.9, 120, 'active', FALSE),

-- Item 6: Paket Bundling Lengkap Pria
('p6000000-0000-0000-0000-000000000006', 'c8000000-0000-0000-0000-000000000008', 'Paket Lengkap Umrah Executive Pria (Ihram + Koper 24" + Kit Kesehatan + Panduan)', 'paket-lengkap-umrah-executive-pria', 
'Paket komplit satu klik untuk jamaah pria! Hemat hingga Rp 400.000 dengan membeli bundel istimewa ini. Sudah merangkum 1 set Kain Ihram Serat Bambu, 1 Koper Hardcase Aluminium TSA 24 Inch, 1 Kit Kesehatan Stamina, dan 1 Buku Panduan Doa Audio QR. Siap bertolak menuju tanah suci dengan ketenteraman hati dan penampilan takwa terbaik.',
'Ajak Abi Signature', 2650000, 2199000, 6200, 'AAS-BUN-M01', 
'["https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"]'::jsonb,
TRUE, 
'[
  {"product_id": "p1000000-0000-0000-0000-000000000001", "name": "Kain Ihram Serat Bambu Organik", "qty": 1},
  {"product_id": "p3000000-0000-0000-0000-000000000003", "name": "Koper Hardcase TSA Aluminium 24 Inch", "qty": 1},
  {"product_id": "p4000000-0000-0000-0000-000000000004", "name": "Kit Herbal & Medical Stamina Umrah", "qty": 1},
  {"product_id": "p5000000-0000-0000-0000-000000000005", "name": "Buku Saku Panduan Umrah Exclusive", "qty": 1}
]'::jsonb, 5.0, 44, 'active', TRUE),

-- Item 7: Paket Bundling Lengkap Wanita
('p7000000-0000-0000-0000-000000000007', 'c8000000-0000-0000-0000-000000000008', 'Paket Lengkap Umrah Royale Wanita (Mukena Sutra + Koper 24" + Kit Kesehatan)', 'paket-lengkap-umrah-royale-wanita', 
'Paket perjalanan sempurna bagi muslimah terhormat. Menghadirkan Mukena Travel Sutra Parasut yang sejuk, dipadukan Koper Hardcase TSA tangguh berkelas, serta Kit Kesehatan eksklusif penunjang stamina fisik selama menjalankan serangkaian ibadah umrah di tanah suci.',
'Madina Royale', 2625000, 2150000, 5250, 'AAS-BUN-W02', 
'["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop"]'::jsonb,
TRUE, 
'[
  {"product_id": "p2000000-0000-0000-0000-000000000002", "name": "Mukena Travel Sutra Parasut Mewah", "qty": 1},
  {"product_id": "p3000000-0000-0000-0000-000000000003", "name": "Koper Hardcase TSA Aluminium 24 Inch", "qty": 1},
  {"product_id": "p4000000-0000-0000-0000-000000000004", "name": "Kit Herbal & Medical Stamina Umrah", "qty": 1}
]'::jsonb, 4.96, 38, 'active', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Product Variants (Colors & Sizes)
INSERT INTO store_product_variants (id, product_id, variant_name, variant_value, price_adjustment, stock, sku_variant) VALUES
-- Kain Ihram Variants (Ukuran)
('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Ukuran', 'Standard (L. 115cm x P. 220cm)', 0, 120, 'AAS-IHR-STD'),
('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Ukuran', 'Jumbo Extra Wide (L. 130cm x P. 240cm)', 45000, 65, 'AAS-IHR-JMB'),

-- Mukena Variants (Warna)
('v2000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000002', 'Warna', 'Putih Bersih (Pearl White)', 0, 85, 'AAS-MUK-WHT'),
('v2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 'Warna', 'Sage Green Lembut', 0, 50, 'AAS-MUK-SGE'),
('v2000000-0000-0000-0000-000000000003', 'p2000000-0000-0000-0000-000000000002', 'Warna', 'Muted Rosewood', 0, 42, 'AAS-MUK-RSD'),

-- Koper Variants (Warna)
('v3000000-0000-0000-0000-000000000001', 'p3000000-0000-0000-0000-000000000003', 'Warna', 'Sand Khaki / Coklat Gurun', 0, 28, 'AAS-KOP-KHK'),
('v3000000-0000-0000-0000-000000000002', 'p3000000-0000-0000-0000-000000000003', 'Warna', 'Titanium Silver Matte', 0, 34, 'AAS-KOP-SLV'),
('v3000000-0000-0000-0000-000000000003', 'p3000000-0000-0000-0000-000000000003', 'Warna', 'Deep Charcoal Black', 0, 40, 'AAS-KOP-BLK'),

-- Paket Bundling Variants
('v6000000-0000-0000-0000-000000000001', 'p6000000-0000-0000-0000-000000000006', 'Edisi Koper', 'Koper Sand Khaki + Ihram Std', 0, 20, 'AAS-BUN-M01-KHK'),
('v7000000-0000-0000-0000-000000000001', 'p7000000-0000-0000-0000-000000000007', 'Edisi Mukena & Koper', 'Mukena Pearl White + Koper Silver', 0, 18, 'AAS-BUN-W02-WHT')
ON CONFLICT DO NOTHING;

-- 5. Insert Promo Vouchers
INSERT INTO store_vouchers (id, code, discount_type, discount_value, min_purchase, max_discount, quota, used_count, valid_until) VALUES
('v9000000-0000-0000-0000-000000000001', 'MABRUR2026', 'percentage', 15, 1000000, 350000, 500, 42, NOW() + INTERVAL '365 days'),
('v9000000-0000-0000-0000-000000000002', 'BERKAH50', 'fixed', 50000, 300000, 50000, 1000, 125, NOW() + INTERVAL '180 days'),
('v9000000-0000-0000-0000-000000000003', 'AJAKABI100', 'fixed', 100000, 750000, 100000, 200, 19, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;

-- 6. Insert Homepage Hero Banners (CMS Lite)
INSERT INTO store_banners (id, image_url, title, link_url, sort_order, is_active) VALUES
('b1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1600&auto=format&fit=crop', 'Lengkapi Persiapan Menuju Tanah Suci, Tenang & Elegan Bersama Ajak Abi', '/produk', 1, TRUE),
('b2000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop', 'Paket Bundling Eksklusif Umrah 2026: Hemat Hingga Rp 400.000', '/produk?category=paket-bundling', 2, TRUE)
ON CONFLICT DO NOTHING;

-- 7. Insert Sample Address & Order for Customer Demo
INSERT INTO store_addresses (id, user_id, label, recipient_name, phone, full_address, province, city, district, postal_code, is_default) VALUES
('d1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Rumah Utama', 'H. Ahmad Ihsan', '081987654321', 'Jl. Sultan Agung No. 88, Kemang Pratama', 'Jawa Barat', 'Kota Bekasi', 'Rawalumbu', '17116', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO store_orders (id, order_number, user_id, guest_email, address_id, address_snapshot, subtotal, shipping_cost, discount_amount, total, payment_method, payment_status, order_status, shipping_courier, tracking_number, notes) VALUES
('o1000000-0000-0000-0000-000000000001', '#AAS-20260728-001', 'c0000000-0000-0000-0000-000000000001', 'customer@gmail.com', 'd1000000-0000-0000-0000-000000000001', 
'{"recipient_name": "H. Ahmad Ihsan", "phone": "081987654321", "full_address": "Jl. Sultan Agung No. 88, Kemang Pratama, Kota Bekasi 17116"}'::jsonb,
2199000, 45000, 100000, 2144000, 'Midtrans Snap - VA Mandiri (Sandbox)', 'paid', 'dikirim', 'JNE YES (Yakin Esok Sampai)', 'JNE-AAS-9988776655', 'Tolong dikemas aman pakai bubble wrap tebal ya, terima kasih.')
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO store_order_items (id, order_id, product_id, variant_id, product_name_snapshot, price_snapshot, qty, subtotal) VALUES
('i1000000-0000-0000-0000-000000000001', 'o1000000-0000-0000-0000-000000000001', 'p6000000-0000-0000-0000-000000000006', 'v6000000-0000-0000-0000-000000000001', 'Paket Lengkap Umrah Executive Pria (Koper Sand Khaki + Ihram Std)', 2199000, 1, 2199000)
ON CONFLICT DO NOTHING;

INSERT INTO store_reviews (id, product_id, user_id, order_item_id, rating, comment, photo_urls, admin_reply, status) VALUES
('r1000000-0000-0000-0000-000000000001', 'p6000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'i1000000-0000-0000-0000-000000000001', 5, 
'Masya Allah, kualitas koper dan kain ihram serat bambunya benar-benar eksklusif! Bahannya sejuk dipakai dan tidak bikin gerak terbatas. Cocok sekali untuk cuaca panas di Madinah. Terima kasih Ajak Abi Store, pelayanan istimewa!',
'["https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=400&auto=format&fit=crop"]'::jsonb,
'Alhamdulillah, terima kasih banyak atas kepercayaannya H. Ahmad Ihsan. Semoga ibadah umrahnya mabrur dan dimudahkan di tanah suci.', 'published')
ON CONFLICT DO NOTHING;
