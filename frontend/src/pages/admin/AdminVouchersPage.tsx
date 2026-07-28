import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const AdminVouchersPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // New voucher form
  const [code, setCode] = useState('HEMAT50');
  const [discountAmount, setDiscountAmount] = useState(50000);
  const [minOrder, setMinOrder] = useState(250000);
  const [maxUses, setMaxUses] = useState(100);

  useEffect(() => {
    setIsLoading(true);
    api.getVouchers().then((res) => {
      setVouchers(res || [
        { id: 'v1', code: 'MABRUR2026', discount_amount: 350000, min_order_amount: 1000000, is_active: true, usage_count: 14 },
        { id: 'v2', code: 'HEMAT50', discount_amount: 50000, min_order_amount: 250000, is_active: true, usage_count: 5 },
      ]);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: code.toUpperCase().trim(),
        discount_type: 'fixed',
        discount_value: Number(discountAmount),
        discount_amount: Number(discountAmount),
        min_order_amount: Number(minOrder),
        max_uses: Number(maxUses),
        is_active: true,
      };

      await api.client.post('/admin/vouchers', payload);
      setVouchers((prev) => [payload, ...prev]);
      setIsOpen(false);
      alert('Kode voucher promo baru berhasil diaktifkan!');
    } catch (err) {
      alert('Gagal menyimpan voucher promo.');
    }
  };

  const handleDelete = (c: string) => {
    if (window.confirm(`Hapus voucher promo [${c}]?`)) {
      setVouchers((prev) => prev.filter((v) => v.code !== c));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B16]">Kelola Voucher & Kode Promo</h1>
          <p className="text-xs text-gray-500 mt-1">Berikan diskon keberangkatan bagi jamaah baru maupun grup travel pendaftaran kolektif.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Buat Voucher Baru
        </Button>
      </div>

      <div className="bg-white rounded-card border border-gray-200/80 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#FAF8F5] text-gray-600 text-xs font-bold border-b border-gray-200">
              <th className="py-4 px-6">Kode Promo</th>
              <th className="py-4 px-6">Potongan Diskon</th>
              <th className="py-4 px-6">Min. Pembelian</th>
              <th className="py-4 px-6">Status & Terpakai</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="py-8 text-center text-xs text-gray-400">Memuat voucher...</td></tr>
            ) : vouchers.map((v, idx) => (
              <tr key={idx} className="hover:bg-gray-50/70">
                <td className="py-4 px-6 font-mono font-black text-lg tracking-wider text-[#6B4F3B]">
                  {v.code}
                </td>
                <td className="py-4 px-6 font-bold text-[#2F643F] tabular-price">
                  Rp {(v.discount_amount || v.discount_value || 0).toLocaleString('id-ID')}
                </td>
                <td className="py-4 px-6 text-gray-600 tabular-price">
                  Rp {(v.min_order_amount || 0).toLocaleString('id-ID')}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Aktif</Badge>
                    <span className="text-xs text-gray-500">({v.usage_count || 0}x dipakai)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleDelete(v.code)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Aktifkan Kode Voucher Baru" maxWidth="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Kode Voucher (Kapital Tanpa Spasi):</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="MABRUR50" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono font-bold text-base uppercase text-gray-900" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Potongan (Rp):</label>
              <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-extrabold text-green-700 tabular-price" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Min. Order (Rp):</label>
              <input type="number" value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 tabular-price text-gray-900" required />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">Terbitkan Voucher</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
