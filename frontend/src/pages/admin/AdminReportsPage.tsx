import React, { useState } from 'react';
import { FileText, TrendingUp, DollarSign, Calendar, Download, PieChart, BarChart2, ArrowUpRight } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('30_days');

  const topProducts = [
    { rank: 1, name: 'Koper Umrah & Haji Sultan 24 Inch (Aluminium Frame)', category: 'Koper & Tas', qty_sold: 142, total_revenue: 170258000 },
    { rank: 2, name: 'Paket Bundling VIP Umrah Putra', category: 'Koper & Bundling', qty_sold: 98, total_revenue: 191100000 },
    { rank: 3, name: 'Kain Ihram Serat Bambu Organik 100% (450 GSM)', category: 'Baju & Kain Ihram', qty_sold: 215, total_revenue: 75035000 },
    { rank: 4, name: 'Mukena Travel Silk Parasola Royal Gold', category: 'Mukena & Hijab', qty_sold: 184, total_revenue: 69736000 },
    { rank: 5, name: 'Air Zam-Zam Murni 5 Liter (Galon Original Bandara)', category: 'Air Zam-Zam Murni', qty_sold: 160, total_revenue: 93600000 }
  ];

  const categoryBreakdown = [
    { category: 'Koper & Tas Haji', percent: 35, amount: 245000000, color: 'bg-[#C45E38]' },
    { category: 'Air Zam-Zam Murni', percent: 22, amount: 154000000, color: 'bg-[#D4AF37]' },
    { category: 'Baju & Kain Ihram', percent: 18, amount: 126000000, color: 'bg-[#2C241D]' },
    { category: 'Mukena & Hijab Travel', percent: 15, amount: 105000000, color: 'bg-emerald-700' },
    { category: 'Kurma, Sajadah & Tasbih', percent: 10, amount: 70000000, color: 'bg-[#827A6E]' }
  ];

  const handleExport = (type: string) => {
    alert(`📥 Mempersiapkan pengunduhan laporan ${type.toUpperCase()}... File siap disimpan!`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#D8D0C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#C45E38]" />
            Laporan Penjualan & Performa Finansial
          </h1>
          <p className="text-sm text-[#726B5B] mt-1">
            Analisis omzet perolehan e-commerce, kontribusi per kategori perlengakapn haji, dan tingkat retensi jamaah.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm font-medium text-[#1F1B16] shadow-sm"
          >
            <option value="7_days">7 Hari Terakhir</option>
            <option value="30_days">30 Hari Terakhir (Bulan Ini)</option>
            <option value="quarter">Q3 2026 (Kuartal Ini)</option>
            <option value="year">Tahun 2026 (Tahunan)</option>
          </select>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-[#2C241D] text-[#EDE7DE] font-semibold text-sm rounded-lg hover:bg-[#3E332B] transition-all flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" /> Export PDF / Excel
          </button>
        </div>
      </div>

      {/* Hero Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2C241D] text-[#EDE7DE] p-6 rounded-2xl shadow-xl relative overflow-hidden border border-[#40352D]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">Total Omzet Pendapatan</p>
              <h3 className="text-3xl font-serif font-bold mt-2 text-white">Rp 700.000.000</h3>
            </div>
            <div className="p-3 bg-[#40352D] rounded-xl text-[#D4AF37]">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800 w-fit">
            <ArrowUpRight className="w-4 h-4" /> +24.8% dari periode sebelumnya
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D8D0C5] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#726B5B]">Total Pesanan Berhasil</p>
              <h3 className="text-3xl font-serif font-bold text-[#1F1B16] mt-2">799 Transaksi</h3>
            </div>
            <div className="p-3 bg-[#F9EDE8] rounded-xl text-[#C45E38] border border-[#E9C3B1]">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
          <p className="text-xs text-[#827A6E] mt-4 font-sans">
            ● Rata-rata keranjang (Basket Size): <span className="font-bold text-[#1F1B16]">Rp 876.095</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D8D0C5] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#726B5B]">Konversi Checkouts</p>
              <h3 className="text-3xl font-serif font-bold text-[#1F1B16] mt-2">18.4%</h3>
            </div>
            <div className="p-3 bg-[#EFECE6] rounded-xl text-[#2C241D] border border-[#D8D0C5]">
              <BarChart2 className="w-7 h-7 text-[#D4AF37]" />
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-4 font-sans flex items-center gap-1">
            ✓ 96.2% pembayar menyelesaikan transaksi lewat VA
          </p>
        </div>
      </div>

      {/* Grid Content: Category Breakdown & Top Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Share */}
        <div className="bg-white p-6 rounded-xl border border-[#D8D0C5] shadow-sm">
          <h3 className="font-serif font-bold text-lg text-[#1F1B16] mb-6 flex items-center gap-2 border-b pb-3 border-[#EFECE6]">
            <PieChart className="w-5 h-5 text-[#C45E38]" /> Kontribusi Kategori Produk
          </h3>
          <div className="space-y-5">
            {categoryBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#1F1B16]">{item.category}</span>
                  <span className="font-serif font-bold text-[#C45E38]">{item.percent}% (Rp {(item.amount || 0).toLocaleString('id-ID')})</span>
                </div>
                <div className="w-full h-2.5 bg-[#F4F1EC] rounded-full overflow-hidden border border-[#EFECE6]">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-[#FAF8F5] rounded-xl border border-[#D8D0C5] text-xs text-[#726B5B] leading-relaxed">
            💡 <strong className="text-[#1F1B16]">Insight AI:</strong> Kategori <strong>Koper & Tas Haji</strong> mengalami pertumbuhan omzet tercepat setelah rilisnya <em>Koper Sultan Aluminium 24"</em> musim ini!
          </div>
        </div>

        {/* Top Best Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#D8D0C5] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#EFECE6] flex justify-between items-center bg-[#FAF8F5]">
            <h3 className="font-serif font-bold text-lg text-[#1F1B16]">
              🏆 5 Produk Terlaris & Penyumbang Omzet Tertinggi
            </h3>
            <span className="text-xs font-mono bg-[#2C241D] text-[#D4AF37] px-2.5 py-1 rounded font-bold">
              TOP PERFORMERS
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EFECE6] text-[#726B5B] font-serif text-xs uppercase">
                  <th className="p-4 text-center w-12">#</th>
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4 text-center">Terjual</th>
                  <th className="p-4 text-right">Omzet Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] text-sm font-sans">
                {topProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4 text-center font-bold font-serif text-[#C45E38] text-base">
                      {p.rank}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#1F1B16] text-sm">{p.name}</p>
                      <span className="text-xs text-[#827A6E] bg-[#F4F1EC] px-2 py-0.5 rounded mt-1 inline-block border border-[#D8D0C5]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-[#2C241D] bg-[#FDFBF7]">
                      {p.qty_sold} Pcs
                    </td>
                    <td className="p-4 text-right font-serif font-bold text-[#2C241D] text-base">
                      Rp {(p.total_revenue || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
