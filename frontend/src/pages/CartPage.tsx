import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, getSubtotal, getTotalWeightGrams } = useCartStore();

  const subtotal = getSubtotal();
  const totalWeight = getTotalWeightGrams();
  const weightKg = Math.max(1, Math.ceil(totalWeight / 1000));

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-24 h-24 bg-[#FAF6F0] text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12 opacity-70" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink">Keranjang Belanja Kosong</h1>
        <p className="text-sm text-[#766F63] max-w-md mx-auto leading-relaxed">
          Belum ada produk perlengkapan Umrah atau Haji di dalam keranjang Anda. Persiapkan keberangkatan Anda jauh hari agar ibadah lebih khusyuk.
        </p>
        <div className="pt-2">
          <Button onClick={() => navigate('/produk')} variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Jelajahi Katalog Perlengkapan Umrah
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Title Header */}
      <div className="border-b border-[#EDE7DE] pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">Keranjang Belanja Anda</h1>
          <p className="text-xs sm:text-sm text-[#766F63] mt-1">Periksa kembali kesesuaian kuota, berat pengiriman kargo, dan ukuran pakaian ihram Anda.</p>
        </div>
        <span className="text-sm font-bold text-primary bg-[#FAF8F5] border border-[#EBE3D8] px-4 py-2 rounded-full hidden sm:block">
          Total Berat Paket: {totalWeight} Gram ({weightKg} Kg)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ITEMS LIST */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const price = (item.product.discount_price ?? item.product.base_price) + (item.variant?.price_adjustment || 0);
            return (
              <div key={item.id} className="bg-white border border-[#EBE3D8] rounded-card p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-center justify-between">
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=300'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-[#EDE7DE] shrink-0 bg-[#F7F5F0]"
                  />
                  <div className="flex flex-col min-w-0">
                    <Link to={`/produk/${item.product.slug}`} className="font-serif font-bold text-base text-ink hover:text-primary transition-colors line-clamp-2">
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-[#827A6E] mt-0.5">{item.product.brand || 'Ajak Abi Signature'} • Berat: {item.product.weight_grams * item.qty}g</span>
                    
                    {item.variant && (
                      <span className="inline-block text-xs font-bold text-primary bg-[#FAF6F0] border border-[#E8DDCF] px-2.5 py-0.5 rounded w-max mt-2">
                        {item.variant.variant_name}: {item.variant.variant_value}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-[#F2EDE5]">
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-xs text-[#827A6E] sm:hidden">Subtotal Item:</span>
                    <span className="font-bold text-lg text-ink tabular-price">
                      Rp {(price * item.qty).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-[#968F83]">(@ Rp {price.toLocaleString('id-ID')})</span>
                  </div>

                  {/* Stepper controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#DCD3C5] rounded-xl overflow-hidden bg-[#FAF8F5]">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 hover:bg-[#EDE6DE] text-ink font-bold transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold tabular-price select-none text-ink">
                        {item.qty}
                      </span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 hover:bg-[#EDE6DE] text-ink font-bold transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#968F83] hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
                      aria-label="Hapus dari keranjang"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT ORDER SUMMARY */}
        <div className="lg:col-span-4 bg-[#FAFAF8] border border-[#DCD3C5] rounded-card p-6 shadow-md sticky top-24 space-y-6">
          <h3 className="font-serif font-bold text-xl text-ink pb-4 border-b border-[#EDE6DC]">
            Ringkasan Keranjang
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#59534A]">
              <span>Total Harga ({items.reduce((acc, i) => acc + i.qty, 0)} Item):</span>
              <span className="font-bold text-ink tabular-price">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between text-[#59534A]">
              <span>Estimasi Berat Paket:</span>
              <span className="font-semibold text-ink">{weightKg} Kilogram ({totalWeight}g)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DCC0] flex items-start gap-2.5 text-xs text-[#8B6A52]">
            <Sparkles className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
            <span>Kode voucher promo dan pilihan layanan kurir ekspedisi akan dipilih pada halaman berikutnya (Checkout).</span>
          </div>

          <div className="pt-4 border-t border-[#EDE6DC] space-y-4">
            <div className="flex items-center justify-between font-bold text-lg text-ink">
              <span>Total Estimasi:</span>
              <span className="text-xl text-primary tabular-price font-extrabold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="shadow-xl"
            >
              Lanjut Ke Pembayaran (Checkout)
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#3E7B4F] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Garansi Aman & Disertifikasi Bank Indonesia</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
