import React, { useState } from 'react';
import { Users, Search, Download, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Award } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  total_spent: number;
  orders_count: number;
  tier: 'Platinum Mabrur' | 'Gold Jamaah' | 'Silver Member';
  status: 'active' | 'blocked';
  joined_date: string;
}

export const AdminCustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-1',
      name: 'Haji Ahmad Zulkarnain',
      email: 'h.zulkarnain@gmail.com',
      phone: '0812-8899-7766',
      city: 'Jakarta Selatan',
      total_spent: 8450000,
      orders_count: 7,
      tier: 'Platinum Mabrur',
      status: 'active',
      joined_date: '12 Jan 2026'
    },
    {
      id: 'cust-2',
      name: 'Ustadzah Nur Khadijah',
      email: 'khadijah.nur@yahoo.com',
      phone: '0813-2233-4455',
      city: 'Bandung, Jawa Barat',
      total_spent: 4250000,
      orders_count: 5,
      tier: 'Gold Jamaah',
      status: 'active',
      joined_date: '05 Feb 2026'
    },
    {
      id: 'cust-3',
      name: 'Haji Badrut Tamam',
      email: 'badrut.tamam@outlook.com',
      phone: '0811-9988-1122',
      city: 'Surabaya, Jawa Timur',
      total_spent: 2150000,
      orders_count: 3,
      tier: 'Gold Jamaah',
      status: 'active',
      joined_date: '20 Mar 2026'
    },
    {
      id: 'cust-4',
      name: 'Rahmat Hidayatulloh',
      email: 'hidayates.rahmat@gmail.com',
      phone: '0857-6655-4433',
      city: 'Medan, Sumatera Utara',
      total_spent: 789000,
      orders_count: 2,
      tier: 'Silver Member',
      status: 'active',
      joined_date: '18 Apr 2026'
    },
    {
      id: 'cust-5',
      name: 'Anisa Putri Rahayu',
      email: 'anisa.rahayu@travel.id',
      phone: '0819-0011-2233',
      city: 'Yogyakarta',
      total_spent: 450000,
      orders_count: 1,
      tier: 'Silver Member',
      status: 'active',
      joined_date: '10 Mei 2026'
    }
  ]);

  const handleExport = () => {
    alert('📥 Mempersiapkan unduhan data jamaah (EXCEL/CSV)...');
  };

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTier = tierFilter === 'all' ? true : c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#D8D0C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] flex items-center gap-3">
            <Users className="w-8 h-8 text-[#C45E38]" />
            Data Pelanggan & Jamaah Setia
          </h1>
          <p className="text-sm text-[#726B5B] mt-1">
            Kelola basis data pelanggan Ajak Abi Store, riwayat pembelanjaan, serta tingkatan keanggotaan VIP.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2C241D] text-[#EDE7DE] font-semibold text-sm hover:bg-[#3E332B] transition-all shadow-md"
        >
          <Download className="w-4 h-4 text-[#D4AF37]" />
          Export ke Excel / CSV
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Total Terdaftar</p>
          <p className="text-2xl font-serif font-bold text-[#1F1B16] mt-1">{customers.length} Jamaah</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Rata-Rata Transaksi / Jamaah</p>
          <p className="text-2xl font-serif font-bold text-[#2C241D] mt-1">Rp 3.217.800</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Anggota VIP Platinum</p>
          <p className="text-2xl font-serif font-bold text-[#C45E38] mt-1">
            {customers.filter(c => c.tier === 'Platinum Mabrur').length} Jamaah VIP
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D0C5] mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama jamaah, email, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-sm text-[#726B5B] font-medium">Tier Keanggotaan:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm font-medium text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          >
            <option value="all">Semua Tier</option>
            <option value="Platinum Mabrur">👑 Platinum Mabrur</option>
            <option value="Gold Jamaah">🌟 Gold Jamaah</option>
            <option value="Silver Member">✨ Silver Member</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-[#D8D0C5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2C241D] text-[#EDE7DE] font-serif text-xs uppercase tracking-wider">
                <th className="p-4">Nama Jamaah & Kontak</th>
                <th className="p-4">Lokasi Kota</th>
                <th className="p-4">Tier Keanggotaan</th>
                <th className="p-4 text-right">Total Belanja (Spent)</th>
                <th className="p-4 text-center">Pesanan</th>
                <th className="p-4 text-center">Bergabung</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-sm font-sans">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#726B5B]">
                    Tidak ditemukan data pelanggan yang sesuai kueri pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4">
                      <p className="font-serif font-bold text-[#1F1B16] text-base">{cust.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#726B5B]">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cust.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cust.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#403930]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C45E38]" /> {cust.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1 ${
                        cust.tier === 'Platinum Mabrur'
                          ? 'bg-[#FDF4E7] text-[#8B6508] border-[#D4AF37]'
                          : cust.tier === 'Gold Jamaah'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        <Award className="w-3.5 h-3.5" /> {cust.tier}
                      </span>
                    </td>
                    <td className="p-4 text-right font-serif font-bold text-[#2C241D] text-base">
                      Rp {(cust.total_spent || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-center font-bold text-[#C45E38] bg-[#FDFBF7]">
                      {cust.orders_count}x
                    </td>
                    <td className="p-4 text-center text-xs text-[#726B5B] font-mono">
                      {cust.joined_date}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 rounded-lg bg-[#EFECE6] hover:bg-[#D8D0C5] text-[#2C241D] text-xs font-semibold transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 border-2 border-[#D4AF37] shadow-2xl">
            <div className="flex items-center gap-4 border-b pb-4 border-[#D8D0C5]">
              <div className="w-14 h-14 bg-[#2C241D] text-[#D4AF37] rounded-full flex items-center justify-center font-serif font-bold text-2xl shadow-inner">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1F1B16]">{selectedCustomer.name}</h3>
                <p className="text-xs text-[#8B6508] font-semibold flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedCustomer.tier}
                </p>
              </div>
            </div>
            <div className="py-4 space-y-3 text-sm font-sans">
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Email Resmi:</span>
                <span className="font-semibold text-[#1F1B16]">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Telepon / WhatsApp:</span>
                <span className="font-semibold text-[#1F1B16]">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Domisili:</span>
                <span className="font-semibold text-[#1F1B16]">{selectedCustomer.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Akumulasi Belanja:</span>
                <span className="font-serif font-bold text-lg text-[#C45E38]">Rp {(selectedCustomer.total_spent || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-3 bg-[#2C241D] text-[#EDE7DE] font-bold rounded-xl shadow hover:bg-[#3E332B] transition-all mt-2"
            >
              Kembali ke Daftar Jamaah
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
