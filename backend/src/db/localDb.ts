import { v4 as uuidv4 } from 'uuid';
import {
  StoreUser,
  StoreCategory,
  StoreProduct,
  StoreProductVariant,
  StoreCart,
  StoreCartItem,
  StoreWishlist,
  StoreAddress,
  StoreOrder,
  StoreOrderItem,
  StorePayment,
  StoreReview,
  StoreVoucher,
  StoreBanner,
  StoreAuditLog,
} from '../types';

// In-Memory Database with Full Seed Preservation and Real-time Mutation Capability
class LocalMockDatabase {
  users: StoreUser[] = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@ajakabi.com',
      password_hash: '$2b$10$hashedpassword',
      full_name: 'Ust. Abi Zaki (Owner)',
      phone: '081234567890',
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      created_at: new Date().toISOString(),
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'customer@gmail.com',
      password_hash: '$2b$10$hashedpassword',
      full_name: 'H. Ahmad Ihsan',
      phone: '081987654321',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      created_at: new Date().toISOString(),
    },
  ];

  categories: StoreCategory[] = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Perlengkapan Ihram', slug: 'perlengkapan-ihram', icon_url: 'Layers', sort_order: 1 },
    { id: 'c2000000-0000-0000-0000-000000000002', name: 'Perlengkapan Sholat', slug: 'perlengkapan-sholat', icon_url: 'Heart', sort_order: 2 },
    { id: 'c3000000-0000-0000-0000-000000000003', name: 'Koper & Tas Travel', slug: 'koper-tas-travel', icon_url: 'Briefcase', sort_order: 3 },
    { id: 'c4000000-0000-0000-0000-000000000004', name: 'Kesehatan & Obat Perjalanan', slug: 'kesehatan-obat-perjalanan', icon_url: 'ShieldPlus', sort_order: 4 },
    { id: 'c5000000-0000-0000-0000-000000000005', name: 'Buku & Panduan Doa', slug: 'buku-panduan-doa', icon_url: 'BookOpen', sort_order: 5 },
    { id: 'c6000000-0000-0000-0000-000000000006', name: 'Fashion Muslim Travel', slug: 'fashion-muslim-travel', icon_url: 'Shirt', sort_order: 6 },
    { id: 'c7000000-0000-0000-0000-000000000007', name: 'Oleh-oleh & Souvenir', slug: 'oleh-oleh-souvenir', icon_url: 'Gift', sort_order: 7 },
    { id: 'c8000000-0000-0000-0000-000000000008', name: 'Paket Bundling', slug: 'paket-bundling', icon_url: 'PackageCheck', sort_order: 8 },
  ];

  products: StoreProduct[] = [
    {
      id: 'p1000000-0000-0000-0000-000000000001',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      name: 'Kain Ihram Premium Serat Bambu Organik (2 Lembar Tanpa Jahit)',
      slug: 'kain-ihram-serat-bambu-organik',
      description: 'Kain ihram berkualitas tinggi ditenun dari 100% serat bambu organik alami. Memiliki sirkulasi udara luar biasa (breathable), anti-bakterialami anti-bau saat dikenakan berhari-hari di cuaca panas Mekkah dan Madinah. Halus di kulit dan berdaya serap keringat tinggi. Satu set berisi 2 lembar (atasan & bawahan) tanpa jahitan sesuai syariat.',
      brand: 'Ajak Abi Signature',
      base_price: 480000,
      discount_price: 420000,
      weight_grams: 1100,
      sku: 'AAS-IHR-001',
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: false,
      bundling_items: [],
      rating_avg: 4.9,
      review_count: 86,
      status: 'active',
      is_featured: true,
    },
    {
      id: 'p2000000-0000-0000-0000-000000000002',
      category_id: 'c2000000-0000-0000-0000-000000000002',
      name: 'Mukena Travel Sutra Parasut Mewah (Ultra Compact Pouch)',
      slug: 'mukena-travel-sutra-parasut-mewah',
      description: 'Mukena revolusioner bertekstur sutra lembut yang tidak mudah kusut meski digulung ringkas ke dalam pouch mini berukuran 12 cm. Sangat praktis untuk sholat di Raudhah atau di pesawat saat perjalanan jarak jauh. Bagian dagu memakai sleting fleksibel anti-tercekik dan mudah disesuaikan dengan kontur wajah.',
      brand: 'Madina Royale',
      base_price: 550000,
      discount_price: 485000,
      weight_grams: 350,
      sku: 'AAS-MUK-002',
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: false,
      bundling_items: [],
      rating_avg: 4.95,
      review_count: 142,
      status: 'active',
      is_featured: true,
    },
    {
      id: 'p3000000-0000-0000-0000-000000000003',
      category_id: 'c3000000-0000-0000-0000-000000000003',
      name: 'Koper Hardcase Aluminium TSA Lock 24 Inch (Umrah Edition)',
      slug: 'koper-hardcase-aluminium-tsa-24-inch',
      description: 'Koper tangguh berbahan paduan Polycarbonate dan Aluminium Frame tahan banting untuk penanganan bagasi penerbangan internasional. Dilengkapi TSA Combination Lock standar global, roda silent 360 derajat berbahan karet redam goncangan, dan kompartemen dalam tahan air (waterproof zip) untuk perlengkapan basah atau cairan Zamzam.',
      brand: 'Lugggard Pro',
      base_price: 1850000,
      discount_price: 1620000,
      weight_grams: 4500,
      sku: 'AAS-KOP-003',
      images: [
        'https://images.unsplash.com/photo-1581553680321-4fffae59fcf9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: false,
      bundling_items: [],
      rating_avg: 4.85,
      review_count: 59,
      status: 'active',
      is_featured: true,
    },
    {
      id: 'p4000000-0000-0000-0000-000000000004',
      category_id: 'c4000000-0000-0000-0000-000000000004',
      name: 'Kit Herbal & Medical Stamina Umrah (Immunity & Foot Care)',
      slug: 'kit-herbal-medical-stamina-umrah',
      description: 'Paket khusus perawatan fisik dan vitalitas untuk ibadah Umrah dan Haji. Berisi vitamin C+Zn dosis tinggi, balsam relaksasi kaki pasca Sa-i dan Thawaf, lip balm pelembab bibir pecah-pecah akibat kelembapan ekstrim rendah di padang pasir, dan spray hidrasi wajah air murni.',
      brand: 'BioSahara',
      base_price: 225000,
      discount_price: null,
      weight_grams: 400,
      sku: 'AAS-KES-004',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: false,
      bundling_items: [],
      rating_avg: 4.8,
      review_count: 91,
      status: 'active',
      is_featured: false,
    },
    {
      id: 'p5000000-0000-0000-0000-000000000005',
      category_id: 'c5000000-0000-0000-0000-000000000005',
      name: 'Buku Saku Panduan Umrah Exclusive dengan QR Audio Masyair',
      slug: 'buku-saku-panduan-umrah-qr-audio',
      description: 'Buku panduan manasik umrah lengkap dari niat hingga tahalul dengan cetakan kertas tahan robek kalis air dan font Arab ukuran ekstra besar yang jelas terbaca di siang hari. Dilengkapi scan barcode QR yang terhubung ke rekaman audio pembimbing doa lisan di setiap titik Masyair.',
      brand: 'Qalam Press',
      base_price: 95000,
      discount_price: 75000,
      weight_grams: 200,
      sku: 'AAS-BUK-005',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: false,
      bundling_items: [],
      rating_avg: 4.9,
      review_count: 120,
      status: 'active',
      is_featured: false,
    },
    {
      id: 'p6000000-0000-0000-0000-000000000006',
      category_id: 'c8000000-0000-0000-0000-000000000008',
      name: 'Paket Lengkap Umrah Executive Pria (Ihram + Koper 24" + Kit Kesehatan + Panduan)',
      slug: 'paket-lengkap-umrah-executive-pria',
      description: 'Paket komplit satu klik untuk jamaah pria! Hemat hingga Rp 400.000 dengan membeli bundel istimewa ini. Sudah merangkum 1 set Kain Ihram Serat Bambu, 1 Koper Hardcase Aluminium TSA 24 Inch, 1 Kit Kesehatan Stamina, dan 1 Buku Panduan Doa Audio QR. Siap bertolak menuju tanah suci dengan ketenteraman hati dan penampilan takwa terbaik.',
      brand: 'Ajak Abi Signature',
      base_price: 2650000,
      discount_price: 2199000,
      weight_grams: 6200,
      sku: 'AAS-BUN-M01',
      images: [
        'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: true,
      bundling_items: [
        { product_id: 'p1000000-0000-0000-0000-000000000001', name: 'Kain Ihram Serat Bambu Organik', qty: 1 },
        { product_id: 'p3000000-0000-0000-0000-000000000003', name: 'Koper Hardcase TSA Aluminium 24 Inch', qty: 1 },
        { product_id: 'p4000000-0000-0000-0000-000000000004', name: 'Kit Herbal & Medical Stamina Umrah', qty: 1 },
        { product_id: 'p5000000-0000-0000-0000-000000000005', name: 'Buku Saku Panduan Umrah Exclusive', qty: 1 },
      ],
      rating_avg: 5.0,
      review_count: 44,
      status: 'active',
      is_featured: true,
    },
    {
      id: 'p7000000-0000-0000-0000-000000000007',
      category_id: 'c8000000-0000-0000-0000-000000000008',
      name: 'Paket Lengkap Umrah Royale Wanita (Mukena Sutra + Koper 24" + Kit Kesehatan)',
      slug: 'paket-lengkap-umrah-royale-wanita',
      description: 'Paket perjalanan sempurna bagi muslimah terhormat. Menghadirkan Mukena Travel Sutra Parasut yang sejuk, dipadukan Koper Hardcase TSA tangguh berkelas, serta Kit Kesehatan eksklusif penunjang stamina fisik selama menjalankan serangkaian ibadah umrah di tanah suci.',
      brand: 'Madina Royale',
      base_price: 2625000,
      discount_price: 2150000,
      weight_grams: 5250,
      sku: 'AAS-BUN-W02',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop'
      ],
      is_bundling: true,
      bundling_items: [
        { product_id: 'p2000000-0000-0000-0000-000000000002', name: 'Mukena Travel Sutra Parasut Mewah', qty: 1 },
        { product_id: 'p3000000-0000-0000-0000-000000000003', name: 'Koper Hardcase TSA Aluminium 24 Inch', qty: 1 },
        { product_id: 'p4000000-0000-0000-0000-000000000004', name: 'Kit Herbal & Medical Stamina Umrah', qty: 1 },
      ],
      rating_avg: 4.96,
      review_count: 38,
      status: 'active',
      is_featured: true,
    },
  ];

  variants: StoreProductVariant[] = [
    { id: 'v1000000-0000-0000-0000-000000000001', product_id: 'p1000000-0000-0000-0000-000000000001', variant_name: 'Ukuran', variant_value: 'Standard (L. 115cm x P. 220cm)', price_adjustment: 0, stock: 120, sku_variant: 'AAS-IHR-STD' },
    { id: 'v1000000-0000-0000-0000-000000000002', product_id: 'p1000000-0000-0000-0000-000000000001', variant_name: 'Ukuran', variant_value: 'Jumbo Extra Wide (L. 130cm x P. 240cm)', price_adjustment: 45000, stock: 65, sku_variant: 'AAS-IHR-JMB' },
    { id: 'v2000000-0000-0000-0000-000000000001', product_id: 'p2000000-0000-0000-0000-000000000002', variant_name: 'Warna', variant_value: 'Putih Bersih (Pearl White)', price_adjustment: 0, stock: 85, sku_variant: 'AAS-MUK-WHT' },
    { id: 'v2000000-0000-0000-0000-000000000002', product_id: 'p2000000-0000-0000-0000-000000000002', variant_name: 'Warna', variant_value: 'Sage Green Lembut', price_adjustment: 0, stock: 50, sku_variant: 'AAS-MUK-SGE' },
    { id: 'v2000000-0000-0000-0000-000000000003', product_id: 'p2000000-0000-0000-0000-000000000002', variant_name: 'Warna', variant_value: 'Muted Rosewood', price_adjustment: 0, stock: 42, sku_variant: 'AAS-MUK-RSD' },
    { id: 'v3000000-0000-0000-0000-000000000001', product_id: 'p3000000-0000-0000-0000-000000000003', variant_name: 'Warna', variant_value: 'Sand Khaki / Coklat Gurun', price_adjustment: 0, stock: 28, sku_variant: 'AAS-KOP-KHK' },
    { id: 'v3000000-0000-0000-0000-000000000002', product_id: 'p3000000-0000-0000-0000-000000000003', variant_name: 'Warna', variant_value: 'Titanium Silver Matte', price_adjustment: 0, stock: 34, sku_variant: 'AAS-KOP-SLV' },
    { id: 'v3000000-0000-0000-0000-000000000003', product_id: 'p3000000-0000-0000-0000-000000000003', variant_name: 'Warna', variant_value: 'Deep Charcoal Black', price_adjustment: 0, stock: 40, sku_variant: 'AAS-KOP-BLK' },
    { id: 'v6000000-0000-0000-0000-000000000001', product_id: 'p6000000-0000-0000-0000-000000000006', variant_name: 'Edisi Koper', variant_value: 'Koper Sand Khaki + Ihram Std', price_adjustment: 0, stock: 20, sku_variant: 'AAS-BUN-M01-KHK' },
    { id: 'v7000000-0000-0000-0000-000000000001', product_id: 'p7000000-0000-0000-0000-000000000007', variant_name: 'Edisi Mukena & Koper', variant_value: 'Mukena Pearl White + Koper Silver', price_adjustment: 0, stock: 18, sku_variant: 'AAS-BUN-W02-WHT' },
  ];

  carts: StoreCart[] = [
    { id: 'cart-demo-guest', guest_session_id: 'guest-session-123', items: [] },
  ];

  cart_items: StoreCartItem[] = [];
  wishlists: StoreWishlist[] = [];
  addresses: StoreAddress[] = [
    {
      id: 'd1000000-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      label: 'Rumah Utama',
      recipient_name: 'H. Ahmad Ihsan',
      phone: '081987654321',
      full_address: 'Jl. Sultan Agung No. 88, Kemang Pratama',
      province: 'Jawa Barat',
      city: 'Kota Bekasi',
      district: 'Rawalumbu',
      postal_code: '17116',
      is_default: true,
    }
  ];

  orders: StoreOrder[] = [
    {
      id: 'o1000000-0000-0000-0000-000000000001',
      order_number: '#AAS-20260728-001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      guest_email: 'customer@gmail.com',
      address_id: 'd1000000-0000-0000-0000-000000000001',
      address_snapshot: {
        recipient_name: 'H. Ahmad Ihsan',
        phone: '081987654321',
        full_address: 'Jl. Sultan Agung No. 88, Kemang Pratama, Kota Bekasi 17116'
      },
      subtotal: 2199000,
      shipping_cost: 45000,
      discount_amount: 100000,
      total: 2144000,
      payment_method: 'Midtrans Snap - VA Mandiri',
      payment_status: 'paid',
      order_status: 'dikirim',
      shipping_courier: 'JNE YES (Yakin Esok Sampai)',
      tracking_number: 'JNE-AAS-9988776655',
      notes: 'Tolong dikemas aman pakai bubble wrap tebal ya, terima kasih.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      items: [
        {
          id: 'i1000000-0000-0000-0000-000000000001',
          order_id: 'o1000000-0000-0000-0000-000000000001',
          product_id: 'p6000000-0000-0000-0000-000000000006',
          variant_id: 'v6000000-0000-0000-0000-000000000001',
          product_name_snapshot: 'Paket Lengkap Umrah Executive Pria (Koper Sand Khaki + Ihram Std)',
          price_snapshot: 2199000,
          qty: 1,
          subtotal: 2199000,
        }
      ]
    },
  ];

  order_items: StoreOrderItem[] = [
    {
      id: 'i1000000-0000-0000-0000-000000000001',
      order_id: 'o1000000-0000-0000-0000-000000000001',
      product_id: 'p6000000-0000-0000-0000-000000000006',
      variant_id: 'v6000000-0000-0000-0000-000000000001',
      product_name_snapshot: 'Paket Lengkap Umrah Executive Pria (Koper Sand Khaki + Ihram Std)',
      price_snapshot: 2199000,
      qty: 1,
      subtotal: 2199000,
    }
  ];

  payments: StorePayment[] = [
    {
      id: 'pay1000000-0000-0000-0000-000000000001',
      order_id: 'o1000000-0000-0000-0000-000000000001',
      provider: 'midtrans',
      provider_ref_id: 'MID-TXN-887766',
      amount: 2144000,
      status: 'settled',
      paid_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      raw_payload: { transaction_status: 'settlement', payment_type: 'bank_transfer' },
    }
  ];

  reviews: StoreReview[] = [
    {
      id: 'r1000000-0000-0000-0000-000000000001',
      product_id: 'p6000000-0000-0000-0000-000000000006',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      order_item_id: 'i1000000-0000-0000-0000-000000000001',
      rating: 5,
      comment: 'Masya Allah, kualitas koper dan kain ihram serat bambunya benar-benar eksklusif! Bahannya sejuk dipakai dan tidak bikin gerak terbatas. Cocok sekali untuk cuaca panas di Madinah. Terima kasih Ajak Abi Store, pelayanan istimewa!',
      photo_urls: ['https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=400&auto=format&fit=crop'],
      admin_reply: 'Alhamdulillah, terima kasih banyak atas kepercayaannya H. Ahmad Ihsan. Semoga ibadah umrahnya mabrur dan dimudahkan di tanah suci.',
      status: 'published',
      user_name: 'H. Ahmad Ihsan',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  vouchers: StoreVoucher[] = [
    { id: 'v9000000-0000-0000-0000-000000000001', code: 'MABRUR2026', discount_type: 'percentage', discount_value: 15, min_purchase: 1000000, max_discount: 350000, quota: 500, used_count: 42, valid_from: new Date().toISOString(), valid_until: new Date(Date.now() + 86400000 * 365).toISOString() },
    { id: 'v9000000-0000-0000-0000-000000000002', code: 'BERKAH50', discount_type: 'fixed', discount_value: 50000, min_purchase: 300000, max_discount: 50000, quota: 1000, used_count: 125, valid_from: new Date().toISOString(), valid_until: new Date(Date.now() + 86400000 * 180).toISOString() },
    { id: 'v9000000-0000-0000-0000-000000000003', code: 'AJAKABI100', discount_type: 'fixed', discount_value: 100000, min_purchase: 750000, max_discount: 100000, quota: 200, used_count: 19, valid_from: new Date().toISOString(), valid_until: new Date(Date.now() + 86400000 * 90).toISOString() },
  ];

  banners: StoreBanner[] = [
    { id: 'b1000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1600&auto=format&fit=crop', title: 'Lengkapi Persiapan Menuju Tanah Suci, Tenang & Elegan Bersama Ajak Abi', link_url: '/produk', sort_order: 1, is_active: true },
    { id: 'b2000000-0000-0000-0000-000000000002', image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop', title: 'Paket Bundling Eksklusif Umrah 2026: Hemat Hingga Rp 400.000', link_url: '/produk?category=paket-bundling', sort_order: 2, is_active: true },
  ];

  audit_logs: StoreAuditLog[] = [
    {
      id: 'audit-1',
      actor_id: 'a0000000-0000-0000-0000-000000000001',
      action: 'INITIALIZE_CATALOG',
      entity: 'store_products',
      entity_id: 'all',
      metadata: { note: 'Initial seed of premium Umrah & Hajj inventory' },
      created_at: new Date().toISOString(),
    }
  ];

  // Helper methods to simulate relational joins
  getProductsWithRelations() {
    return this.products.map(p => ({
      ...p,
      category: this.categories.find(c => c.id === p.category_id),
      variants: this.variants.filter(v => v.product_id === p.id),
    }));
  }

  getProductBySlug(slug: string) {
    const product = this.products.find(p => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      category: this.categories.find(c => c.id === product.category_id),
      variants: this.variants.filter(v => v.product_id === product.id),
    };
  }

  // Audit logging helper
  logAudit(action: string, entity: string, entity_id: string, metadata: any = {}) {
    const newLog: StoreAuditLog = {
      id: uuidv4(),
      actor_id: 'a0000000-0000-0000-0000-000000000001', // defaults to admin for demo
      action,
      entity,
      entity_id,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.audit_logs.unshift(newLog);
    return newLog;
  }
}

export const db = new LocalMockDatabase();
