import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

(global as any).WebSocket = ws;

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey || url === 'local_sandbox') {
  console.error('❌ Error: SUPABASE_URL atau SUPABASE_SERVICE_KEY belum valid di .env');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws as any }
});

const BASE_IMG_URL = 'https://jqjchljzmzhvfwypfbja.supabase.co/storage/v1/object/public/assets';

async function seedRealCatalog() {
  console.log('🕌 Memulai Proses Pembersihan Data Lama & Seeding Katalog Ajak Abi Store (Termasuk Koleksi Koper Baru)...');

  try {
    // 1. Bersihkan data tabel relasi terlebih dahulu agar tidak terkena foreign key constraints
    console.log('🧹 Menghapus data produk, kategori, varian, ulasan, & banner lama dari Supabase...');
    await supabaseAdmin.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('banners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert 8 Kategori Otentik
    console.log('✨ Menambahkan 8 Kategori Eksklusif Baru...');
    const categories = [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Air Zam-Zam Murni', slug: 'air-zam-zam-murni', description: 'Air suci penuh keberkahan langsung dari Mata Air Zam-Zam Mekkah Al-Mukarramah, dijamin keasliannya dan dikemas higienis.', display_order: 1 },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Baju & Kain Ihram Pria', slug: 'baju-kain-ihram-pria', description: 'Pakaian ihram syar\'i tanpa jahitan dengan serat bambu & katun organik terbaik asal Timur Tengah yang sejuk di kulit.', display_order: 2 },
      { id: '33333333-3333-3333-3333-333333333333', name: 'Kurma & Oleh-Oleh Haji', slug: 'kurma-oleh-oleh-haji', description: 'Kurma Ajwa Madinah, Sukari Royal, dan Medjool Palestine bertekstur lembut dengan nutrisi tinggi siap santap.', display_order: 3 },
      { id: '44444444-4444-4444-4444-444444444444', name: 'Mukena & Hijab Travel', slug: 'mukena-hijab-travel', description: 'Mukena parasut sutra bertekstur selembut awan yang sangat ringan, anti-kusut, dan pas dalam kepalan tangan jamaah.', display_order: 4 },
      { id: '55555555-5555-5555-5555-555555555555', name: 'Sajadah Raudhah & Travel', slug: 'sajadah-raudhah-travel', description: 'Sajadah beludru tebal bernuansa karpet Masjid Habiullah (Raudhah) serta sajadah saku wangi antimikroba.', display_order: 5 },
      { id: '66666666-6666-6666-6666-666666666666', name: 'Songkok, Peci & Kopiah', slug: 'songkok-peci-kopiah', description: 'Kopiah rajut Yaman dan peci songkok beludru hitam anti-gerah untuk kesempurnaan penampilan shalat.', display_order: 6 },
      { id: '77777777-7777-7777-7777-777777777777', name: 'Tasbih Digital & Batu Kayu', slug: 'tasbih-digital-batu-kayu', description: 'Tasbih kokka asli bersertifikat dan tasbih digital LED berdaya tekan ringan untuk memudahkan penghitungan zikir.', display_order: 7 },
      { id: '88888888-8888-8888-8888-888888888888', name: 'Koper & Tas Haji Umrah', slug: 'koper-tas-haji-umrah', description: 'Koper kabin dan bagasi premium kokoh berbahan Polycarbonate & frame alumunium bermerk internasional anti-pecah.', display_order: 8 }
    ];

    const { error: catErr } = await supabaseAdmin.from('categories').insert(categories);
    if (catErr) throw new Error(`Gagal insert kategori: ${catErr.message}`);
    console.log('✅ 8 Kategori berhasil dimasukkan!');

    // 3. Produk Kreatif & Bermutu Tinggi
    console.log('📦 Menyulam dan mengunggah produk-produk kreatif dengan URL foto online...');

    const products = [
      // CATEGORY 1: Air Zam-Zam (id: 11111111-1111-1111-1111-111111111111)
      {
        id: 'a0000001-0001-0001-0001-000000000001',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Air Zam-Zam Murni 5 Liter (Galon Original Bandara Jeddah)',
        slug: 'air-zam-zam-5-liter-original',
        brand: 'Al-Haramain Water',
        base_price: 650000,
        discount_price: 585000,
        weight_grams: 5300,
        sku: 'AAS-ZAM-05L',
        images: [
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(1).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(2).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(3).jpeg`
        ],
        description: 'Galon Air Zam-Zam murni kapasitas 5 Liter asli impor langsung dari maskapai Saudi Arabia / Bandara King Abdulaziz Jeddah. Segel utuh berpita barcode rasmi dari National Water Company Mekkah. Dilengkapi garansi 100% uang kembali atas keasliannya.',
        is_featured: true,
        rating_avg: 4.9,
        review_count: 312,
        status: 'active'
      },
      {
        id: 'a0000001-0001-0001-0001-000000000002',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Air Zam-Zam Kemasan Eksklusif 1 Liter (Botol Food Grade)',
        slug: 'air-zam-zam-1-liter-eksklusif',
        brand: 'Al-Haramain Water',
        base_price: 155000,
        discount_price: 139000,
        weight_grams: 1150,
        sku: 'AAS-ZAM-01L',
        images: [
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(4).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(5).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(6).jpeg`
        ],
        description: 'Air Zam-Zam pilihan siap saji dalam botol kedap udara berlisensi BPA-Free dan Food Grade 1 Liter. Sangat cocok dibagikan kepada kaum kerabat setelah kepulangan dari ibadah Umrah maupun sebagai suplemen zikir harian keluarga.',
        is_featured: false,
        rating_avg: 4.8,
        review_count: 148,
        status: 'active'
      },
      {
        id: 'a0000001-0001-0001-0001-000000000003',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Paket Suvenir Air Zam-Zam Mini 250ml (Isi 12 Botol Kemasan Hampers)',
        slug: 'paket-suvenir-zam-zam-250ml-12-pcs',
        brand: 'Ajak Abi Hampers',
        base_price: 350000,
        discount_price: 299000,
        weight_grams: 3200,
        sku: 'AAS-ZAM-BOX12',
        images: [
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(7).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(8).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(9).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(10).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(11).jpeg`
        ],
        description: 'Paket box elegan berisi 12 botol cantik berukuran 250ml berisi Air Zam-Zam murni. Dikemas rapi dengan kotak karton emas khas Nusantara, menghemat waktu Anda untuk merapikan oleh-oleh hajatan taudiah ibadah.',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 89,
        status: 'active'
      },

      // CATEGORY 2: Baju & Kain Ihram Pria (id: 22222222-2222-2222-2222-222222222222)
      {
        id: 'a0000002-0002-0002-0002-000000000001',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Kain Ihram Serat Bambu Organik 100% (Anti-Panas & Syar\'i Tanpa Jahit)',
        slug: 'kain-ihram-serat-bambu-organik-100',
        brand: 'Ajak Abi Reserve',
        base_price: 420000,
        discount_price: 349000,
        weight_grams: 950,
        sku: 'AAS-IHR-BAMBOO',
        images: [
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(1).jpeg`,
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(2).jpeg`
        ],
        description: 'Kain ihram pria dewasa ketebalan 450 GSM tediri dari 2 lembar utuh tanpa jahitan rilis standar syariah. Menggunakan teknologi rajut dari 100% benang serat bambu alami yang terbukti memberikan rasa sejuk seketika dan menyerap keringat 3 kali lebih cepat saat mengelilingi Ka\'bah di terik siang Mekkah.',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 512,
        status: 'active'
      },
      {
        id: 'a0000002-0002-0002-0002-000000000002',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Kain Ihram Katun Turki Jacquard (Tebal & Lembut Anti-Tembus)',
        slug: 'kain-ihram-katun-turki-jacquard',
        brand: 'Al-Qasim Mecca',
        base_price: 320000,
        discount_price: 275000,
        weight_grams: 1100,
        sku: 'AAS-IHR-TURKY',
        images: [
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(3).jpeg`,
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(4).jpeg`,
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(5).jpeg`
        ],
        description: 'Dibuat dengan rajutan Jacquard dari kapas murni Lembah Aegean Turki. Kain tebal, tidak menerawang, tidak mudah melorot saat dipakaikan sabuk, namun tetap lembut tidak menimbulkan iritasi lecet di pinggul saat berjalan sa\'i dari Shafa ke Marwah.',
        is_featured: false,
        rating_avg: 4.8,
        review_count: 194,
        status: 'active'
      },

      // CATEGORY 3: Kurma & Oleh-Oleh Haji (id: 33333333-3333-3333-3333-333333333333)
      {
        id: 'a0000003-0003-0003-0003-000000000001',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Kurma Ajwa Al-Madinah VIP (Kurma Nabi Keberkahan Asli 500gr)',
        slug: 'kurma-ajwa-al-madinah-vip-500gr',
        brand: 'Madinah Heritage',
        base_price: 280000,
        discount_price: 235000,
        weight_grams: 550,
        sku: 'AAS-KRM-AJWA500',
        images: [
          `${BASE_IMG_URL}/kurma/kurma%20(1).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(2).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(3).jpeg`
        ],
        description: 'Kurma Ajwa berkualitas VIP kelas pertama dipetik langsung dari kebun-kebun tradisional di kawasan Tanah Haram Madinah. Warna hitam gelap pekat dengan garis keemasan halus, aroma harum natural rasa manis Legit non-gula tambahan yang lembut dikunyah.',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 642,
        status: 'active'
      },
      {
        id: 'a0000003-0003-0003-0003-000000000002',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Kurma Sukari King Al-Qassim (Tekstur Basah & Lumer di Lidah 1 Kg)',
        slug: 'kurma-sukari-king-al-qassim-1kg',
        brand: 'Al-Qassim Gold',
        base_price: 185000,
        discount_price: 150000,
        weight_grams: 1050,
        sku: 'AAS-KRM-SUKARI1KG',
        images: [
          `${BASE_IMG_URL}/kurma/kurma%20(4).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(5).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(6).jpeg`
        ],
        description: 'Dikenal sebagai "Kurma Raja", Sukari dari Al-Qassim ini memiliki daging yang tebal, warna keemasan mengkilap, dan tekstur yang sangat basah dan berair sehingga seketika meluber lezat bak kismis karamel tatkala di lidah.',
        is_featured: false,
        rating_avg: 4.9,
        review_count: 423,
        status: 'active'
      },
      {
        id: 'a0000003-0003-0003-0003-000000000003',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Kurma Medjool Palestine Jumbo Selection (500 Gram Box)',
        slug: 'kurma-medjool-palestine-jumbo-500gr',
        brand: 'Al-Aqsa Harvest',
        base_price: 265000,
        discount_price: 220000,
        weight_grams: 550,
        sku: 'AAS-KRM-MDJL',
        images: [
          `${BASE_IMG_URL}/kurma/kurma%20(7).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(8).jpeg`,
          `${BASE_IMG_URL}/kurma/kurma%20(9).jpeg`
        ],
        description: 'Kurma raksasa berukuran hingga 3 kali kurma biasa asal Tanah Diberkati Palestina. Sensasi gigitan daging buah yang sangat mengenyangkan dengan tekstur bergelatin kaya akan potasium penambah stamina ibadah.',
        is_featured: false,
        rating_avg: 4.9,
        review_count: 215,
        status: 'active'
      },

      // CATEGORY 4: Mukena & Hijab Travel (id: 44444444-4444-4444-4444-444444444444)
      {
        id: 'a0000004-0004-0004-0004-000000000001',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Mukena Travel Silk Parasola (Royal Gold Anti-Kusut & Waterproof Wudu)',
        slug: 'mukena-travel-silk-parasola-royal-gold',
        brand: 'Ajak Abi Exclusive',
        base_price: 450000,
        discount_price: 379000,
        weight_grams: 320,
        sku: 'AAS-MKN-RYGLD',
        images: [
          `${BASE_IMG_URL}/mukenah/mukena%20(1).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(2).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(3).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(4).jpeg`
        ],
        description: 'Mukena impian setiap muslimah saat traveling dan ibadah umrah. Menggunakan kain Parasola Silk berfinishing water-repellent (menolak cipratan air wudhu agar tidak basah dan lepek). Bisa dilipat siêu kecil hingga seukuran kotak kacamata.',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 819,
        status: 'active'
      },
      {
        id: 'a0000004-0004-0004-0004-000000000002',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Mukena Dewasa Renda Bordir Al-Qasr (Putih Suci Tulang)',
        slug: 'mukena-dewasa-renda-bordir-alqasr',
        brand: 'Sultan Heritage',
        base_price: 550000,
        discount_price: 469000,
        weight_grams: 650,
        sku: 'AAS-MKN-QASR',
        images: [
          `${BASE_IMG_URL}/mukenah/mukena%20(5).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(6).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(7).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(8).jpeg`
        ],
        description: 'Mukena bermateril katun rayon viscose berkelas yang didesain indah dengan bordiran kelopak melati di sekililing lingkaran kepala dan tepi bawah. Nyaman dinikmati saat shalat fardhu berjam-jam menanti ikomah di Masjidil Haram.',
        is_featured: false,
        rating_avg: 4.9,
        review_count: 310,
        status: 'active'
      },
      {
        id: 'a0000004-0004-0004-0004-000000000003',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Mukena Mini Pouch Parasut Korea (Ultra-Lightweight 200 Gram)',
        slug: 'mukena-mini-pouch-parasut-korea-200gr',
        brand: 'Ajak Abi Travel',
        base_price: 225000,
        discount_price: 189000,
        weight_grams: 200,
        sku: 'AAS-MKN-MINI200',
        images: [
          `${BASE_IMG_URL}/mukenah/mukena%20(9).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(10).jpeg`,
          `${BASE_IMG_URL}/mukenah/mukena%20(11).jpeg`
        ],
        description: 'Mukena paling berbobot ringan dalam seri kepompong kami. Sangat pas dimasukkan ke dalam saku jaket atau tas selempang kecil jamaah agar tak perlu meminjam mukena umum di tempat transit bandara.',
        is_featured: false,
        rating_avg: 4.8,
        review_count: 228,
        status: 'active'
      },

      // CATEGORY 5: Sajadah Raudhah & Travel (id: 55555555-5555-5555-5555-555555555555)
      {
        id: 'a0000005-0005-0005-0005-000000000001',
        category_id: '55555555-5555-5555-5555-555555555555',
        name: 'Sajadah Beludru Empuk Raudhah Madinah (Motif Pintu Masjid An-Nabawy)',
        slug: 'sajadah-beludru-empuk-raudhah-madinah',
        brand: 'Raudhah Exclusive',
        base_price: 320000,
        discount_price: 259000,
        weight_grams: 800,
        sku: 'AAS-SJD-RAUDHAH',
        images: [
          `${BASE_IMG_URL}/sajadah/sejadah%20(1).jpeg`,
          `${BASE_IMG_URL}/sajadah/sejadah%20(2).jpeg`
        ],
        description: 'Sajadah bulu beludru rajutan tebal dengan sensasi aroma mawar haramain. Dilengkapi bantalan di area sujud yang melindungahi dahi dan lutut dari kekerasan lantai granit marmer masjid selama beribadah iktikaf.',
        is_featured: true,
        rating_avg: 4.9,
        review_count: 412,
        status: 'active'
      },
      {
        id: 'a0000005-0005-0005-0005-000000000002',
        category_id: '55555555-5555-5555-5555-555555555555',
        name: 'Sajadah Lipat Saku Waterproof (Anti-Debu & Gratis Tas Mini Pouch)',
        slug: 'sajadah-lipat-saku-waterproof-travel',
        brand: 'Ajak Abi Travel',
        base_price: 99000,
        discount_price: 79000,
        weight_grams: 150,
        sku: 'AAS-SJD-POCKET',
        images: [
          `${BASE_IMG_URL}/sajadah/sejadah%20(3).jpeg`,
          `${BASE_IMG_URL}/sajadah/sejadah%20(4).jpeg`
        ],
        description: 'Sajadah lembaran kedap air yang gampang dicuci bersih dan kering dalam hitungan menit. Dilengkapi sudut berpemberat besi tipis agar tidak terbang tertiup angin saat shalat Jumat di halaman plaza luar Masjid Nabawi.',
        is_featured: false,
        rating_avg: 4.7,
        review_count: 319,
        status: 'active'
      },

      // CATEGORY 6: Songkok, Peci & Kopiah (id: 66666666-6666-6666-6666-666666666666)
      {
        id: 'a0000006-0006-0006-0006-000000000001',
        category_id: '66666666-6666-6666-6666-666666666666',
        name: 'Songkok Nasional Beludru Sutra Hitam (Ac-Ventilasi Udara Anti-Gerah)',
        slug: 'songkok-nasional-beludru-sutra-hitam-ac',
        brand: 'Sultan Peci Nusantara',
        base_price: 150000,
        discount_price: 125000,
        weight_grams: 250,
        sku: 'AAS-PEC-SNGKK',
        images: [
          `${BASE_IMG_URL}/songkok/songkok%20(1).jpeg`,
          `${BASE_IMG_URL}/songkok/songkok%20(2).jpeg`
        ],
        description: 'Songkok hitam berkelas dengan lapisan dalam bersirkulasi udara berlobang (AC mesh). Bahan beludru hitam lekat tidak mudah pudar atau bergelembung walau kena keringat ibadah berhari-hari.',
        is_featured: false,
        rating_avg: 4.8,
        review_count: 175,
        status: 'active'
      },
      {
        id: 'a0000006-0006-0006-0006-000000000002',
        category_id: '66666666-6666-6666-6666-666666666666',
        name: 'Peci Rajut Yaman Turki (Elastis & Ringan di Kepala)',
        slug: 'peci-rajut-yaman-turki-elastis',
        brand: 'Al-Qasim Mecca',
        base_price: 65000,
        discount_price: 49000,
        weight_grams: 80,
        sku: 'AAS-PEC-YAMAN',
        images: [
          `${BASE_IMG_URL}/songkok/songkok%20(3).jpeg`
        ],
        description: 'Peci rajut tangan khas dataran Yaman dan Anatolia Turki. Sangat lentur menyesuaikan bentuk kepala jamaah tanpa menimbulkan rasa tegang atau sakit di pelipis.',
        is_featured: false,
        rating_avg: 4.9,
        review_count: 289,
        status: 'active'
      },

      // CATEGORY 7: Tasbih Digital & Batu Kayu (id: 77777777-7777-7777-7777-777777777777)
      {
        id: 'a0000007-0007-0007-0007-000000000001',
        category_id: '77777777-7777-7777-7777-777777777777',
        name: 'Tasbih Kayu Kokka Asli Turki Bersertifikat (99 Butir Coklat Kilap)',
        slug: 'tasbih-kayu-kokka-asli-turki-99-butir',
        brand: 'Ottoman Beads',
        base_price: 250000,
        discount_price: 195000,
        weight_grams: 180,
        sku: 'AAS-TSB-KOKKA',
        images: [
          `${BASE_IMG_URL}/tasbih/tasbih%20(1).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(2).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(3).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(4).jpeg`
        ],
        description: 'Tasbih zikir dari batang pohon Kokka otentik yang dikenal dalam sejarah bahtera Nabi Nuh AS dan tongkat Nabi Musa AS. Mengandung minyak aromatik alami yang akan semakin mengkilap dan berkelas ketika sering digerakkan jemari Anda saat berzikir.',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 720,
        status: 'active'
      },
      {
        id: 'a0000007-0007-0007-0007-000000000002',
        category_id: '77777777-7777-7777-7777-777777777777',
        name: 'Tasbih Digital Cincin LED OLED (Silent Click & Tombol Reset Pengaman)',
        slug: 'tasbih-digital-cincin-led-oled-silent',
        brand: 'Smart Zikr Ajak Abi',
        base_price: 120000,
        discount_price: 89000,
        weight_grams: 90,
        sku: 'AAS-TSB-DIGITAL',
        images: [
          `${BASE_IMG_URL}/tasbih/tasbih%20(5).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(6).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(7).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(8).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(9).jpeg`
        ],
        description: 'Tasbih pintar bentuk cincin ergonomik dengan layar penunjuk LED jernih yang mudah dibaca saat shalat tahajud di gelap malam. Tombol tekan sangat hening (silent touch) agar tidak mendestabilisasi kekhusyukan jam\'ah lain disebelah Anda.',
        is_featured: false,
        rating_avg: 4.8,
        review_count: 531,
        status: 'active'
      },

      // CATEGORY 8: Koper & Tas Haji Umrah (id: 88888888-8888-8888-8888-888888888888)
      {
        id: 'a0000009-0009-0009-0009-000000000001',
        category_id: '88888888-8888-8888-8888-888888888888',
        name: 'Koper Umrah & Haji Sultan 24 Inch (Aluminium Frame & Dual TSA Lock)',
        slug: 'koper-umrah-haji-sultan-24-inch-aluminium',
        brand: 'Sultan Luggage Exclusive',
        base_price: 1450000,
        discount_price: 1199000,
        weight_grams: 4800,
        sku: 'AAS-KPR-SLTN24',
        images: [
          `${BASE_IMG_URL}/koper/koper%20(1).jpg`,
          `${BASE_IMG_URL}/koper/koper%20(2).jpg`,
          `${BASE_IMG_URL}/koper/koper%20(3).jpg`
        ],
        description: 'Koper travel premium ukuran 24 inch dengan konstruksi kokoh berkerangka alumunium alloy murni (tanpa ritsleting/zipless) yang tangguh menahan beban hingga 35kg dan tahan banting terhadap benturan bagasi penerbangan jarak jauh. Dilengkapi roda ganda berputar 360 derajat super senyap (silent wheels) dan sistem pengamanan ganda berstandar Bandara Internasional (Dual TSA Lock).',
        is_featured: true,
        rating_avg: 5.0,
        review_count: 488,
        status: 'active'
      },
      {
        id: 'a0000009-0009-0009-0009-000000000002',
        category_id: '88888888-8888-8888-8888-888888888888',
        name: 'Koper Kabin Executive 20 Inch (100% Polycarbonate + USB Charging Port)',
        slug: 'koper-kabin-executive-20-inch-usb',
        brand: 'Ajak Abi Luggage',
        base_price: 950000,
        discount_price: 789000,
        weight_grams: 2900,
        sku: 'AAS-KPR-KABIN20',
        images: [
          `${BASE_IMG_URL}/koper/koper%20(4).jpg`,
          `${BASE_IMG_URL}/koper/koper%20(5).jpg`
        ],
        description: 'Koper ukuran kabin 20 inch berbobot ultra ringan namun berdaya tahan luar biasa tinggi dari material 100% Polycarbonate import Germany. Dilengkapi port USB terintegrasi di sisi koper untuk menyambungkan power bank dari dalam, memastikan smartphone Anda senantiasa terisi daya saat menavigasi aplikasi ibadah di bandara.',
        is_featured: false,
        rating_avg: 4.9,
        review_count: 264,
        status: 'active'
      },

      // BONUS: PAKET BUNDLING MABRUR EXCLUSIVE (using multiple authentic items!)
      {
        id: 'a0000008-0008-0008-0008-000000000001',
        category_id: '88888888-8888-8888-8888-888888888888', // Masuk kat Koper & Bundling
        name: 'Paket Bundling VIP Umrah Putra (Koper Sultan 24" + Ihram Serat Bambu + Tasbih Kokka + Air Zam-Zam)',
        slug: 'paket-bundling-vip-umrah-putra-komplit',
        brand: 'Ajak Abi Royal Bundle',
        base_price: 2450000,
        discount_price: 1950000,
        weight_grams: 6800,
        sku: 'AAS-BNDL-VIPPUTRA',
        images: [
          `${BASE_IMG_URL}/koper/koper%20(1).jpg`,
          `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(1).jpeg`,
          `${BASE_IMG_URL}/tasbih/tasbih%20(1).jpeg`,
          `${BASE_IMG_URL}/air_zam-zam/zam-zam%20(4).jpeg`
        ],
        description: 'Paket keberangkatan terlengkap dan termewah untuk jamaah pria! Terdiri dari 1 Koper Umrah & Haji Sultan 24 Inch, 1 set Kain Ihram Serat Bambu Organik, 1 Botol Air Zam-Zam Murni 1 Liter, dan 1 buah Tasbih Kayu Kokka 99 Butir. Solusi praktis sekali beli untuk ibadah mabrur dengan penghematan hingga Rp 500.000!',
        is_featured: true,
        is_bundling: true,
        bundling_items: [
          { name: "Koper Sultan 24 Inch Aluminium Frame", qty: 1 },
          { name: "Kain Ihram Serat Bambu 100%", qty: 1 },
          { name: "Tasbih Kayu Kokka 99 Butir", qty: 1 },
          { name: "Air Zam-Zam Murni 1 Liter Botol", qty: 1 }
        ],
        rating_avg: 5.0,
        review_count: 945,
        status: 'active'
      }
    ];

    const { error: prodErr } = await supabaseAdmin.from('products').insert(products);
    if (prodErr) throw new Error(`Gagal insert produk: ${prodErr.message}`);
    console.log(`✅ ${products.length} Produk Kreatif eksklusif berhasil dimasukkan!`);

    // 4. Insert Varian Produk Untuk Opsi Kustomer
    console.log('⚖️ Menambahkan varian ukuran & warna ke dalam produk...');
    const variants = [
      { product_id: 'a0000001-0001-0001-0001-000000000001', variant_name: 'Kemasan', variant_value: '5 Liter Original Bandara', price_adjustment: 0, stock: 45, sku_variant: 'AAS-ZAM-05L-ORG' },
      { product_id: 'a0000002-0002-0002-0002-000000000001', variant_name: 'Ukuran', variant_value: 'Dewasa Standard (2 x 1.1 Meter)', price_adjustment: 0, stock: 120, sku_variant: 'AAS-IHR-BMB-STD' },
      { product_id: 'a0000002-0002-0002-0002-000000000001', variant_name: 'Ukuran', variant_value: 'Dewasa Jumbo (2.2 x 1.2 Meter)', price_adjustment: 35000, stock: 65, sku_variant: 'AAS-IHR-BMB-JMB' },
      { product_id: 'a0000004-0004-0004-0004-000000000001', variant_name: 'Warna', variant_value: 'Royal Gold (Emas Mewah)', price_adjustment: 0, stock: 85, sku_variant: 'AAS-MKN-RYGLD-GLD' },
      { product_id: 'a0000004-0004-0004-0004-000000000001', variant_name: 'Warna', variant_value: 'Emerald Green (Hijau Raudhah)', price_adjustment: 0, stock: 60, sku_variant: 'AAS-MKN-RYGLD-EMR' },
      { product_id: 'a0000004-0004-0004-0004-000000000001', variant_name: 'Warna', variant_value: 'Pearl White (Putih Mutiara)', price_adjustment: 0, stock: 90, sku_variant: 'AAS-MKN-RYGLD-WHT' },
      { product_id: 'a0000005-0005-0005-0005-000000000001', variant_name: 'Motif', variant_value: 'Pintu Raudhah Emas', price_adjustment: 0, stock: 75, sku_variant: 'AAS-SJD-RAU-DOOR' },
      { product_id: 'a0000005-0005-0005-0005-000000000001', variant_name: 'Motif', variant_value: 'Kubah Hijau Masjid Nabawi', price_adjustment: 0, stock: 55, sku_variant: 'AAS-SJD-RAU-DOME' },
      { product_id: 'a0000007-0007-0007-0007-000000000001', variant_name: 'Warna Batu', variant_value: 'Coklat Tua Kilap', price_adjustment: 0, stock: 150, sku_variant: 'AAS-TSB-KOK-BRN' },
      { product_id: 'a0000007-0007-0007-0007-000000000001', variant_name: 'Warna Batu', variant_value: 'Hitam Legam Eksotis', price_adjustment: 20000, stock: 40, sku_variant: 'AAS-TSB-KOK-BLK' },
      { product_id: 'a0000009-0009-0009-0009-000000000001', variant_name: 'Warna Koper', variant_value: 'Titanium Silver Murni', price_adjustment: 0, stock: 25, sku_variant: 'AAS-KPR-SLTN24-SLV' },
      { product_id: 'a0000009-0009-0009-0009-000000000001', variant_name: 'Warna Koper', variant_value: 'Rose Gold Exclusive', price_adjustment: 0, stock: 20, sku_variant: 'AAS-KPR-SLTN24-GLD' },
      { product_id: 'a0000009-0009-0009-0009-000000000001', variant_name: 'Warna Koper', variant_value: 'Onyx Black Matte', price_adjustment: 0, stock: 30, sku_variant: 'AAS-KPR-SLTN24-BLK' },
      { product_id: 'a0000009-0009-0009-0009-000000000002', variant_name: 'Tipe', variant_value: 'Kabin 20" Standard', price_adjustment: 0, stock: 40, sku_variant: 'AAS-KPR-KAB20-STD' },
      { product_id: 'a0000009-0009-0009-0009-000000000002', variant_name: 'Tipe', variant_value: 'Kabin 20" Front Pocket (Laptop 15")', price_adjustment: 100000, stock: 18, sku_variant: 'AAS-KPR-KAB20-PCKT' }
    ];
    const { error: varErr } = await supabaseAdmin.from('product_variants').insert(variants);
    if (varErr) console.warn('⚠️ Catatan minor saat insert varian:', varErr.message);
    else console.log('✅ Varian sukses dimasukkan!');

    // 5. Insert Banners Hero Eksklusif Menggunakan Foto Asli
    console.log('🖼️ Menambahkan Banner Utama Homepage...');
    const banners = [
      { title: 'Koleksi Koper Sultan Aluminium & Perlengkapan Haji 2026', image_url: `${BASE_IMG_URL}/koper/koper%20(1).jpg`, link_url: '/produk?category=koper-tas-haji-umrah', sort_order: 1, is_active: true },
      { title: 'Paket Bundling VIP Koper & Ihram Hemat Hingga Rp 500.000', image_url: `${BASE_IMG_URL}/baju_ihram_pria/baju-ihram%20(1).jpeg`, link_url: '/produk?is_bundling=true', sort_order: 2, is_active: true },
      { title: 'Mukena Travel Silk Parasola Anti-Kusut & Tasbih Kokka Asli', image_url: `${BASE_IMG_URL}/mukenah/mukena%20(1).jpeg`, link_url: '/produk?category=mukena-hijab-travel', sort_order: 3, is_active: true }
    ];
    await supabaseAdmin.from('banners').insert(banners);

    console.log('\n================================================================');
    console.log('🎉 SEEDING KATALOG ONLINE SUPABASE BERHASIL 100%!');
    console.log(`📦 Total Kategori : ${categories.length} Kategori otentik`);
    console.log(`✨ Total Produk   : ${products.length} Produk dengan foto asli dari Storage`);
    console.log('================================================================\n');

  } catch (err: any) {
    console.error('❌ Terjadi kesalahan selama proses seeding katalog:', err.message || err);
  }
}

seedRealCatalog();
