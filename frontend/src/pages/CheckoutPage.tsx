import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Tag, MapPin, User, Mail, Phone, FileText, ArrowLeft, Check, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { ShippingRateOption } from '../types';
import { Button } from '../components/ui/Button';
import { MidtransSimulatorModal } from '../components/payment/MidtransSimulatorModal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotalWeightGrams, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = getSubtotal();
  const weightGrams = getTotalWeightGrams();

  // Form states
  const [guestEmail, setGuestEmail] = useState(user?.email || 'customer@gmail.com');
  const [recipientName, setRecipientName] = useState(user?.full_name || 'H. Ahmad Ihsan');
  const [phone, setPhone] = useState(user?.phone || '081987654321');
  const [city, setCity] = useState('Jakarta Selatan');
  const [fullAddress, setFullAddress] = useState('Jl. Pejaten Barat Raya No. 24, Kompleks Muslim Permai, Pasar Minggu');
  const [notes, setNotes] = useState('Mohon pastikan jahitan kain ihram dicek dan koper dilindungi bubble wrap ekstra.');

  // Shipping state
  const [shippingOptions, setShippingOptions] = useState<ShippingRateOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<ShippingRateOption | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  // Voucher state
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount_amount: number; message: string } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Order submission & Midtrans simulator state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Calculate Shipping Rates dynamically when City or Weight changes
  useEffect(() => {
    if (!city || items.length === 0) return;
    setIsLoadingShipping(true);
    api.calculateShipping({ destination_city: city, weight_grams: weightGrams })
      .then((res: ShippingRateOption[]) => {
        setShippingOptions(res || []);
        if (res && res.length > 0) {
          setSelectedCourier(res[0]); // default select JNE REG
        }
        setIsLoadingShipping(false);
      })
      .catch(() => {
        setIsLoadingShipping(false);
      });
  }, [city, weightGrams, items.length]);

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Tidak Ada Item untuk Di-Checkout</h2>
        <p className="text-sm text-[#766F63]">Keranjang Anda kosong. Silakan pilih produk perlengkapan terlebih dahulu.</p>
        <Button onClick={() => navigate('/produk')} variant="primary">Kembali ke Katalog</Button>
      </div>
    );
  }

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    setIsValidatingVoucher(true);
    setVoucherError('');
    try {
      const res = await api.validateVoucher({ code: voucherInput.trim(), subtotal });
      if (res.success && res.data) {
        setAppliedVoucher(res.data);
        setVoucherInput('');
      }
    } catch (err: any) {
      setVoucherError(err.response?.data?.error || 'Kode voucher tidak valid');
      setAppliedVoucher(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const shippingCost = selectedCourier ? selectedCourier.price : 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourier) {
      alert('Silakan pilih layanan kurir pengiriman terlebih dahulu!');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const payload = {
        user_id: user ? user.id : null,
        guest_email: guestEmail,
        recipient_name: recipientName,
        phone,
        city,
        full_address: fullAddress,
        shipping_courier: `${selectedCourier.courier_name} (${selectedCourier.service_name})`,
        shipping_cost: shippingCost,
        voucher_code: appliedVoucher ? appliedVoucher.code : null,
        notes,
        items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id || null,
          qty: i.qty,
        })),
      };

      const res = await api.createOrder(payload);
      if (res.success && res.data) {
        setCreatedOrder(res.data);
        setShowSimulatorModal(true);
        clearCart(); // Clear local storage cart once order is registered
      }
    } catch (err: any) {
      alert(`Gagal membuat pesanan: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSimulatorSuccess = () => {
    setShowSimulatorModal(false);
    if (createdOrder?.order?.order_number) {
      navigate(`/pesanan/${createdOrder.order.order_number}?status=success`);
    } else {
      navigate('/akun/pesanan');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#EDE7DE]">
        <div>
          <Link to="/keranjang" className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Keranjang Belanja</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">Pemeriksaan Akhir & Pembayaran (Checkout)</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs bg-[#EAF3EC] text-[#2F643F] font-semibold px-4 py-2 rounded-full border border-[#C5E1CC]">
          <ShieldCheck className="w-4 h-4" />
          <span>Keamanan Terverifikasi SSL Midtrans Snap</span>
        </div>
      </div>

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT FORM STEPPER */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: ALAMAT PENGIRIMAN */}
          <div className="bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F2EDE5]">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shrink-0">1</div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">Alamat & Kontak Penerima</h3>
                <p className="text-xs text-[#766F63]">Pastikan nomor WhatsApp aktif untuk pembaruan nomor resi dan verifikasi gudang.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">Email Jamaah / Pembeli:</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-sm text-ink outline-none"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#968F83]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">No. WhatsApp Aktif:</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-sm text-ink outline-none"
                  />
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#968F83]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">Nama Penerima Paket:</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Contoh: H. Ahmad Ihsan"
                  className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 px-3 text-sm text-ink outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block">Kota / Kabupaten Tujuan:</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 px-3 text-sm font-semibold text-ink outline-none cursor-pointer"
                >
                  <option value="Jakarta Selatan">Jakarta Selatan (Jabodetabek)</option>
                  <option value="Bandung">Kota Bandung (Jawa Barat)</option>
                  <option value="Surabaya">Kota Surabaya (Jawa Timur)</option>
                  <option value="Semarang">Kota Semarang (Jawa Tengah)</option>
                  <option value="Medan">Kota Medan (Sumatera Utara)</option>
                  <option value="Makassar">Kota Makassar (Sulawesi Selatan)</option>
                  <option value="Palembang">Kota Palembang (Sumatera Selatan)</option>
                  <option value="Denpasar">Kota Denpasar (Bali)</option>
                  <option value="Lainnya - Indonesia">Kota / Daerah Lainnya di Indonesia</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">Alamat Lengkap & Rumah/Patokan:</label>
              <textarea
                rows={3}
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Nama Jalan, RT/RW, Nomor Rumah, Kecamatan, Kelurahan, Kode Pos..."
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl p-3 text-sm text-ink outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">Catatan Tambahan untuk Gudang (Opsional):</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Titip ke satpam jika kosong, pastikan bubble wrap..."
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 px-3 text-sm text-ink outline-none"
              />
            </div>
          </div>

          {/* STEP 2: KURIR PENGIRIMAN */}
          <div className="bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EDE5]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shrink-0">2</div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-ink">Pilih Kurir Ekspedisi (Biteship API)</h3>
                  <p className="text-xs text-[#766F63]">Ongkos kirim dikalkulasi real-time berdasarkan total berat paket <strong>{weightGrams}g</strong>.</p>
                </div>
              </div>
              <Truck className="w-6 h-6 text-[#C9A227] hidden sm:block" />
            </div>

            {isLoadingShipping ? (
              <div className="p-8 text-center text-xs font-semibold text-[#766F63] animate-pulse">
                Mengalkulasi ongkir real-time ke {city}...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {shippingOptions.map((opt) => {
                  const isSelected = selectedCourier?.courier_code === opt.courier_code;
                  return (
                    <div
                      key={opt.courier_code}
                      onClick={() => setSelectedCourier(opt)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected ? 'border-primary bg-[#FAF6F2] shadow-md' : 'border-[#E2DDD4] bg-white hover:border-[#CABAAB]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-bold text-base text-ink">{opt.courier_name}</span>
                          {isSelected && <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded">Terpilih</span>}
                        </div>
                        <span className="text-xs font-semibold text-primary block">{opt.service_name}</span>
                        <span className="text-[11px] text-[#766F63] block mt-1.5">{opt.description}</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#EDE6DD] flex items-baseline justify-between">
                        <span className="text-xs font-medium text-[#766F63]">Estimasi {opt.estimated_days}</span>
                        <span className="font-bold text-base tabular-price text-ink">Rp {opt.price.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 3: VOUCHER DISKON */}
          <div className="bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F2EDE5]">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shrink-0">3</div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">Kode Voucher / Promo Keberangkatan</h3>
                <p className="text-xs text-[#766F63]">Gunakan kode promo untuk potongan langsung (Contoh: <strong className="text-[#C9A227] underline">MABRUR2026</strong> atau <strong className="text-[#C9A227] underline">HEMAT50</strong>).</p>
              </div>
            </div>

            {appliedVoucher ? (
              <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#C5E1CC] flex items-center justify-between text-xs text-[#2F643F]">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
                  <span>Voucher Aktif: [{appliedVoucher.code}] — {appliedVoucher.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedVoucher(null)}
                  className="font-bold underline text-danger hover:opacity-80"
                >
                  Lepas Voucher
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                  placeholder="Masukkan Kode Voucher (misal: MABRUR2026)"
                  className="flex-1 bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl px-4 py-2.5 text-sm uppercase font-bold tracking-wider text-ink outline-none"
                />
                <Button
                  type="button"
                  onClick={handleApplyVoucher}
                  isLoading={isValidatingVoucher}
                  variant="outline"
                  className="px-6 font-extrabold border-[#CABAAB]"
                >
                  Terapkan
                </Button>
              </div>
            )}

            {voucherError && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-danger pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{voucherError}</span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SUMMARY & SUBMISSION BUTTON */}
        <div className="lg:col-span-5 bg-[#FAFAF8] border border-[#DCD3C5] rounded-card p-6 shadow-xl sticky top-24 space-y-6">
          <h3 className="font-serif font-bold text-xl text-ink pb-4 border-b border-[#EDE6DC]">
            Ringkasan Tagihan Akhir
          </h3>

          {/* Items Mini List */}
          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2 divide-y divide-[#F2EDE5]">
            {items.map((item) => {
              const itemPrice = (item.product.discount_price ?? item.product.base_price) + (item.variant?.price_adjustment || 0);
              return (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate pr-3">
                    <span className="font-extrabold text-primary px-2 py-0.5 rounded bg-[#EDE7DD]">{item.qty}x</span>
                    <span className="font-semibold text-ink truncate">{item.product.name} {item.variant ? `(${item.variant.variant_value})` : ''}</span>
                  </div>
                  <span className="font-bold tabular-price text-ink shrink-0">
                    Rp {(itemPrice * item.qty).toLocaleString('id-ID')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-3 pt-4 border-t border-[#EDE6DC] text-sm">
            <div className="flex items-center justify-between text-[#59534A]">
              <span>Subtotal Produk ({items.reduce((sum, i) => sum + i.qty, 0)} Unit):</span>
              <span className="font-bold text-ink tabular-price">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex items-center justify-between text-[#59534A]">
              <span>Ongkos Kirim ({selectedCourier ? selectedCourier.courier_name : 'Belum pilih'}):</span>
              <span className="font-bold text-ink tabular-price">Rp {shippingCost.toLocaleString('id-ID')}</span>
            </div>

            {appliedVoucher && (
              <div className="flex items-center justify-between text-[#2F643F] font-semibold bg-green-50 p-2 rounded-lg border border-green-200">
                <span className="flex items-center gap-1">🏷️ Potongan Diskon [{appliedVoucher.code}]:</span>
                <span className="font-extrabold tabular-price">- Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#EDE6DC] flex items-baseline justify-between">
              <span className="font-serif font-bold text-lg text-ink">Total Pembayaran:</span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-primary tabular-price">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Submit */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isSubmittingOrder}
              className="py-4 text-base font-extrabold shadow-xl bg-[#6B4F3B] hover:bg-[#4A3527] text-white"
            >
              🔒 Buat Pesanan & Bayar (Midtrans Snap) →
            </Button>
            
            <p className="text-[11px] text-center text-[#827A6E] leading-relaxed">
              Dengan menekan tombol di atas, invoice pesanan #AAS akan diterbitkan dan jendela simulasi Sandbox Midtrans akan otomatis dimuat.
            </p>
          </div>

          {/* Payment guarantees */}
          <div className="pt-4 border-t border-[#EDE6DC] flex items-center justify-center gap-2 text-xs text-[#766F63]">
            <span>Didukung:</span>
            <span className="font-bold text-ink bg-white px-2 py-1 rounded border">Mandiri VA</span>
            <span className="font-bold text-ink bg-white px-2 py-1 rounded border">BCA VA</span>
            <span className="font-bold text-ink bg-white px-2 py-1 rounded border">QRIS / GoPay</span>
          </div>

        </div>

      </form>

      {/* MIDTRANS SNAP SANDBOX INTERACTIVE SIMULATOR MODAL */}
      <MidtransSimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => { setShowSimulatorModal(false); handleSimulatorSuccess(); }}
        orderNumber={createdOrder?.order?.order_number || '#AAS-NEW'}
        totalAmount={grandTotal}
        snapToken={createdOrder?.snap_token}
        onSuccess={handleSimulatorSuccess}
      />

    </div>
  );
};
