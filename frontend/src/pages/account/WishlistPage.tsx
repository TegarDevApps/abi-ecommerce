import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { ProductCard } from '../../components/ui/ProductCard';
import { Button } from '../../components/ui/Button';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddAllToCart = () => {
    if (items.length === 0) return;
    items.forEach((prod) => {
      addItem(prod, prod.variants?.[0], 1);
    });
    alert(`🎉 Berhasil memindahkan ${items.length} produk favorit Anda ke dalam Keranjang Belanja!`);
    navigate('/keranjang');
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] py-16 text-[#1F1B16] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl border border-[#D8D0C5] p-10 sm:p-14 text-center shadow-md space-y-6">
            <div className="w-20 h-20 bg-[#FDF4E7] text-[#C45E38] rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37] shadow-inner">
              <Heart className="w-10 h-10 fill-current" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1F1B16] tracking-tight">
                Wishlist Favorit Masih Kosong
              </h1>
              <p className="text-sm text-[#726B5B] max-w-md mx-auto mt-2.5 leading-relaxed font-sans">
                Anda belum menandai perlengkapan ibadah apa pun. Klik ikon hati <Heart className="w-3.5 h-3.5 inline text-[#C45E38] fill-[#C45E38]" /> pada kartu produk di etalase kami untuk menyiapkannya sebelum keberangkatan ke Tanah Suci.
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={() => navigate('/produk')}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5 text-[#D4AF37]" />}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold shadow-lg"
              >
                Jelajahi Koleksi Eksklusif Ajak Abi
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-[80vh] py-10 sm:py-16 text-[#1F1B16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Bar with Precision Alignment */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b-2 border-[#D8D0C5] mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#EFECE6] border border-[#D8D0C5] text-xs font-serif font-bold text-[#C45E38] rounded-full uppercase tracking-wider mb-3 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-[#C45E38]" /> Daftar Perlengkapan Pilihan Saya
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1F1B16] tracking-tight">
              Wishlist Favorit Anda (<span className="text-[#C45E38]">{items.length} Item</span>)
            </h1>
            <p className="text-sm text-[#726B5B] mt-1.5 font-sans max-w-2xl leading-relaxed">
              Prioritaskan perlengkapan manasik, ihram organik, dan kebutuhan keberangkatan Anda. Semua harga tertera berlaku real-time dari database Ajak Abi Store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C241D] hover:bg-[#3E332B] text-[#EDE7DE] text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Tambah Semua ke Keranjang</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengosongkan seluruh daftar wishlist ini?')) {
                  clearWishlist();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F9EDE8] border border-[#E9C3B1] text-[#C45E38] hover:bg-[#F2D7CD] text-xs sm:text-sm font-semibold transition-all shadow-xs"
              title="Hapus Seluruh Wishlist"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kosongkan Wishlist</span>
            </button>
          </div>
        </div>

        {/* High-Precision Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((prod) => (
            <ProductCard key={prod.id} product={prod} size="standard" />
          ))}
        </div>

        {/* Bottom Assurance Note */}
        <div className="mt-16 p-6 rounded-2xl bg-[#EFECE6] border border-[#D8D0C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#726B5B] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2C241D] text-[#D4AF37] rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-[#1F1B16]">Garansi Ketersediaan & Kualitas Premium</p>
              <p className="mt-0.5">Seluruh barang dalam wishlist Anda dijaga mutunya oleh garansi asuransi pengiriman Ajak Abi Shield.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-4 h-4" /> Stok Terhubung Live Supabase DB
          </div>
        </div>

      </div>
    </div>
  );
};
