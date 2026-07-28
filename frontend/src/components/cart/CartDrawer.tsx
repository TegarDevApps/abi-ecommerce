import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, closeDrawer, items, updateQty, removeItem, getSubtotal, getTotalCount } = useCartStore();
  
  const subtotal = getSubtotal();
  const count = getTotalCount();

  if (!isOpen) return null;

  const handleGoToCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleGoToCatalog = () => {
    closeDrawer();
    navigate('/produk');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      {/* Slide-in Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFAF8] shadow-2xl flex flex-col justify-between border-l border-[#EBE3D8] transform transition-transform duration-300 ease-in-out">
          
          {/* Top Header */}
          <div className="p-5 border-b border-[#EDE7DE] bg-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#F5EFEA] rounded-lg text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">Keranjang Belanja</h3>
                <p className="text-xs text-[#766F63] font-medium">
                  {count > 0 ? `${count} Item perlengkapan terpilih` : 'Keranjang Anda masih kosong'}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-[#766F63] hover:text-ink hover:bg-[#F5F0EA] rounded-full transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <div className="w-20 h-20 bg-[#F5EFEA] rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
                  <ShoppingBag className="w-10 h-10 opacity-70" />
                </div>
                <h4 className="font-serif text-lg font-bold text-ink mb-2">Keranjang Belanja Kosong</h4>
                <p className="text-sm text-[#766F63] max-w-xs mb-6 leading-relaxed">
                  Anda belum menambahkan perlengkapan Umrah maupun Haji ke dalam keranjang.
                </p>
                <Button onClick={handleGoToCatalog} variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Jelajahi Koleksi Eksklusif
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = (item.product.discount_price ?? item.product.base_price) + (item.variant?.price_adjustment || 0);
                
                return (
                  <div key={item.id} className="flex gap-3.5 p-3.5 bg-white rounded-card border border-[#EFECE6] shadow-sm hover:shadow-md transition-shadow">
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=300&auto=format&fit=crop'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover object-center rounded-lg border border-[#F2EDE5] shrink-0 bg-[#F7F5F0]"
                    />

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-sm text-ink line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#968F83] hover:text-danger p-1 -mr-1 transition-colors"
                            aria-label="Hapus item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.variant && (
                          <span className="inline-block text-xs text-primary font-medium bg-[#F5EFEA] px-2 py-0.5 rounded mt-1">
                            {item.variant.variant_name}: {item.variant.variant_value}
                          </span>
                        )}
                      </div>

                      {/* Price & Stepper */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F5F2ED]">
                        <span className="font-bold text-sm tabular-price text-ink">
                          Rp {(itemPrice * item.qty).toLocaleString('id-ID')}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#DED6CC] rounded-lg overflow-hidden bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="p-1 px-2 hover:bg-[#EDE6DA] text-ink transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-price select-none text-ink">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="p-1 px-2 hover:bg-[#EDE6DA] text-ink transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Sticky Checkout Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EAE3D8] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)] space-y-3.5">
              {/* Trust message */}
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#F3F6F2] text-[#3E7B4F] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Garansi 100% Produk Original & Sesuai Syariat</span>
              </div>

              {/* Subtotal summary */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-sm text-[#766F63]">
                  <span>Subtotal ({count} Item):</span>
                  <span className="font-bold text-ink tabular-price text-base">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[11px] text-[#766F63] italic">
                  *Ongkos kirim dan diskon promo dihitung pada tahap checkout.
                </p>
              </div>

              {/* Action CTA */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  variant="outline"
                  onClick={() => { closeDrawer(); navigate('/keranjang'); }}
                  className="text-xs"
                >
                  Lihat Keranjang
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGoToCheckout}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs shadow-md font-bold"
                >
                  Checkout Sekarang
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
