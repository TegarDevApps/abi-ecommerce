import React, { useEffect, useState } from 'react';
import { Truck, Search, Eye, Printer, CheckCircle, Package, Clock, ShieldCheck, RefreshCw, Send } from 'lucide-react';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tracking Resi Modal
  const [resiModalOpen, setResiModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [resiInput, setResiInput] = useState('');
  const [isSavingResi, setIsSavingResi] = useState(false);

  // Print Label Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    setIsLoading(true);
    api.getAdminOrders().then((res) => {
      setOrders(res || []);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.client.put(`/admin/orders/${orderId}/status`, { order_status: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: newStatus as any } : o));
      alert(`Status pesanan berhasil diperbarui menjadi "${newStatus.toUpperCase()}" dan notifikasi WebSockets disiarkan ke pelanggan!`);
    } catch (err) {
      alert('Gagal memperbarui status pesanan.');
    }
  };

  const handleSaveResi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder || !resiInput.trim()) return;
    setIsSavingResi(true);
    try {
      await api.client.put(`/admin/orders/${targetOrder.id}/status`, {
        order_status: 'dikirim',
        tracking_number: resiInput.trim(),
      });
      setOrders((prev) => prev.map((o) => o.id === targetOrder.id ? { ...o, order_status: 'dikirim', tracking_number: resiInput.trim() } : o));
      setIsSavingResi(false);
      setResiModalOpen(false);
      alert('Nomor resi ekspedisi berhasil disimpan & status otomatis berubah menjadi DIKIRIM!');
    } catch (err) {
      alert('Gagal menyimpan nomor resi.');
      setIsSavingResi(false);
    }
  };

  const openResiDialog = (o: Order) => {
    setTargetOrder(o);
    setResiInput(o.tracking_number || `JNE-${Math.floor(100000000 + Math.random() * 900000000)}`);
    setResiModalOpen(true);
  };

  const openPrintLabel = (o: Order) => {
    setPrintOrder(o);
    setPrintModalOpen(true);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.address_snapshot?.recipient_name?.toLowerCase().includes(q) ||
        o.address_snapshot?.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu_pembayaran': return <Badge variant="terracotta">Menunggu Bayar</Badge>;
      case 'diproses': return <Badge variant="gold">Sedang Diproses</Badge>;
      case 'dikemas': return <Badge variant="primary">Dikemas Gudang</Badge>;
      case 'dikirim': return <Badge variant="sage">Dikirim (Resi Ada)</Badge>;
      case 'selesai': return <Badge variant="success">Selesai Tiba</Badge>;
      default: return <Badge variant="muted">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B16]">Antrean Fulfillment & Pengiriman Pesanan</h1>
          <p className="text-xs text-gray-500 mt-1">Kelola progres pengemasan perlengkapan, masukkan nomor resi Biteship/JNE, dan cetak thermal label.</p>
        </div>
        
        <button onClick={fetchOrders} className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-xs hover:bg-gray-50 text-[#6B4F3B]">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Perbarui Antrean</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-card border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'all', label: 'Semua Pesanan' },
            { id: 'menunggu_pembayaran', label: '⏳ Belum Bayar' },
            { id: 'diproses', label: '⚡ Diproses' },
            { id: 'dikemas', label: '📦 Dikemas' },
            { id: 'dikirim', label: '🚚 Dikirim (Resi)' },
            { id: 'selesai', label: '✔ Selesai' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === t.id ? 'bg-[#6B4F3B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label} ({t.id === 'all' ? orders.length : orders.filter(o => o.order_status === t.id).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari invoice atau nama jamaah..."
            className="w-full bg-gray-50 border border-gray-300 focus:border-[#6B4F3B] rounded-xl py-2 pl-9 pr-3 text-xs text-gray-800 outline-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-card border border-gray-200/80 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] text-gray-600 text-xs font-bold border-b border-gray-200">
              <th className="py-4 px-6">No. Invoice & Tanggal</th>
              <th className="py-4 px-6">Penerima & Alamat</th>
              <th className="py-4 px-6">Item Perlengkapan</th>
              <th className="py-4 px-6">Status Realtime & Resi</th>
              <th className="py-4 px-6 text-right">Aksi Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">Mengambil pesanan masuk...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">Tidak ada antrean pesanan pada filter terpilih ini.</td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                  
                  <td className="py-4 px-6">
                    <span className="font-serif font-extrabold text-gray-900 block">{o.order_number}</span>
                    <span className="text-xs text-gray-500">{new Date(o.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                    <span className="text-[11px] text-[#2F643F] block font-bold mt-1">Total: Rp {o.total.toLocaleString('id-ID')} ({o.payment_status})</span>
                  </td>

                  <td className="py-4 px-6 text-xs">
                    <strong className="text-gray-900 block">{o.address_snapshot?.recipient_name || 'H. Ihsan'} ({o.address_snapshot?.phone || '081...'})</strong>
                    <p className="text-gray-500 line-clamp-1 max-w-xs">{o.address_snapshot?.full_address}, Kota {o.address_snapshot?.city}</p>
                    <span className="text-[#6B4F3B] font-bold mt-0.5 block">{o.shipping_courier}</span>
                  </td>

                  <td className="py-4 px-6 text-xs text-gray-700">
                    {o.items && o.items.length > 0 ? (
                      <div>
                        <span className="font-bold">{o.items[0].qty}x {o.items[0].product_name_snapshot}</span>
                        {o.items.length > 1 && <span className="text-gray-500 block">+ {o.items.length - 1} item varian lainnya</span>}
                      </div>
                    ) : (
                      <span className="text-gray-400">Paket Perlengkapan</span>
                    )}
                  </td>

                  <td className="py-4 px-6 space-y-2">
                    {getStatusBadge(o.order_status)}
                    {o.tracking_number && (
                      <div className="font-mono text-xs text-blue-700 font-extrabold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{o.tracking_number}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Status selector */}
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-white border border-gray-300 hover:border-[#6B4F3B] rounded-lg text-xs font-bold py-1.5 px-2 text-[#6B4F3B] outline-none cursor-pointer shadow-sm"
                      >
                        <option value="menunggu_pembayaran">⏳ Menunggu Pembayaran</option>
                        <option value="diproses">⚡ Diproses</option>
                        <option value="dikemas">📦 Dikemas</option>
                        <option value="dikirim">🚚 Dikirim (Resi)</option>
                        <option value="selesai">✔ Selesai</option>
                      </select>

                      <button
                        onClick={() => openResiDialog(o)}
                        className="p-2 bg-[#FAF6EE] text-[#C9A227] hover:bg-[#F5ECCB] rounded-lg border border-[#EBE3D8] font-bold text-xs"
                        title="Input Nomor Resi Ekspedisi"
                      >
                        <Truck className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openPrintLabel(o)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-bold text-xs"
                        title="Cetak Thermal Label Gudang"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* INPUT RESI MODAL */}
      <Modal isOpen={resiModalOpen} onClose={() => setResiModalOpen(false)} title={`Input Resi Ekspedisi: ${targetOrder?.order_number}`} maxWidth="md">
        <form onSubmit={handleSaveResi} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Kurir Pilihan Jamaah:</label>
            <input type="text" disabled value={targetOrder?.shipping_courier || 'JNE REG'} className="w-full bg-gray-100 border border-gray-300 rounded-xl p-2.5 text-xs font-bold text-gray-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Nomor Resi / AWB Ekspedisi:</label>
            <div className="relative">
              <input
                type="text"
                required
                value={resiInput}
                onChange={(e) => setResiInput(e.target.value.toUpperCase())}
                placeholder="Contoh: JNE-091283812831"
                className="w-full bg-white border border-gray-300 focus:border-[#6B4F3B] rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono font-extrabold tracking-wider text-[#1F1B16] outline-none"
              />
              <Truck className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Menyimpan resi akan otomatis memindahkan status ke "DIKIRIM" & menyiarkan notifikasi ke smartphone jamaah.</p>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setResiModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSavingResi} leftIcon={<Send className="w-3.5 h-3.5" />} className="font-bold">
              Simpan & Kirim Notifikasi Resi
            </Button>
          </div>
        </form>
      </Modal>

      {/* THERMAL PACKING LABEL PRINT MODAL */}
      <Modal isOpen={printModalOpen} onClose={() => setPrintModalOpen(false)} title={`Label Pengiriman Gudang - ${printOrder?.order_number}`} maxWidth="lg">
        <div className="p-4 bg-white border-2 border-dashed border-gray-400 rounded-2xl space-y-4 font-mono text-sm text-gray-900">
          
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h2 className="text-xl font-extrabold font-serif tracking-tight">AJAK ABI STORE</h2>
              <p className="text-xs font-sans">Perlengkapan Umrah & Haji Resmi</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-black text-white font-extrabold text-sm rounded">EXPRESS</span>
              <p className="text-xs mt-1 font-bold">{printOrder?.shipping_courier}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold">PENERIMA (TUJUAN):</p>
            <p className="text-base font-black font-sans">{printOrder?.address_snapshot?.recipient_name} ({printOrder?.address_snapshot?.phone})</p>
            <p className="font-sans leading-relaxed">{printOrder?.address_snapshot?.full_address}</p>
            <p className="font-black">KOTA: {printOrder?.address_snapshot?.city} • INDONESIA</p>
          </div>

          <div className="border-t-2 border-black pt-2 text-xs font-sans">
            <p className="font-extrabold font-mono">INVOICE: {printOrder?.order_number} {printOrder?.tracking_number ? `• AWB: ${printOrder?.tracking_number}` : ''}</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 font-semibold">
              {printOrder?.items?.map((it, i) => (
                <li key={i}>{it.qty}x {it.product_name_snapshot}</li>
              ))}
            </ul>
            {printOrder?.notes && <p className="mt-2 text-red-600 font-bold">Catatan Gudang: {printOrder.notes}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3 font-sans">
            <Button type="button" variant="outline" size="sm" onClick={() => setPrintModalOpen(false)}>Tutup Preview</Button>
            <Button type="button" variant="primary" size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-4 h-4" />} className="font-extrabold">
              Cetak Label (Thermal Printer 100x150mm)
            </Button>
          </div>

        </div>
      </Modal>

    </div>
  );
};
