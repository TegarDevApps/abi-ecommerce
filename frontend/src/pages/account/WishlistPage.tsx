import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { ProductCard } from '../../components/ui/ProductCard';
import { Button } from '../../components/ui/Button';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-card border border-[#EDE7DE] p-12 text-center space-y-4 my-4">
        <div className="w-16 h-16 bg-[#FAF6EE] text-[#C9A227] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h3 className="font-serif font-bold text-xl text-ink">Wishlist Favorit Masih Kosong</h3>
        <p className="text-sm text-[#766F63] max-w-md mx-auto">
          Anda belum menandai produk favorit apa pun. Klik ikon hati pada kartu produk atau halaman detail untuk menyiapkannya sebelum keberangkatan.
        </p>
        <Button onClick={() => navigate('/produk')} variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Lihat Katalog Koleksi Umrah
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#EDE7DE]">
        <div>
          <h3 className="font-serif font-bold text-xl text-ink">Produk Wishlist Pilihan Anda ({items.length} Item)</h3>
          <p className="text-xs text-[#766F63]">Daftar perlengkapan manasik dan keberangkatan yang Anda prioritaskan.</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-danger flex items-center gap-1.5 hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Kosongkan Semua Wishlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((prod) => (
          <ProductCard key={prod.id} product={prod} size="standard" />
        ))}
      </div>
    </div>
  );
};
