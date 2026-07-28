import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  MessageSquare,
  Share2,
  AlertTriangle,
  ZoomIn,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import { api } from '../lib/api';
import { Product, ProductVariant, Review } from '../types';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProductCard } from '../components/ui/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'spesifikasi' | 'ulasan'>('deskripsi');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New review submission form state
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    api.getProductBySlug(slug).then((res: Product) => {
      if (res) {
        setProduct(res);
        if (res.variants && res.variants.length > 0) {
          setSelectedVariant(res.variants[0]);
        }
        setSelectedImgIdx(0);
        setQty(1);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) {
    return <div className="py-32 text-center text-sm text-[#766F63]">Memuat informasi spesifikasi produk umrah...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-[#766F63] mb-6">Produk yang Anda cari mungkin sudah dipindahkan atau habis terjual.</p>
        <Button onClick={() => navigate('/produk')} variant="primary">Kembali ke Katalog Produk</Button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const currentPrice = (product.discount_price ?? product.base_price) + (selectedVariant?.price_adjustment || 0);
  const originalPrice = product.base_price + (selectedVariant?.price_adjustment || 0);
  const hasDiscount = product.discount_price !== undefined && product.discount_price !== null && product.discount_price < product.base_price;
  const currentStock = selectedVariant ? selectedVariant.stock : 45;

  const handleAddToCart = () => {
    addItem(product, selectedVariant || undefined, qty);
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant || undefined, qty);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsSubmittingReview(true);
    try {
      const newRev = await api.client.post('/reviews', {
        product_id: product.id,
        rating: ratingInput,
        comment: commentInput,
      }).then((r: any) => r.data.data);

      if (newRev) {
        setProduct((prev) => prev ? { ...prev, reviews: [newRev, ...(prev.reviews || [])], review_count: prev.review_count + 1 } : null);
        setCommentInput('');
        alert('Ulasan Anda berhasil dikirim! Terima kasih atas masukan Anda.');
      }
    } catch (err) {
      alert('Gagal mengirim ulasan.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb navigation */}
      <nav className="text-xs text-[#766F63] font-medium flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Beranda</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/produk" className="hover:text-ink">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/produk?category=${product.category?.slug}`} className="hover:text-ink">{product.category?.name || 'Perlengkapan'}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* PRODUCT SHOWCASE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT: PHOTO GALLERY (Thumbnails + Large Zoomable Image) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-2 sm:pb-0 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIdx(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-[#F5F2ED] ${
                  idx === selectedImgIdx ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Main Showcase Viewport */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative flex-1 aspect-[4/5] rounded-card overflow-hidden bg-[#F5F2ED] border border-[#EBE3D8] cursor-zoom-in group shadow-sm"
          >
            <img
              src={product.images[selectedImgIdx] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=700'}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Top Badge */}
            {product.is_bundling && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="gold" className="px-3 py-1 text-xs shadow-md">✨ Paket Lengkap Keberangkatan Umrah</Badge>
              </div>
            )}

            <div className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-ink/80 shadow-md group-hover:bg-primary group-hover:text-white transition-all">
              <ZoomIn className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* RIGHT: SPECIFICATION, VARIANTS & COMMERCE ACTION BOX */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#766F63] mb-1.5">
              <span className="uppercase tracking-widest text-[#8B6A52]">{product.brand || 'Ajak Abi Signature'}</span>
              <div className="flex items-center gap-1.5 bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#ECE3C8] text-[#9A7D18]">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span className="font-bold">{product.rating_avg.toFixed(1)}</span>
                <span className="text-ink/60 font-medium">({product.review_count} ulasan jamaah)</span>
              </div>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#82796E] mt-1">SKU: {product.sku} • Berat Kirim: {product.weight_grams}g ({Math.ceil(product.weight_grams/1000)}kg)</p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#EBE3D8] shadow-inner space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-ink tabular-price">
                Rp {currentPrice.toLocaleString('id-ID')}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-[#82796E] line-through tabular-price">
                    Rp {originalPrice.toLocaleString('id-ID')}
                  </span>
                  <Badge variant="terracotta" size="md" className="ml-1">
                    Hemat {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Low Stock Alert / Status */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              {currentStock < 10 ? (
                <div className="flex items-center gap-1.5 text-danger font-bold bg-danger/10 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Stok menipis! Hanya sisa {currentStock} unit siap kirim sebelum tanggal keberangkatan Anda.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-success font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Stok Tersedia ({currentStock} unit siap kirim hari ini via JNE YES / Sicepat)</span>
                </div>
              )}
            </div>
          </div>

          {/* Bundling Item Recipe Breakdown */}
          {product.is_bundling && product.bundling_items.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-950/5 border border-amber-900/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#8B6A52]">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Rincian Isi Paket Lengkap (Bundling Hemat):</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.bundling_items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EBE3D8] text-xs font-semibold text-ink shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FAF6EE] text-[#9A7D18] font-extrabold text-[11px]">
                      {item.qty} Unit
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-[#766F63] italic">
                *Lebih hemat Rp 450.000 dibandingkan Anda mengumpulkan perlengkapan ini satu per satu.
              </p>
            </div>
          )}

          {/* Interactive Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#EDE7DE]">
              <label className="text-xs font-bold uppercase tracking-wider text-ink block">
                Pilih {product.variants[0]?.variant_name || 'Varian Model'}: <span className="text-primary">{selectedVariant?.variant_value}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-md scale-105'
                          : 'bg-white hover:bg-[#FAF8F5] text-ink border-[#DCD3C5]'
                      }`}
                    >
                      <span>{v.variant_value}</span>
                      {v.price_adjustment !== 0 && (
                        <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-[#F4E9C1]' : 'text-[#766F63]'}`}>
                          ({v.price_adjustment > 0 ? `+Rp ${v.price_adjustment.toLocaleString('id-ID')}` : `-Rp ${Math.abs(v.price_adjustment).toLocaleString('id-ID')}`})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink block">Jumlah Pemesanan:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#DCD3C5] rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2.5 hover:bg-[#EDE6DE] text-ink transition-colors font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-base font-extrabold tabular-price select-none text-ink">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((prev) => Math.min(currentStock, prev + 1))}
                  className="px-3.5 py-2.5 hover:bg-[#EDE6DE] text-ink transition-colors font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-[#766F63]">Subtotal perkiraan: <strong className="text-ink font-bold tabular-price">Rp {(currentPrice * qty).toLocaleString('id-ID')}</strong></span>
            </div>
          </div>

          {/* Large CTA Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
              className="shadow-xl"
            >
              Tambah ke Keranjang
            </Button>
            
            <Button
              onClick={handleBuyNow}
              variant="gold"
              size="lg"
              className="shadow-xl"
            >
              Beli Sekarang →
            </Button>
          </div>

          {/* Wishlist & Share Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EDE7DE] text-xs font-semibold text-[#766F63]">
            <button
              onClick={() => toggleWishlist(product)}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#B5473A] text-[#B5473A]' : ''}`} />
              <span>{wishlisted ? 'Tersimpan di Wishlist Anda' : 'Simpan ke Wishlist Favorit'}</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan produk berhasil disalin!');
                }
              }}
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Produk</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#C5E1CC] text-[#2F643F] text-xs space-y-2 font-medium">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#2F643F]" />
              <span>Garansi Tukar Baru 100% Sesuai Spesifikasi Syariat & Maskapai</span>
            </div>
            <p className="text-[11px] text-[#426F52] leading-relaxed pl-6">
              Jika ukuran ihram atau mukena kurang nyaman saat dites di rumah sebelum keberangkatan, kirimkan kembali kepada kami untuk penukaran ukuran gratis tanpa biaya tambahan!
            </p>
          </div>

        </div>

      </div>

      {/* TABS SECTION: DESKRIPSI, SPESIFIKASI MATERIAL, ULASAN JAMAAH */}
      <div className="bg-white rounded-card border border-[#EBE3D8] overflow-hidden shadow-sm">
        
        {/* Tab Headers */}
        <div className="flex border-b border-[#EDE7DE] bg-[#FAF8F5]">
          {[
            { id: 'deskripsi', label: 'Deskripsi Produk & Syariat' },
            { id: 'spesifikasi', label: 'Spesifikasi Material & Ukuran' },
            { id: 'ulasan', label: `Ulasan Jamaah (${product.review_count})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-4 px-6 font-serif text-sm font-bold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-primary text-primary bg-white shadow-sm'
                  : 'border-transparent text-[#766F63] hover:text-ink hover:bg-white/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-10">
          
          {/* TAB 1: DESKRIPSI */}
          {activeTab === 'deskripsi' && (
            <div className="prose max-w-none text-sm sm:text-base text-[#59524A] space-y-4 leading-relaxed">
              <p className="font-serif text-lg text-ink font-semibold italic">
                "{product.description}"
              </p>
              <h4 className="font-serif text-base font-bold text-ink pt-2">Keunggulan Khusus Perjalanan Umrah & Haji:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Sirkulasi Udara Tingkat Tinggi:</strong> Dirancang agar sirkulasi keringat berjalan optimal baik di musim panas maupun musim dingin Kota Makkah & Madinah.</li>
                <li><strong>Standar Hukum Syariat Terverifikasi:</strong> Untuk pakaian ihram dipastikan 100% tanpa jala atau benang jahit. Untuk mukena teruji menolak tembus pandang dan menutupi dagu & aurat sempurna saat ruku dan sujud.</li>
                <li><strong>Kemasan Travel Compact:</strong> Sudah termasuk travel pouch kedap yang mempermudah pengaturan bagasi koper kargo maupun kabin pesawat Anda.</li>
              </ul>
            </div>
          )}

          {/* TAB 2: SPESIFIKASI */}
          {activeTab === 'spesifikasi' && (
            <div className="max-w-2xl space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F2EDE5]">
                <span className="font-medium text-[#766F63]">Kategori Produk:</span>
                <span className="font-bold text-ink">{product.category?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F2EDE5]">
                <span className="font-medium text-[#766F63]">Brand / Produsen:</span>
                <span className="font-bold text-ink">{product.brand || 'Ajak Abi Store Exclusive'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F2EDE5]">
                <span className="font-medium text-[#766F63]">Berat Satuan Kirim:</span>
                <span className="font-bold text-ink">{product.weight_grams} Gram</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F2EDE5]">
                <span className="font-medium text-[#766F63]">Asal Produk / Sertifikasi:</span>
                <span className="font-bold text-ink">100% Original bersertifikat Kemenag & ISO Fabric Quality</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="font-medium text-[#766F63]">Cara Pencucian & Perawatan:</span>
                <span className="font-medium text-ink">Dianjurkan cuci dengan tangan atau putaran mesin lembut. Jangan gunakan pemutih keras agar serat bambu/sutra tetap utuh.</span>
              </div>
            </div>
          )}

          {/* TAB 3: ULASAN JAMAAH */}
          {activeTab === 'ulasan' && (
            <div className="space-y-10">
              
              {/* Reviews Summary header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9A227] text-white flex flex-col items-center justify-center font-serif shadow-md">
                    <span className="text-2xl font-bold leading-none">{product.rating_avg.toFixed(1)}</span>
                    <span className="text-[10px] uppercase font-sans mt-0.5">out of 5</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[#C9A227] mb-1 justify-center sm:justify-start">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-ink">Berdasarkan kepuasan {product.review_count} jamaah yang telah menyelesaikan ibadah.</p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    const el = document.getElementById('form-ulasan');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="outline"
                  size="sm"
                  className="font-bold border-[#DCD3C5]"
                >
                  Tulis Ulasan Anda ↓
                </Button>
              </div>

              {/* Reviews Feed List */}
              <div className="space-y-6 divide-y divide-[#F2EDE5]">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.user_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-[#DED6CC]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-ink">{rev.user_name || 'H. Ahmad Ihsan'}</span>
                              <span className="text-[10px] font-bold bg-[#EAF3EC] text-[#2F643F] px-2 py-0.5 rounded-full border border-[#C5E1CC] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Pembeli Terverifikasi</span>
                              </span>
                            </div>
                            <span className="text-[11px] text-[#968F83]">{new Date(rev.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-[#4E463E] pl-13 leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {rev.photo_urls && rev.photo_urls.length > 0 && (
                        <div className="flex gap-2 pl-13 pt-1">
                          {rev.photo_urls.map((photo, pIdx) => (
                            <img key={pIdx} src={photo} alt="Bukti review" className="w-16 h-16 object-cover rounded-lg border border-[#EDE7DE]" />
                          ))}
                        </div>
                      )}

                      {/* Admin Official Reply */}
                      {rev.admin_reply && (
                        <div className="ml-8 sm:ml-12 p-4 rounded-xl bg-[#FAF6EE] border border-[#EAE1C5] space-y-1 mt-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#8B6A52]">
                            <span>📢 Tanggapan Resmi Ust. Abi Zaki (Owner Ajak Abi Store):</span>
                          </div>
                          <p className="text-xs text-ink/90 leading-relaxed italic">
                            "{rev.admin_reply}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-[#766F63]">Belum ada ulasan untuk varian produk ini. Jadilah yang pertama memberikan masukan!</div>
                )}
              </div>

              {/* WRITE A REVIEW FORM (Section 3.2 feature verification) */}
              <div id="form-ulasan" className="p-6 sm:p-8 rounded-2xl bg-[#FAFAFC] border border-[#E5E5E8] space-y-6 pt-8 mt-12">
                <div>
                  <h3 className="font-serif font-bold text-lg text-ink">Bagikan Pengalaman Ibadah Anda Bersama Produk Ini</h3>
                  <p className="text-xs text-[#766F63] mt-1">Masukan Anda amat berharga untuk membantu calon jamaah lain menyiapkan perlengkapan manasik.</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">Rating Bintang:</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRatingInput(num)}
                          className={`p-2 rounded-lg border transition-all ${
                            ratingInput >= num ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-gray-400 border-gray-200'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      <span className="text-xs font-bold ml-2 text-ink">{ratingInput} dari 5 Bintang</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">Tulis Ulasan Kepuasan Anda:</label>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Bagaimana kenyamanan kain saat di Masjidil Haram? Apakah paket tiba tepat waktu sebelum jadwal travel?"
                      className="w-full bg-white border border-[#DCD3C5] focus:border-primary rounded-xl p-3 text-sm outline-none text-ink"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmittingReview}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="font-bold shadow-md"
                  >
                    Kirim Ulasan Sekarang
                  </Button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* CROSS-SELL RECOMMENDATION CAROUSEL */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="pt-10 border-t border-[#EDE7DE] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Rekomendasi Manasik</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Lengkapi Persiapan Perjalanan Ibadah Anda</h3>
            </div>
            <Link to="/produk" className="text-sm font-bold text-primary hover:underline hidden sm:block">
              Lihat Koleksi Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} size="standard" />
            ))}
          </div>
        </div>
      )}

      {/* MODAL PHOTO ZOOM */}
      <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} title={product.name} maxWidth="2xl">
        <div className="p-2 flex flex-col items-center">
          <img
            src={product.images[selectedImgIdx] || product.images[0]}
            alt="Zoom View"
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIdx(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${idx === selectedImgIdx ? 'border-primary' : 'border-transparent opacity-60'}`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
};
