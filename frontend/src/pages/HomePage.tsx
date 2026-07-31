import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  PackageCheck,
  CheckCircle,
  TrendingUp,
  Star,
  ChevronRight,
  Layers,
  Briefcase,
  Shirt,
  ShieldPlus
} from 'lucide-react';
import { api } from '../lib/api';
import { Banner, Category, Product } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  useEffect(() => {
    // Fetch Homepage Content from API
    api.getBanners().then((res) => setBanners(res || []));
    api.getCategories().then((res) => setCategories(res || []));
    api.getProducts().then((res: Product[]) => {
      if (res) {
        setFeaturedProducts(res);
        setBundleProducts(res.filter((p) => p.is_bundling));
      }
    });
  }, []);

  // Auto Hero Banner Slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners]);

  const displayedProducts = featuredProducts.filter((p) => {
    if (activeTab === 'all') return !p.is_bundling; // Show bundles in specialized section
    return p.category?.slug === activeTab;
  }).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER CMS SECTION (Editorial Luxury Feel) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#241D17] text-white shadow-2xl aspect-[16/10] sm:aspect-[21/9] flex items-center border border-[#3A2E25]">
          {banners.length > 0 ? (
            <>
              {banners.map((ban, idx) => (
                <div
                  key={ban.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentHeroIdx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={ban.image_url}
                    alt={ban.title}
                    className="w-full h-full object-cover object-center scale-105 transform animate-[pulse_10s_ease-in-out_infinite]"
                  />
                  {/* Elegant Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent flex items-center p-8 sm:p-14 lg:p-20">
                    <div className="max-w-xl space-y-5 animate-fade-in-up">
                      <Badge variant="gold" className="px-3 py-1 text-xs">🌟 Eksklusif Keberangkatan 2026</Badge>
                      <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight">
                        {ban.title}
                      </h1>
                      <p className="text-sm sm:text-base text-[#D6CEB8] font-light max-w-md leading-relaxed">
                        Siapkan ibadah tenang dan mabrur dengan bahan ihram serat alami anti gerah, mukena sutra elegan, dan perlengkapan bergaransi sesuai sunnah.
                      </p>
                      <div className="pt-2 flex items-center gap-4">
                        <Button
                          onClick={() => navigate(ban.link_url || '/produk')}
                          variant="gold"
                          size="lg"
                          rightIcon={<ArrowRight className="w-5 h-5" />}
                          className="shadow-xl shadow-amber-900/20"
                        >
                          Lihat Koleksi Eksklusif
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hero Slider Dots */}
              <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentHeroIdx ? 'w-8 bg-[#C9A227]' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center w-full">Memuat presentasi katalog umrah...</div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY HIGHLIGHTS (Muji/Uniqlo Grid Quality) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A7D18] block mb-1">Katalog Spesial</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Perlengkapan Wajib Manasik & Perjalanan</h2>
          </div>
          <Link to="/produk" className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            <span>Jelajahi Semua (34 Produk)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/produk?category=${cat.slug}`}
              className="group relative bg-white rounded-card p-6 border border-[#EBE3D8] hover:border-[#D5C6B5] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#F5EFEA] group-hover:scale-125 transition-transform duration-500 -z-10" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="p-3 rounded-2xl bg-[#F4EEE7] group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-300 shadow-inner">
                  {idx === 0 ? <Layers className="w-6 h-6" /> : idx === 1 ? <Shirt className="w-6 h-6" /> : idx === 2 ? <Briefcase className="w-6 h-6" /> : <ShieldPlus className="w-6 h-6" />}
                </div>
                <span className="text-xs font-bold text-[#A39A8E] group-hover:text-primary transition-colors">0{idx+1} →</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-ink group-hover:text-primary transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#766F63] line-clamp-2 leading-relaxed">
                  {cat.slug.includes('ihram') ? 'Bahan serat bambu organik tidak terawang & bersirkulasi tinggi.' :
                   cat.slug.includes('sholat') ? 'Mukena travel sutra import anti kusut & sajadah pocket ringan.' :
                   cat.slug.includes('koper') ? 'Hardcase aluminium bersertifikasi TSA & anti banting kabin/bagasi.' :
                   'Herbal stamina tanah suci, spray wudhu, & kebutuhan safar.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED BUNDLING PACKAGES (Explicitly using larger varied card design instead of rigid uniform grid) */}
      {bundleProducts.length > 0 && (
        <section className="bg-[#EDE7DE] py-14 border-y border-[#DCDEC2] border-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227] text-white text-xs font-extrabold tracking-wide uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Paket Bundling Ekonomis</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
                  Paket Komplit Siap Keberangkatan
                </h2>
                <p className="text-sm text-[#766F63] max-w-xl">
                  Dirancang khusus untuk menghemat hingga 20% dibandingkan pembelian satuan. Sudah mencakup ihram, mukena, koper, dan kit kesehatan resmi.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/produk?category=paket-bundling')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Lihat Semua Paket Bundling
              </Button>
            </div>

            {/* Varied Featured 2-Column Wide Layout (Section 5.2 compliance) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bundleProducts.slice(0, 2).map((bundle) => (
                <ProductCard key={bundle.id} product={bundle} size="featured" />
              ))}
            </div>

            {/* Guarantee note under bundle showcase */}
            <div className="mt-8 p-4 rounded-xl bg-[#FAF8F5] border border-[#DCD3C5] flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-[#6B4F3B] gap-3">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <PackageCheck className="w-5 h-5 text-[#C9A227] shrink-0" />
                <span>Seluruh paket bundling dilengkapi kemasan exclusive travel dust-bag & buku saku doa manasik gratis!</span>
              </div>
              <span className="text-[#9A7D18] underline cursor-pointer">Pelajari Garansi Produk →</span>
            </div>

          </div>
        </section>
      )}

      {/* 4. BEST SELLERS & COLLECTION GRID (With Category Filter Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-accent-gold" />
              <span>Pilihan Favorit Jamaah</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ink">
              Koleksi Terbaik Ajak Abi
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-[#EEEAE3] rounded-full border border-[#DFD8CE]">
            {[
              { id: 'all', label: 'Semua Produk' },
              { id: 'perlengkapan-ihram', label: 'Ihram Pria' },
              { id: 'perlengkapan-sholat', label: 'Mukena Sutra' },
              { id: 'koper-tas-travel', label: 'Koper TSA' },
              { id: 'kesehatan-obat-perjalanan', label: 'Travel Kit' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-[#766F63] hover:text-ink hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} size="standard" />
          ))}
        </div>

        {/* View Catalog Bottom Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/produk')}
            variant="outline"
            size="lg"
            className="px-10 py-3.5 bg-white font-serif tracking-wide border-[#CEBFA7] text-[#6B4F3B] hover:bg-[#FAF6F0]"
          >
            Menampilkan Koleksi Lengkap Katalog Perlengkapan Umrah →
          </Button>
        </div>
      </section>

      {/* 5. EDITORIAL BRAND STORY (Why Choose Ajak Abi Store?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-gradient-to-br from-[#1F1B16] via-[#2F2720] to-[#3B2D22] text-[#EFEAE2] p-8 sm:p-14 lg:p-16 border border-[#4A392C] shadow-2xl relative overflow-hidden">
          
          {/* Background Decorative Islamic geometric tone */}
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-primary/40 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold tracking-widest uppercase inline-block">
                Keunggulan Material Pilihan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Mengapa Jamaah Umrah Mempercayakan Kebutuhannya Pada Kami?
              </h2>
              <p className="text-sm sm:text-base text-[#BDB4A7] leading-relaxed">
                Perjalanan ke Tanah Suci adalah ibadah istimewa dengan cuaca ekstrem Timur Tengah. Perlengkapan biasa seringkali memicu rasa gerah dan kelelahan. Kami menguji langsung setiap tenunan kain di bawah sengatan matahari Mekah dan kedinginan subuh Madinah.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#C9A227] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Serat Bambu Organik 100%</h4>
                    <p className="text-xs text-[#9B9285] mt-1">Menyerap keringat 3x lebih cepat tanpa terasa lepek saat tawaf dan sai siang hari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#C9A227] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Mukena Sutra Anti Kusut</h4>
                    <p className="text-xs text-[#9B9285] mt-1">Sangat ringkas masuk tas jinjing, langsung rapi dipakai tanpa perlu disetrika.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div className="border-l-2 border-[#C9A227] pl-4">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white block tabular-price">25.000+</span>
                  <span className="text-xs text-[#A89E90] uppercase tracking-wider">Jamaah Merasa Nyaman</span>
                </div>
                <div className="border-l-2 border-[#C9A227] pl-4">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white block tabular-price">4.9 / 5.0</span>
                  <span className="text-xs text-[#A89E90] uppercase tracking-wider">Rating Kepuasan Ulasan</span>
                </div>
              </div>
            </div>

            {/* Editorial Showcase Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#C9A227]/40 shadow-2xl bg-[#322820]">
                <img
                  src="https://images.unsplash.com/photo-1565552643982-2e557b7f43e1?q=80&w=700&auto=format&fit=crop"
                  alt="Kualitas perlengkapan Umrah Ajak Abi di Tanah Suci"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="bg-[#241D17]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#C9A227] fill-current" />
                      <span className="text-xs font-semibold text-white">Rekomendasi Utama Travel Haji & Umrah Resmi</span>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. INSTANT WA CONSULTATION CTA BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#C9A227] text-[#1F1B16] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#1F1B16] text-[#C9A227] flex items-center justify-center font-bold shrink-0 text-2xl shadow">
              💬
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl">Pertama Kali Keberangkatan? Bantuan Konsultasi Gratis!</h3>
              <p className="text-sm text-[#3C301D] font-medium mt-0.5">
                Ustadz dan konsultan manasik kami bersabar membimbing checklist perlengkapan persis sesuai jadwal maskapai Anda.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Assalamu%27alaikum%20Ajak%20Abi%20Store%2C%20saya%20ingin%20konsultasi%20mengenai%20kebutuhan%20perlengkapan%20umrah."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-[#1F1B16] hover:bg-[#342A20] text-[#EBE3D8] font-bold text-sm rounded-xl shadow-lg transition-colors whitespace-nowrap shrink-0"
          >
            Hubungi Konsultan WA Sekarang
          </a>
        </div>
      </section>

    </div>
  );
};
