import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, CheckCircle2, Clock, AlertCircle, RefreshCw, Eye, ExternalLink } from 'lucide-react';

interface PaymentLog {
  id: string;
  transaction_id: string;
  order_number: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  status: 'settled' | 'pending' | 'failed' | 'expire';
  timestamp: string;
  channel: string;
}

export const AdminPaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<PaymentLog | null>(null);

  const [logs, setLogs] = useState<PaymentLog[]>([
    { id: 'pay-1', transaction_id: 'MID-SNAP-891234', order_number: 'AAS-20260728-0001', customer_name: 'Haji Ahmad Zulkarnain', amount: 1450000, payment_method: 'QRIS (Gopay/OVO)', status: 'settled', timestamp: '2026-07-28 21:15:32', channel: 'Midtrans Sandbox Webhook' },
    { id: 'pay-2', transaction_id: 'MID-SNAP-891235', order_number: 'AAS-20260728-0002', customer_name: 'Ustadzah Nur Khadijah', amount: 849000, payment_method: 'Bank Transfer (BCA VA)', status: 'settled', timestamp: '2026-07-28 20:02:10', channel: 'Midtrans Sandbox Webhook' },
    { id: 'pay-3', transaction_id: 'MID-SNAP-891236', order_number: 'AAS-20260728-0003', customer_name: 'Haji Badrut Tamam', amount: 585000, payment_method: 'Bank Transfer (BSI VA)', status: 'pending', timestamp: '2026-07-28 19:45:00', channel: 'Midtrans Snap Simulator' },
    { id: 'pay-4', transaction_id: 'MID-SNAP-891237', order_number: 'AAS-20260727-0044', customer_name: 'Rahmat Hidayatulloh', amount: 125000, payment_method: 'Credit Card (Visa)', status: 'settled', timestamp: '2026-07-27 15:30:12', channel: 'Xendit Payment Gateway' },
    { id: 'pay-5', transaction_id: 'MID-SNAP-891238', order_number: 'AAS-20260727-0039', customer_name: 'Siti Aminah Putri', amount: 275000, payment_method: 'Bank Transfer (Mandiri VA)', status: 'expire', timestamp: '2026-07-26 11:20:04', channel: 'Midtrans Expired Scheduler' }
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = l.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSettled = logs.filter(l => l.status === 'settled').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#D8D0C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-[#C45E38]" />
            Log Pembayaran & Gerbang Transaksi (Payment Gateway)
          </h1>
          <p className="text-sm text-[#726B5B] mt-1">
            Pantau seluruh arus kas masuk, status invoice Midtrans Snap Sandbox, dan mutasi virtual account secara real-time.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2C241D] text-[#EDE7DE] font-semibold text-sm hover:bg-[#3E332B] transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
          Sinkronisasi Webhook
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Total Dana Terverifikasi (Settled)</p>
            <p className="text-2xl font-serif font-bold text-[#1F1B16] mt-1">Rp {(totalSettled || 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="p-3.5 bg-green-50 rounded-full text-green-700 border border-green-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Menunggu Pembayaran (Pending)</p>
            <p className="text-2xl font-serif font-bold text-[#C45E38] mt-1">
              {logs.filter(l => l.status === 'pending').length} Transaksi
            </p>
          </div>
          <div className="p-3.5 bg-[#F9EDE8] rounded-full text-[#C45E38] border border-[#E9C3B1]">
            <Clock className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#726B5B]">Tingkat Keberhasilan Webhook</p>
            <p className="text-2xl font-serif font-bold text-[#2C241D] mt-1">99.8%</p>
          </div>
          <div className="p-3.5 bg-[#EFECE6] rounded-full text-[#2C241D] border border-[#D8D0C5]">
            <DollarSign className="w-7 h-7 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D0C5] mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID transaksi, pesanan, jamaah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-[#726B5B]" />
          <span className="text-sm text-[#726B5B] font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm font-medium text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          >
            <option value="all">Semua Status</option>
            <option value="settled">Berhasil (Settled)</option>
            <option value="pending">Menunggu (Pending)</option>
            <option value="expire">Kedaluwarsa / Expired</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl border border-[#D8D0C5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2C241D] text-[#EDE7DE] font-serif text-xs uppercase tracking-wider">
                <th className="p-4">ID Transaksi / Gateway</th>
                <th className="p-4">No. Pesanan & Jamaah</th>
                <th className="p-4">Metode Pembayaran</th>
                <th className="p-4">Nominal</th>
                <th className="p-4">Status & Waktu</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-sm font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#726B5B]">
                    Tidak ditemukan catatan pembayaran yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-[#1F1B16]">
                      <div className="flex items-center gap-1.5 text-blue-700">
                        {log.transaction_id}
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <span className="text-[11px] text-[#827A6E] font-sans font-normal block mt-0.5">{log.channel}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#1F1B16] text-xs font-mono">{log.order_number}</p>
                      <p className="text-xs text-[#726B5B] mt-0.5 font-medium">{log.customer_name}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#F4F1EC] text-[#2C241D] text-xs font-semibold rounded border border-[#D8D0C5]">
                        {log.payment_method}
                      </span>
                    </td>
                    <td className="p-4 font-serif font-bold text-[#2C241D] text-base">
                      Rp {(log.amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      {log.status === 'settled' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled / Paid
                        </span>
                      )}
                      {log.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C45E38] bg-[#F9EDE8] px-2 py-1 rounded border border-[#E9C3B1]">
                          <Clock className="w-3.5 h-3.5" /> Pending VA
                        </span>
                      )}
                      {log.status === 'expire' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                          <AlertCircle className="w-3.5 h-3.5" /> Expired
                        </span>
                      )}
                      <p className="text-[11px] text-[#827A6E] mt-1 font-mono">{log.timestamp}</p>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-[#726B5B] hover:text-[#C45E38] hover:bg-[#F4F1EC] rounded-lg transition-colors"
                        title="Lihat Detail Mutasi"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 border-2 border-[#C45E38] shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#1F1B16] mb-4 border-b pb-3 border-[#D8D0C5] flex items-center justify-between">
              <span>Detail Webhook Transaksi</span>
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                HTTP 200 OK
              </span>
            </h3>
            <div className="space-y-3 text-sm font-sans mb-6">
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Transaction ID:</span>
                <span className="font-mono font-bold text-[#1F1B16]">{selectedLog.transaction_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Order Reference:</span>
                <span className="font-mono font-bold text-[#C45E38]">{selectedLog.order_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Nama Jamaah:</span>
                <span className="font-bold text-[#1F1B16]">{selectedLog.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Channel Gateway:</span>
                <span className="text-[#1F1B16]">{selectedLog.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                <span className="text-[#726B5B]">Waktu Server:</span>
                <span className="font-mono text-xs text-[#1F1B16]">{selectedLog.timestamp}</span>
              </div>
              <div className="bg-[#2C241D] text-[#EDE7DE] p-3 rounded-lg font-mono text-xs mt-4">
                <p className="text-[#D4AF37]">// Webhook Payload Response:</p>
                <p>{"{"}</p>
                <p className="pl-3">"status_code": "200",</p>
                <p className="pl-3">"transaction_status": "{selectedLog.status}",</p>
                <p className="pl-3">"gross_amount": "{(selectedLog.amount || 0).toLocaleString('id-ID')}.00",</p>
                <p className="pl-3">"payment_type": "{selectedLog.payment_method}"</p>
                <p>{"}"}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-3 bg-[#C45E38] text-white font-bold rounded-xl shadow-md hover:bg-[#B34E2A] transition-all"
            >
              Tutup Modal Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
