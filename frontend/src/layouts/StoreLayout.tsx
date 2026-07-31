import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Home,
  Grid,
  ChevronDown,
  Layers,
  Briefcase,
  ShieldPlus,
  BookOpen,
  Shirt,
  Gift,
  PackageCheck,
  ShieldCheck,
  Award,
  Truck,
  PhoneCall,
  Settings,
  Sparkles,
  Check
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { Category, Product } from '../types';
import { CartDrawer } from '../components/cart/CartDrawer';

// Helper to map category icon names to Lucide icon components
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Layers': return <Layers className="w-5 h-5 text-primary" />;
    case 'Heart': return <Heart className="w-5 h-5 text-[#914739]" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5 text-accent-gold" />;
    case 'ShieldPlus': return <ShieldPlus className="w-5 h-5 text-success" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5 text-primary-dark" />;
    case 'Shirt': return <Shirt className="w-5 h-5 text-sage" />;
    case 'Gift': return <Gift className="w-5 h-5 text-[#9A7D18]" />;
    case 'PackageCheck': return <PackageCheck className="w-5 h-5 text-primary font-bold" />;
    default: return <Layers className="w-5 h-5 text-primary" />;
  }
};

export const StoreLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openDrawer, getTotalCount, isBouncing } = useCartStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const { user, isAuthenticated, activeRole } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res || []));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Autocomplete Search Handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      api.getProducts({ search: searchQuery }).then((res) => {
        setSearchResults((res || []).slice(0, 5));
        setShowAutocomplete(true);
      });
    } else {
      setSearchResults([]);
      setShowAutocomplete(false);
    }
  }, [searchQuery]);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowAutocomplete(false);
      navigate(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-[#1F1B16]">
      {/* Top Banner Notice */}
      <div className="bg-[#4A3527] text-[#FAF8F5] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
        <span>Promo Keberangkatan Umrah 2026: Gunakan Kode <strong className="text-[#C9A227] underline">MABRUR2026</strong> untuk Diskon 15% (Hingga Rp 350.000)!</span>
        <span className="hidden sm:inline-block border-l border-white/20 pl-2 ml-2">Pengiriman Ekspress JNE YES Tersedia</span>
      </div>

      {/* Sticky Main Navigation */}
      <header className={`sticky top-0 z-40 bg-white border-b border-[#EDE7DE] transition-all duration-200 ${
        isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-2.5' : 'py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-serif text-xl font-bold shadow-sm group-hover:bg-primary-dark transition-colors">
              <img src="/abi-white.png" alt="Ajak Abi Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-ink tracking-tight leading-none group-hover:text-primary transition-colors">
                Ajak Abi Store
              </span>
              <span className="text-[10px] text-[#766F63] font-medium uppercase tracking-widest mt-0.5">
                Umrah & Haji Equipment
              </span>
            </div>
          </Link>

          {/* Large Centered Search Bar with Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowAutocomplete(true); }}
                placeholder="Cari kain ihram serat bambu, mukena sutra, koper TSA, paket bundling..."
                className="w-full bg-[#FAF8F5] border border-[#DED7CD] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-full py-2.5 pl-5 pr-11 text-sm text-ink placeholder-[#968F83] transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Cari produk"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Autocomplete Dropdown Popup */}
            {showAutocomplete && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#EBE3D8] rounded-xl shadow-2xl py-3 z-50 animate-fade-in-up">
                <div className="px-4 pb-2 mb-2 border-b border-[#F2EDE5] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B6A52] uppercase tracking-wider">Saran Produk Terpopuler:</span>
                  <span className="text-[11px] text-[#766F63]">{searchResults.length} ditemukan</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#F9F6F0]">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setShowAutocomplete(false);
                          setSearchQuery('');
                          navigate(`/produk/${prod.slug}`);
                        }}
                        className="flex items-center gap-3 p-3 px-4 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                      >
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=200&auto=format&fit=crop'}
                          alt={prod.name}
                          className="w-12 h-12 rounded object-cover border border-[#EDE6DA] shrink-0"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-semibold text-sm text-ink truncate">{prod.name}</span>
                          <span className="text-xs text-[#766F63]">{prod.brand} • <strong className="text-primary tabular-price">Rp {(prod.discount_price ?? prod.base_price).toLocaleString('id-ID')}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-[#766F63]">
                    Tidak ada produk yang cocok untuk "{searchQuery}"
                  </div>
                )}

                <div className="px-4 pt-2.5 mt-1 border-t border-[#F2EDE5]">
                  <button
                    onClick={() => {
                      setShowAutocomplete(false);
                      navigate(`/produk?search=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="w-full py-2 bg-[#F5F0EA] hover:bg-[#EAE2D7] text-primary text-xs font-bold rounded-lg text-center transition-colors"
                  >
                    Lihat Semua Hasil untuk "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 hover:bg-[#F5F0EA] rounded-full transition-colors text-ink/80 hover:text-primary hidden sm:flex items-center justify-center"
              aria-label="Wishlist favorit"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#B5473A] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Bounce Micro-Animation & count badge */}
            <div className="relative group/cart">
              <button
                onClick={openDrawer}
                className={`relative p-2.5 hover:bg-[#F5F0EA] rounded-full transition-colors text-ink/80 hover:text-primary flex items-center justify-center ${
                  isBouncing ? 'animate-bounce-cart bg-primary/10 text-primary' : ''
                }`}
                aria-label="Buka keranjang belanja"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1 shadow-sm ${
                    isBouncing ? 'scale-125 transition-transform duration-300' : ''
                  }`}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mini Preview on Hover for Desktop */}
              {cartCount > 0 && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#EFECE6] rounded-card shadow-2xl p-4 opacity-0 pointer-events-none group-hover/cart:opacity-100 group-hover/cart:pointer-events-auto transition-all duration-200 z-50 hidden md:block">
                  <div className="text-xs font-bold text-ink pb-2 border-b border-[#F2EDE5] mb-2">
                    {cartCount} Item di Dalam Keranjang
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {useCartStore.getState().items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-primary w-5">{item.qty}x</span>
                        <span className="truncate flex-1 font-medium text-ink">{item.product.name}</span>
                        <span className="font-semibold tabular-price text-ink/90">
                          Rp {((item.product.discount_price ?? item.product.base_price) * item.qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F2EDE5] flex items-center justify-between font-bold text-sm text-ink">
                    <span>Total:</span>
                    <span>Rp {useCartStore.getState().getSubtotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Account / Role Button */}
            <div className="flex items-center gap-2 pl-2 sm:border-l border-[#EDE7DE]">
              <Link
                to={isAuthenticated ? "/akun" : "/masuk"}
                className="flex items-center gap-2 p-2 px-3 hover:bg-[#F5F0EA] rounded-full sm:rounded-button transition-colors text-xs font-semibold text-ink group"
              >
                <div className="w-7 h-7 rounded-full bg-[#EDE7DE] flex items-center justify-center overflow-hidden border border-[#DCD3C6]">
                  {isAuthenticated && user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight">
                  <span className="text-ink font-bold group-hover:text-primary transition-colors">
                    {isAuthenticated && user ? user.full_name : 'Masuk / Daftar'}
                  </span>
                  <span className="text-[10px] text-[#766F63] uppercase">
                    {isAuthenticated ? `${user?.role || 'Member'} Profile` : 'Member Area'}
                  </span>
                </div>
              </Link>

              {/* Robust Navigation to Admin Portal */}
              <button
                onClick={() => {
                  if (isAuthenticated && user?.role === 'admin') {
                    navigate('/admin');
                  } else {
                    navigate('/admin-login');
                  }
                }}
                title="Buka Portal Konsol Operasional Gudang & Owner"
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 bg-[#2C241D] text-[#C9A227] hover:bg-[#3E332B] border-[#4A3C30] shadow-sm"
              >
                <Settings className="w-3 h-3 text-[#C9A227]" />
                <span>⚙️ Portal Admin</span>
              </button>
            </div>

          </div>

        </div>

        {/* Secondary Navigation Row: Mega-Menu Category Bar */}
        <div className="border-t border-[#F2ECE4] mt-3 hidden md:block bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium text-[#6B4F3B]">
            
            {/* Mega-Menu Trigger */}
            <div 
              className="relative py-2.5 pr-6 cursor-pointer flex items-center gap-1.5 font-bold border-b-2 border-transparent hover:border-primary transition-all select-none"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Grid className="w-4 h-4 text-[#C9A227]" />
              <span>Semua Kategori Perlengkapan</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMegaMenu ? 'rotate-180 text-primary' : ''}`} />

              {/* Mega-Menu Dropdown Panel */}
              {showMegaMenu && (
                <div className="absolute top-full left-0 w-[680px] bg-white border border-[#EBE3D8] rounded-b-2xl shadow-2xl p-6 z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2EDE5]">
                    <span className="font-serif text-sm font-bold text-ink">Katalog Kategori Umrah & Haji</span>
                    <Link to="/produk" className="text-xs font-semibold text-[#C9A227] hover:underline flex items-center gap-1">
                      Lihat Semua Koleksi (34 Produk) →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/produk?category=${cat.slug}`}
                        onClick={() => setShowMegaMenu(false)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF8] hover:bg-[#F5F0EA] border border-[#EFECE6] hover:border-[#DFCEBC] transition-all group/cat"
                      >
                        <div className="p-2.5 rounded-lg bg-white shadow-sm group-hover/cat:bg-primary group-hover/cat:text-white transition-colors shrink-0">
                          {getCategoryIcon(cat.icon_url)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-ink group-hover/cat:text-primary transition-colors">{cat.name}</span>
                          <span className="text-[11px] text-[#766F63] line-clamp-1 mt-0.5">
                            {cat.slug.includes('ihram') ? 'Kain berserat organik tanpa jahit' :
                             cat.slug.includes('sholat') ? 'Mukena travel parasut sutra & sajadah slim' :
                             cat.slug.includes('koper') ? 'Hardcase aluminium TSA tahan banting' :
                             cat.slug.includes('bundling') ? 'Hemat Rp 400.000 paket komplit perjalanan' :
                             'Perlengkapan wajib standar internasional'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 p-3.5 rounded-xl bg-[#4A3527] text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A227]" />
                      <span>Bingung pilih perlengkapan yang tepat? Konsultasi via WhatsApp dengan Ust. Pembimbing!</span>
                    </div>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#C9A227] hover:bg-[#B38F1F] font-bold rounded-md transition-colors text-white whitespace-nowrap">
                      Tanya Konsultan WA →
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-6">
              <Link to="/" className="hover:text-ink py-2 transition-colors">Beranda</Link>
              <Link to="/produk?category=paket-bundling" className="text-[#C9A227] font-bold hover:underline flex items-center gap-1 py-2">
                <span>🎁 Paket Bundling Umrah</span>
              </Link>
              <Link to="/produk?category=baju-kain-ihram-pria" className="hover:text-ink py-2 transition-colors">Kain Ihram Organik</Link>
              <Link to="/produk?category=mukena-hijab-travel" className="hover:text-ink py-2 transition-colors">Mukena Travel Sutra</Link>
              <Link to="/produk?category=koper-tas-haji-umrah" className="hover:text-ink py-2 transition-colors">Koper TSA 24"</Link>
              <Link to="/bantuan" className="text-[#766F63] hover:text-ink py-2 transition-colors">Cara Belanja & FAQ</Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Slide-In Cart Drawer */}
      <CartDrawer />

      {/* Main Retail Viewport */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Standard E-Commerce Mobile Pattern - NO Hamburger Admin Sidebar!) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EDE7DE] py-2 px-6 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            location.pathname === '/' ? 'text-primary font-bold' : 'text-[#766F63]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/produk"
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            location.pathname.startsWith('/produk') ? 'text-primary font-bold' : 'text-[#766F63]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Katalog</span>
        </Link>
        <button
          onClick={openDrawer}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-[#766F63] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </button>
        <Link
          to="/akun"
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            location.pathname.startsWith('/akun') ? 'text-primary font-bold' : 'text-[#766F63]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Akun Saya</span>
        </Link>
      </nav>

      {/* Complete E-Commerce Trust Footer */}
      <footer className="bg-[#1F1B16] text-[#EFEAE2] pt-14 pb-10 border-t-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-white/10 text-center sm:text-left">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-primary/30 text-[#C9A227] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white">Kualitas 100% Sesuai Syariat</h4>
                <p className="text-xs text-[#A39A8E] mt-0.5">Ditenun & dirancang dengan bimbingan ustadz berpengalaman manasik.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-primary/30 text-[#C9A227] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white">Pengiriman Cepat & Aman</h4>
                <p className="text-xs text-[#A39A8E] mt-0.5">Integrasi kurir JNE YES, Sicepat BEST, dengan pelacakan resi real-time.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-full bg-primary/30 text-[#C9A227] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-white">Pembayaran Nyaman & Terverifikasi</h4>
                <p className="text-xs text-[#A39A8E] mt-0.5">Didukung Midtrans Snap (Virtual Account Mandiri/BCA, QRIS, GoPay).</p>
              </div>
            </div>
          </div>

          {/* Footer Grid Links */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C9A227] flex items-center justify-center text-ink font-serif text-lg font-bold">
                  <img src="/abi-white.png" alt="Ajak Abi Logo" className="w-5 h-5 object-contain" />
                </div>
                <span className="font-serif font-bold text-xl text-white">Ajak Abi Store</span>
              </div>
              <p className="text-sm text-[#B5AC9F] leading-relaxed pr-6">
                Destinasi utama perlengkapan perjalanan ibadah Umrah dan Haji nomor #1 di Indonesia. Mengutamakan kenyamanan serat alami tropis, ketahanan koper internasional, dan elegan sesuai nilai tauhid.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-[#C9A227]">
                <PhoneCall className="w-4 h-4" />
                <span>Layanan CS & Konsultasi WA: <strong>+62 812-3456-7890</strong> (08:00 - 21:00 WIB)</span>
              </div>
            </div>

            <div>
              <h5 className="font-serif font-bold text-sm text-white mb-4 uppercase tracking-wider">Koleksi Produk</h5>
              <ul className="space-y-2.5 text-sm text-[#B5AC9F]">
                <li><Link to="/produk?category=baju-kain-ihram-pria" className="hover:text-white transition-colors">Perlengkapan Ihram Pria</Link></li>
                <li><Link to="/produk?category=mukena-hijab-travel" className="hover:text-white transition-colors">Mukena Sutra Anti Kusut</Link></li>
                <li><Link to="/produk?category=koper-tas-haji-umrah" className="hover:text-white transition-colors">Koper Hardcase Aluminium TSA</Link></li>
                <li><Link to="/produk?category=air-zam-zam-murni" className="hover:text-white transition-colors">Air Zam-Zam Murni Original</Link></li>
                <li><Link to="/produk?category=paket-bundling" className="text-[#C9A227] font-semibold hover:underline">Paket Bundling Mabrur VIP</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-serif font-bold text-sm text-white mb-4 uppercase tracking-wider">Layanan Pelanggan</h5>
              <ul className="space-y-2.5 text-sm text-[#B5AC9F]">
                <li><Link to="/bantuan" className="hover:text-white transition-colors">Cara Melakukan Pemesanan</Link></li>
                <li><Link to="/kebijakan-retur" className="hover:text-white transition-colors">Kebijakan Pengembalian & Garansi</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Pertanyaan Sering Diajukan (FAQ)</Link></li>
                <li><Link to="/akun/pesanan" className="hover:text-white transition-colors">Lacak Status Resi & Pesanan</Link></li>
                <li><Link to="/wishlist" className="hover:text-white transition-colors">Daftar Produk Impian (Wishlist)</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-serif font-bold text-sm text-white mb-4 uppercase tracking-wider">Keamanan & Pembayaran</h5>
              <p className="text-xs text-[#B5AC9F] mb-3">Transaksi Anda terlindungi enkripsi SSL 256-bit dan diawasi Bank Indonesia.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1.5 bg-white text-ink text-xs font-bold rounded shadow">Midtrans Snap</span>
                <span className="px-2.5 py-1.5 bg-white text-blue-900 text-xs font-bold rounded shadow">Mandiri VA</span>
                <span className="px-2.5 py-1.5 bg-white text-blue-700 text-xs font-bold rounded shadow">BCA VA</span>
                <span className="px-2.5 py-1.5 bg-white text-red-700 text-xs font-bold rounded shadow">QRIS / GoPay</span>
                <span className="px-2.5 py-1.5 bg-[#3E7B4F] text-white text-xs font-bold rounded shadow">JNE / Sicepat</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#827A6E] gap-4">
            <span>© 2026 Ajak Abi Store (E-Commerce Perlengkapan Umrah & Haji). All rights reserved.</span>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Syariat & Privasi</span>
              <span className="hover:text-white cursor-pointer">Syarat & Ketentuan Layanan</span>
              <span className="hover:text-white cursor-pointer">Peta Situs</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
