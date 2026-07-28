import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const OrdersHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    api.getAccountOrders(user?.email)
      .then((res) => {
        setOrders(res || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return <Badge variant="terracotta">⏳ Menunggu Pembayaran</Badge>;
      case 'diproses':
        return <Badge variant="gold">⚡ Sedang Diproses</Badge>;
      case 'dikemas':
        return <Badge variant="primary">📦 Dikemas Gudang</Badge>;
      case 'dikirim':
        return <Badge variant="sage">🚚 Dalam Pengiriman Ekspedisi</Badge>;
      case 'selesai':
        return <Badge variant="success">✔ Selesai (Tiba di Tujuan)</Badge>;
      case 'dibatalkan':
        return <Badge variant="muted">✕ Dibatalkan</Badge>;
      default:
        return <Badge variant="primary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-[#766F63]">Mengambil riwayat pemesanan dari database...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-card border border-[#EDE7DE] p-12 text-center space-y-4 my-4">
        <div className="w-16 h-16 bg-[#FAF6EE] text-[#9A7D18] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">🛒</div>
        <h3 className="font-serif font-bold text-xl text-ink">Belum Ada Riwayat Pesanan</h3>
        <p className="text-sm text-[#766F63] max-w-md mx-auto">
          Anda belum pernah melakukan pemesanan di Ajak Abi Store. Persiapkan kebutuhan ibadah Anda dengan kenyamanan maksimal.
        </p>
        <Button onClick={() => navigate('/produk')} variant="primary">Jelajahi Koleksi Umrah Eksklusif</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE7DE]">
        <h3 className="font-serif font-bold text-xl text-ink">Riwayat Pesanan Saya ({orders.length} Invoice)</h3>
        <button onClick={fetchOrders} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Status</span>
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2EDE5]">
              <div className="flex items-center gap-3">
                <span className="font-serif font-extrabold text-lg text-ink tracking-tight">{o.order_number}</span>
                <span className="text-xs text-[#827A6E] font-medium">
                  {new Date(o.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </span>
              </div>
              <div>{getStatusBadge(o.order_status)}</div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-ink font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                  <span>{o.items && o.items.length > 0 ? `${o.items[0].product_name_snapshot} ${o.items.length > 1 ? `(+${o.items.length - 1} produk lainnya)` : ''}` : 'Perlengkapan Umrah Ajak Abi'}</span>
                </p>
                <p className="text-xs text-[#766F63]">Kurir Ekspedisi: <strong>{o.shipping_courier}</strong> {o.tracking_number ? `• Resi: ${o.tracking_number}` : ''}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-0 border-[#F2EDE5]">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#827A6E] block">Total Pembayaran:</span>
                  <span className="font-bold text-base tabular-price text-primary">Rp {o.total.toLocaleString('id-ID')}</span>
                </div>
                <Button
                  onClick={() => navigate(`/pesanan/${o.order_number || o.id}`)}
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold border-[#DCD3C5] bg-[#FAF8F5] hover:bg-primary hover:text-white"
                >
                  Lacak Resi & Detail
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
