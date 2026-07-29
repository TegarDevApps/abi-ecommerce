import React, { useState } from 'react';
import { ShieldAlert, Terminal, Search, Lock, RefreshCw, UserCheck, AlertCircle, Cpu } from 'lucide-react';

interface AuditLog {
  id: string;
  action_type: string;
  admin_user: string;
  target: string;
  ip_address: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  timestamp: string;
  description: string;
}

export const AdminAuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'aud-1',
      action_type: 'CATALOG_SEED',
      admin_user: 'Super Admin (Ajak Abi)',
      target: 'Supabase Database & Cloud Storage',
      ip_address: '114.122.45.19',
      status: 'SUCCESS',
      timestamp: '2026-07-28 23:45:01',
      description: 'Menambahkan 8 Kategori & 20 Produk Live Katalog Eksklusif termasuk Koper Sultan 24 Inch.'
    },
    {
      id: 'aud-2',
      action_type: 'ORDER_STATUS_UPDATE',
      admin_user: 'Admin Gudang & Kirim',
      target: 'Order #AAS-20260728-0001',
      ip_address: '114.122.45.20',
      status: 'SUCCESS',
      timestamp: '2026-07-28 21:30:15',
      description: 'Mengubah status dari Menunggu Pembayaran menjadi DIPROSES (Resi Biteship dibuat).'
    },
    {
      id: 'aud-3',
      action_type: 'LOGIN_PORTAL',
      admin_user: 'Super Admin (Ajak Abi)',
      target: 'Admin Security Dashboard',
      ip_address: '114.122.45.19',
      status: 'SUCCESS',
      timestamp: '2026-07-28 20:12:00',
      description: 'Berhasil autentikasi ke Portal Khusus Admin (/admin-login).'
    },
    {
      id: 'aud-4',
      action_type: 'PRICE_MODIFICATION',
      admin_user: 'Admin Katalog',
      target: 'Product #AAS-MKN-RYGLD',
      ip_address: '118.99.12.88',
      status: 'WARNING',
      timestamp: '2026-07-27 16:05:42',
      description: 'Memperbarui diskon promo dari Rp 399.000 menjadi Rp 379.000.'
    },
    {
      id: 'aud-5',
      action_type: 'FAILED_LOGIN_ATTEMPT',
      admin_user: 'Unknown Attacker',
      target: 'Admin Login Endpoint',
      ip_address: '185.220.101.44',
      status: 'ALERT',
      timestamp: '2026-07-26 04:11:02',
      description: 'Upaya login brute-force diblokir secara otomatis oleh firewall sistem (3 kali kata sandi keliru).'
    }
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredLogs = logs.filter(l => {
    const matchSearch = l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.admin_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' ? true : l.status === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#D8D0C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#C45E38]" />
            Audit Log Sistem & Keamanan Portal
          </h1>
          <p className="text-sm text-[#726B5B] mt-1">
            Rekam jejak digital terenkripsi (immutable audit trail) atas seluruh aktivitas manajemen produk, harga, dan keamanan akun.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2C241D] text-[#EDE7DE] font-semibold text-sm hover:bg-[#3E332B] transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
          Segarkan Log (Realtime)
        </button>
      </div>

      {/* Security Status Card */}
      <div className="bg-[#1F1B16] text-[#EDE7DE] p-6 rounded-2xl border border-[#3E332B] mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800 shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-white">Sistem Keamanan Toko Berada Dalam Kondisi Maksimal</h3>
            <p className="text-xs text-[#A8A196] mt-1 font-sans">
              ● Enkripsi SSL aktif & Role-Based Access Control (RBAC) membedakan secara ketat sesi Admin dari Sesi Jamaah.
            </p>
          </div>
        </div>
        <div className="bg-[#2C241D] px-5 py-3 rounded-xl border border-[#40352D] text-right shrink-0">
          <span className="text-[11px] font-mono text-[#D4AF37] block">STATUS FIREWALL:</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
            <Cpu className="w-4 h-4" /> PROTECTED BY SUPABASE RLS
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D0C5] mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aksi, nama admin, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-sm text-[#726B5B] font-medium">Tingkat Kepentingan:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm font-medium text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          >
            <option value="all">Semua Status Log</option>
            <option value="SUCCESS">✅ Success / Normal</option>
            <option value="WARNING">⚠️ Warning / Modifikasi</option>
            <option value="ALERT">🚨 Alert / Security Block</option>
          </select>
        </div>
      </div>

      {/* Logs Terminal List */}
      <div className="bg-white rounded-xl border border-[#D8D0C5] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#FAF8F5] border-b border-[#EFECE6] font-mono text-xs text-[#726B5B] flex items-center justify-between">
          <span>// RUNNING SYSTEM AUDIT TRAIL STREAM</span>
          <span className="text-[#C45E38] font-bold">TOTAL LOGS: {filteredLogs.length} ENTRIES</span>
        </div>
        <div className="divide-y divide-[#EFECE6] font-sans">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-[#726B5B] text-sm">
              Tidak ada entri log yang sesuai dengan kata kunci pencarian Anda.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-[#FAF8F5] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.status === 'WARNING' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                    }`}>
                      [{log.status}]
                    </span>
                    <span className="font-mono text-xs font-bold text-[#2C241D] bg-[#EFECE6] px-2 py-0.5 rounded">
                      {log.action_type}
                    </span>
                    <span className="text-xs text-[#827A6E] font-medium flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#C45E38]" /> {log.admin_user}
                    </span>
                    <span className="text-xs font-mono text-[#A8A196]">
                      IP: {log.ip_address}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1F1B16] mt-1">
                    {log.description}
                  </p>
                  <p className="text-xs font-mono text-[#726B5B]">
                    Target Resource: <span className="font-bold text-[#C45E38]">{log.target}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-medium text-[#827A6E] block bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#D8D0C5]">
                    🕒 {log.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
