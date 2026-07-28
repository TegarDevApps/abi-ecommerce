import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Phone, Home } from 'lucide-react';
import { api } from '../../lib/api';
import { Address } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Address Form
  const [label, setLabel] = useState('Rumah Utama');
  const [recipient, setRecipient] = useState('H. Ahmad Ihsan');
  const [phone, setPhone] = useState('081987654321');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');

  const fetchAddresses = () => {
    setIsLoading(true);
    api.getAccountAddresses().then((res) => {
      setAddresses(res || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddr = await api.client.post('/account/addresses', {
        label,
        recipient_name: recipient,
        phone,
        full_address: fullAddress,
        province: 'DKI Jakarta / Jawa',
        city,
        district: 'Pasar Minggu',
        postal_code: '12560',
      }).then((r: any) => r.data.data);

      setAddresses((prev) => [newAddr, ...prev]);
      setIsAddOpen(false);
      setFullAddress('');
    } catch (err) {
      alert('Gagal menyimpan alamat baru.');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-[#766F63]">Memuat daftar alamat tersimpan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#EDE7DE]">
        <div>
          <h3 className="font-serif font-bold text-xl text-ink">Buku Alamat Pengiriman ({addresses.length})</h3>
          <p className="text-xs text-[#766F63]">Daftar alamat ini dapat dipilih langsung saat Anda melakukan pembayaran (checkout).</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Alamat Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className={`p-6 rounded-card border transition-all relative flex flex-col justify-between ${
            addr.is_default ? 'bg-[#FAF8F5] border-primary shadow-sm' : 'bg-white border-[#EBE3D8] hover:border-[#D5C6B5]'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-ink flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <span>{addr.label}</span>
                </span>
                {addr.is_default && <Badge variant="gold" size="sm">Utama</Badge>}
              </div>

              <div className="text-xs text-[#59524B] space-y-1 pt-1 border-t border-[#F2EDE5]">
                <p className="font-bold text-ink">{addr.recipient_name} ({addr.phone})</p>
                <p className="leading-relaxed">{addr.full_address}</p>
                <p className="font-semibold text-primary">{addr.city}, {addr.province} - {addr.postal_code}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2EDE5] mt-6 flex items-center justify-between text-xs font-semibold">
              {!addr.is_default ? (
                <button className="text-primary hover:underline">Jadikan Alamat Utama</button>
              ) : (
                <span className="text-[#3E7B4F] flex items-center gap-1">✔ Dipilih Otomatis</span>
              )}
              <button className="text-[#968F83] hover:text-danger flex items-center gap-1 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah Alamat Baru" maxWidth="lg">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Label Alamat:</label>
              <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Contoh: Rumah Kantor / Orang Tua" className="w-full bg-[#FAF8F5] border border-[#DCD3C5] rounded-xl p-2.5 text-xs text-ink" required />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Kota / Kabupaten:</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Jakarta Selatan / Bandung / Surabaya" className="w-full bg-[#FAF8F5] border border-[#DCD3C5] rounded-xl p-2.5 text-xs text-ink" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Nama Penerima:</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#DCD3C5] rounded-xl p-2.5 text-xs text-ink" required />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">No WhatsApp / HP:</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#DCD3C5] rounded-xl p-2.5 text-xs text-ink" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Alamat Lengkap (Jalan, RT/RW, Patokan):</label>
            <textarea rows={3} value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="Jl. Raya Pasar Minggu No. 45, Kebayoran..." className="w-full bg-[#FAF8F5] border border-[#DCD3C5] rounded-xl p-2.5 text-xs text-ink" required />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">Simpan Alamat</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
