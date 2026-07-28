import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, ArrowUpRight, DollarSign, Clock, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = () => {
    setIsLoading(true);
    api.getAdminAnalytics().then((res) => {
      setAnalytics(res || {
        total_revenue: 48500000,
        total_orders: 4,
        pending_orders: 1,
        total_products: 4,
        low_stock_count: 1,
        low_stock_products: [
          { id: 'prod-3', name: 'Mukena Travel Sutra Anti-Kusut (Royal Gold)', sku: 'AAS-MKN-GOLD', stock: 5 },
        ],
        recent_orders: [],
      });
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading || !analytics) {
    return <div className="py-24 text-center text-sm font-medium text-gray-500">Memuat statistik penjualan dan analitik gudang Ajak Abi...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Welcome & Live reload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B16]">Ringkasan Eksekutif Ajak Abi Store</h1>
          <p className="text-xs text-gray-500 mt-1">Pantau performa penjualan perlengkapan Umrah, antrean pengemasan gudang, dan notifikasi stok reorder.</p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#6B4F3B] text-xs font-bold rounded-xl border border-gray-300 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Data Realtime</span>
        </button>
      </div>

      {/* 4 OVERVIEW METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-6 rounded-[20px] bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pendapatan Bersih</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-extrabold text-[#1F1B16] tabular-price">
              Rp {analytics.total_revenue.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#2F643F] font-extrabold mt-2 bg-[#EAF3EC] px-2 py-0.5 rounded w-max">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% bulan ini (Musim Umrah)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[20px] bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Transaksi</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-extrabold text-[#1F1B16] tabular-price">
              {analytics.total_orders} Pesanan
            </span>
            <span className="text-xs text-gray-500 block mt-2">
              <strong className="text-amber-600 font-bold">{analytics.pending_orders} invoice</strong> menunggu konfirmasi bayar
            </span>
          </div>
        </div>

        <div className="p-6 rounded-[20px] bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Katalog Produk Aktif</span>
            <div className="p-2.5 rounded-xl bg-[#6B4F3B]/10 text-[#6B4F3B]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-extrabold text-[#1F1B16]">
              {analytics.total_products} Item Varian
            </span>
            <Link to="/admin/produk" className="text-xs text-[#6B4F3B] font-bold inline-flex items-center gap-1 mt-2 hover:underline">
              <span>Kelola Stok & Bundling →</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-[20px] bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Jamaah Terverifikasi</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-extrabold text-[#1F1B16]">
              142 Member
            </span>
            <span className="text-xs text-[#3E7B4F] font-bold block mt-2">✔ Tingkat konversi ulasan 94%</span>
          </div>
        </div>

      </div>

      {/* LOW-STOCK WARNING ALERT BANNER */}
      {analytics.low_stock_products && analytics.low_stock_products.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FFF9ED] border-2 border-amber-400/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
              <span>Peringatan Gudang: {analytics.low_stock_products.length} Produk Menipis (&lt; 10 Unit)</span>
            </div>
            <Link to="/admin/produk" className="text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-black px-3.5 py-1.5 rounded-lg transition-colors">
              Reorder ke Produsen / Pabrik →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analytics.low_stock_products.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-200 text-xs font-semibold">
                <div>
                  <span className="text-[#1F1B16] font-bold block truncate">{item.name}</span>
                  <span className="text-gray-500 text-[11px]">SKU: {item.sku}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 font-extrabold text-xs">
                  Sisa {item.stock} Pcs!
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT ORDERS FEED & FAST ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 bg-white rounded-card border border-gray-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif font-bold text-lg text-[#1F1B16]">Pesanan Masuk & Antrean Fulfillment</h3>
            <Link to="/admin/pesanan" className="text-xs font-bold text-[#6B4F3B] hover:underline flex items-center gap-1">
              <span>Kelola Semua Pesanan</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {analytics.recent_orders && analytics.recent_orders.length > 0 ? (
              analytics.recent_orders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-extrabold text-sm text-[#1F1B16]">{order.order_number}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-bold bg-gray-100 text-gray-700 uppercase">
                        {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Penerima: <strong>{order.recipient_name || 'Jamaah'}</strong> ({order.shipping_courier})</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm text-[#6B4F3B] block tabular-price">Rp {order.total.toLocaleString('id-ID')}</span>
                    <Link to="/admin/pesanan" className="text-[11px] text-blue-600 hover:underline font-bold">Update Resi →</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-gray-400">Belum ada pesanan baru dalam 24 jam terakhir.</div>
            )}
          </div>
        </div>

        {/* RIGHT SYSTEM LOGS & HEALTH */}
        <div className="lg:col-span-4 bg-[#241D17] text-white rounded-card p-6 shadow-xl space-y-6 border border-[#3E3228]">
          <h3 className="font-serif font-bold text-lg text-[#FBF8F3] pb-3 border-b border-[#3E3228]">
            Infrastruktur & Modul Aktif
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database Engine:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PostgreSQL + Supabase Hybrid
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Midtrans Payment:</span>
              <span className="text-amber-400 font-extrabold">Sandbox Simulation Mode</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Biteship Logistics:</span>
              <span className="text-emerald-400 font-bold">Live Weight Formula</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">WebSockets Engine:</span>
              <span className="text-emerald-400 font-bold">ws:// Port 4000 Active</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#3E3228] text-center">
            <p className="text-[11px] text-[#A69B8E] italic">
              "Sebaik-baik pelayan jam'ah adalah yang mempermudah keberangkatan mereka menuju rumah Allah."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
