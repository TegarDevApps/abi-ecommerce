import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Truck, Package, Clock, AlertCircle, Printer, ArrowLeft, RefreshCw, ShieldCheck, PhoneCall, Sparkles, MapPin } from 'lucide-react';
import { api, subscribeRealtimeNotifications } from '../lib/api';
import { Order } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MidtransSimulatorModal } from '../components/payment/MidtransSimulatorModal';

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  const fetchOrder = () => {
    if (!orderNumber) return;
    setIsLoading(true);
    api.getOrder(orderNumber)
      .then((res) => {
        setOrder(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrder();
    if (searchParams.get('status') === 'success') {
      setRealtimeNotice('Pembayaran Sandbox terverifikasi! Status pesanan Anda sekarang DIPROSES gudang.');
      setTimeout(() => setRealtimeNotice(null), 8000);
    }
  }, [orderNumber]);

  // Subscribe to Real-Time WebSocket Updates
  useEffect(() => {
    const unsubscribe = subscribeRealtimeNotifications((evt) => {
      if (evt.type === 'ORDER_STATUS_UPDATE' && evt.data) {
        if (order && (evt.data.order_id === order.id || evt.data.order_number === order.order_number || evt.data.order_number === orderNumber)) {
          setOrder((prev) => prev ? { ...prev, order_status: evt.data.status, tracking_number: evt.data.tracking_number || prev.tracking_number, payment_status: evt.data.status !== 'menunggu_pembayaran' ? 'paid' : prev.payment_status } : null);
          setRealtimeNotice(`⚡ [Live WebSockets Notice]: ${evt.message || `Status diperbarui menjadi ${evt.data.status.toUpperCase()}`}`);
          setTimeout(() => setRealtimeNotice(null), 9000);
        }
      }
    });

    return () => unsubscribe();
  }, [order, orderNumber]);

  if (isLoading) {
    return <div className="py-28 text-center text-sm font-medium text-[#766F63]">Mengambil status pelacakan resi real-time...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FAF6EE] text-[#9A7D18] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">⚠️</div>
        <h2 className="font-serif text-2xl font-bold text-ink">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm text-[#766F63]">Nomor pesanan atau invoice <strong>{orderNumber}</strong> belum tercatat di dalam sistem database kami.</p>
        <Button onClick={() => navigate('/akun/pesanan')} variant="primary">Lihat Semua Daftar Pesanan Saya</Button>
      </div>
    );
  }

  const steps = [
    { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran', icon: Clock, desc: 'Invoice Snap Sandbox' },
    { key: 'diproses', label: 'Pembayaran Terverifikasi & Diproses', icon: CheckCircle2, desc: 'Dana Masuk & Dalam Antrean' },
    { key: 'dikemas', label: 'Dikemas Oleh Gudang', icon: Package, desc: 'Sertifikasi & Packing Extra' },
    { key: 'dikirim', label: 'Dikirim Kurir Ekspedisi', icon: Truck, desc: order.tracking_number ? `Resi: ${order.tracking_number}` : `${order.shipping_courier}` },
    { key: 'selesai', label: 'Pesanan Selesai / Tiba', icon: ShieldCheck, desc: 'Ibadah Mabrur & Nyaman' },
  ];

  const statusMap: Record<string, number> = {
    menunggu_pembayaran: 0,
    diproses: 1,
    dikemas: 2,
    dikirim: 3,
    selesai: 4,
    dibatalkan: -1,
  };
  const currentStepIdx = statusMap[order.order_status] ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      
      {/* Real-time WebSocket Alert Banner */}
      {realtimeNotice && (
        <div className="p-4 rounded-2xl bg-[#EAF3EC] border-2 border-[#3E7B4F] text-[#2F643F] shadow-lg flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-green-600 shrink-0 animate-spin" />
            <span>{realtimeNotice}</span>
          </div>
          <button onClick={() => setRealtimeNotice(null)} className="text-xs font-bold px-2 py-1 hover:bg-black/5 rounded">✕</button>
        </div>
      )}

      {/* Top Bar Navigation & Invoice Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EDE7DE] gap-4">
        <div>
          <button onClick={() => navigate('/akun/pesanan')} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Daftar Pesanan & Riwayat Belanja</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">Invoice: {order.order_number}</h1>
            <span className="text-xs font-bold bg-[#FAF6EE] text-[#9A7D18] px-3 py-1 rounded-full border border-[#ECE3C8]">
              {new Date(order.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => window.print()} variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
            Cetak Invoice (PDF)
          </Button>
          {order.order_status === 'menunggu_pembayaran' && (
            <Button onClick={() => setShowSimulatorModal(true)} variant="gold" size="sm" className="font-extrabold shadow">
              💳 Simulasikan Bayar (Sandbox)
            </Button>
          )}
        </div>
      </div>

      {/* VISUAL ORDER STATUS TIMELINE STEPPER (Section 5.4) */}
      <div className="bg-white border border-[#EBE3D8] rounded-card p-6 sm:p-8 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-ink mb-6 pb-3 border-b border-[#F2EDE5] flex items-center justify-between">
          <span>Status Pelacakan Pesanan Real-Time: <strong className="text-primary uppercase">{order.order_status.replace(/_/g, ' ')}</strong></span>
          <span className="text-xs text-[#766F63] font-normal flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Pemantauan otomatis via WebSockets
          </span>
        </h3>

        {order.order_status === 'dibatalkan' ? (
          <div className="p-6 text-center bg-danger/10 text-danger font-bold rounded-2xl">
            Pesanan ini telah dibatalkan oleh sistem atau pelanggan. Dana yang masuk telah masuk antrean pengembalian (refund).
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div key={step.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-md shrink-0 ${
                    isCurrent ? 'bg-[#C9A227] text-white scale-110 ring-4 ring-[#F9F3DF]' :
                    isDone ? 'bg-[#3E7B4F] text-white' : 'bg-[#E5DFD5] text-[#968E82]'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-[#9A7D18]' : isDone ? 'text-ink' : 'text-[#8C8377]'}`}>
                      {step.label}
                    </span>
                    <span className="text-[11px] text-[#766F63] mt-0.5">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tracking number display banner if shipped */}
        {order.tracking_number && (
          <div className="mt-8 p-4 rounded-xl bg-[#FAF8F5] border border-[#DCD3C5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <span className="text-xs font-bold text-ink block">Nomor Resi Ekspedisi ({order.shipping_courier}):</span>
                <span className="font-mono text-lg font-black text-primary tracking-wider">{order.tracking_number}</span>
              </div>
            </div>
            <a
              href={`https://cekresi.com/?noresi=${order.tracking_number}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white border border-[#DCD3C5] hover:bg-[#EFEAE2] text-ink text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Lacak Resi Eksteral (CekResi) →
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT ORDER ITEMS */}
        <div className="lg:col-span-7 bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-ink pb-3 border-b border-[#F2EDE5]">
            Daftar Perlengkapan Terbeli ({order.items?.length || 0} Varian)
          </h3>

          <div className="divide-y divide-[#F2EDE5]">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-ink line-clamp-1">{item.product_name_snapshot}</span>
                  <span className="text-xs text-[#766F63]">Jumlah: <strong>{item.qty} Unit</strong> (@ Rp {item.price_snapshot.toLocaleString('id-ID')})</span>
                </div>
                <span className="font-bold text-sm tabular-price text-ink shrink-0">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SHIPPING & INVOICE TOTALS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#FAFAF8] border border-[#DCD3C5] rounded-card p-6 shadow-md space-y-4">
            <h3 className="font-serif font-bold text-lg text-ink pb-3 border-b border-[#EDE6DC]">
              Rincian Pembayaran & Alamat
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#59534A]">
                <span>Metode Pembayaran:</span>
                <span className="font-bold text-ink">{order.payment_method}</span>
              </div>
              <div className="flex items-center justify-between text-[#59534A]">
                <span>Status Pembayaran:</span>
                <Badge variant={order.payment_status === 'paid' ? 'success' : 'terracotta'} size="sm">
                  {order.payment_status === 'paid' ? '✔ Lunas Terverifikasi' : 'Menunggu Konfirmasi'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[#59534A]">
                <span>Subtotal Produk:</span>
                <span className="font-bold text-ink tabular-price">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-[#59534A]">
                <span>Ongkir ({order.shipping_courier}):</span>
                <span className="font-bold text-ink tabular-price">Rp {order.shipping_cost.toLocaleString('id-ID')}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between text-[#2F643F] font-bold">
                  <span>Diskon Voucher Promo:</span>
                  <span className="tabular-price">- Rp {order.discount_amount.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#EDE6DC] flex items-baseline justify-between">
              <span className="font-serif font-bold text-base text-ink">Total Dibayarkan:</span>
              <span className="font-serif text-2xl font-extrabold text-primary tabular-price">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="pt-3 border-t border-[#EDE6DC] space-y-2 text-xs text-[#59534A]">
              <span className="font-bold text-ink block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Alamat Pengiriman Jamaah:</span>
              </span>
              <div className="p-3 bg-white rounded-xl border border-[#EDE6DC] space-y-1">
                <p className="font-bold text-ink">{order.address_snapshot.recipient_name} ({order.address_snapshot.phone})</p>
                <p className="text-[#766F63] leading-relaxed">{order.address_snapshot.full_address}, Kota {order.address_snapshot.city}</p>
                {order.notes && <p className="text-[11px] text-[#8B6A52] italic pt-1 border-t border-[#F2EDE5] mt-1">Catatan: {order.notes}</p>}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-white border border-[#DCD3C5] hover:bg-[#FAF6EE] text-[#6B4F3B] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Hubungi CS WhatsApp Jika Perlu Retur / Tukar</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL SIMULATION FOR RE-TESTING */}
      <MidtransSimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => { setShowSimulatorModal(false); fetchOrder(); }}
        orderNumber={order.order_number}
        totalAmount={order.total}
        onSuccess={() => { setShowSimulatorModal(false); fetchOrder(); }}
      />

    </div>
  );
};
