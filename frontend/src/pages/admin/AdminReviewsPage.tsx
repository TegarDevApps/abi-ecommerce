import React, { useState } from 'react';
import { MessageSquare, Star, Check, Trash2, Shield, Eye, Search, AlertTriangle } from 'lucide-react';

interface ReviewItem {
  id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  status: 'published' | 'hidden' | 'flagged';
  verified_purchase: boolean;
}

export const AdminReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      product_name: 'Kain Ihram Serat Bambu Organik 100% (450 GSM)',
      customer_name: 'Haji Hendro Kartiko',
      rating: 5,
      comment: 'MasyaAllah bahan ihramnya luar biasa sejuk di kulit saat berada di pelataran Kaaba tatkala siang hari. Sesuai klaim tanpa jahit, sangat syari dan recommended untuk jamaah Indonesia!',
      created_at: '2026-07-28 18:20:00',
      status: 'published',
      verified_purchase: true
    },
    {
      id: 'rev-2',
      product_name: 'Kurma Ajwa Al-Madinah VIP (500gr)',
      customer_name: 'Ibu Fatmawati Syahputri',
      rating: 5,
      comment: 'Kurma nabi yang benar-benar fresh, legit rasanya pas tidak membuat batuk dan tekstur pulen. Kemasan box terTerjamin kedap udara sampai Jakarta dengan aman.',
      created_at: '2026-07-28 14:15:22',
      status: 'published',
      verified_purchase: true
    },
    {
      id: 'rev-3',
      product_name: 'Mukena Travel Silk Parasola Royal Gold',
      customer_name: 'Anisa Rahma (Traveler)',
      rating: 5,
      comment: 'Super ringan dan beneran anti kusut! Cocok pas transit wudhu di bandara Doha, tinggal lipat kecil langsung masuk saku tas selempang.',
      created_at: '2026-07-27 09:10:05',
      status: 'published',
      verified_purchase: true
    },
    {
      id: 'rev-4',
      product_name: 'Tasbih Kayu Kokka Asli Turki Bersertifikat',
      customer_name: 'Abdullah Al-Farouq',
      rating: 4,
      comment: 'Wanginya alami khas kokka timur tengah dan pengikat talinya sangat kokoh. Coba ada opsi ukuran buluh yang sedikit lebih besar pasti tambah mantab!',
      created_at: '2026-07-26 21:05:40',
      status: 'published',
      verified_purchase: true
    },
    {
      id: 'rev-5',
      product_name: 'Koper Umrah & Haji Sultan 24 Inch (Aluminium Frame)',
      customer_name: 'Pengguna Tanpa Nama',
      rating: 1,
      comment: 'SPAM TEST KOMENTAR LINK JUDOL PROMO DISCOUNT TIDAK JELAS KLIK DISINI DOT COM.',
      created_at: '2026-07-25 03:00:11',
      status: 'flagged',
      verified_purchase: false
    }
  ]);

  const handleToggleStatus = (id: string, newStatus: 'published' | 'hidden') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus ulasan ini dari sistem?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRating = filterRating === 'all' ? true : r.rating.toString() === filterRating;
    return matchSearch && matchRating;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#D8D0C5] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F1B16] flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#C45E38]" />
            Moderasi Ulasan & Testimoni Jamaah
          </h1>
          <p className="text-sm text-[#726B5B] mt-1">
            Kelola feedback pelanggan, verifikasi kepemilikan transaksi, dan cegah spam pada halaman etalase produk Anda.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F9F8F6] px-4 py-2 rounded-lg border border-[#D8D0C5]">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-serif font-bold text-[#1F1B16]">4.9 / 5.0</span>
          <span className="text-xs text-[#726B5B]">Rata-Rata Toko</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D0C5] mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#A8A196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari komentar, nama produk, atau jamaah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-sm text-[#726B5B] font-medium">Filter Bintang:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 bg-[#F9F8F6] border border-[#D8D0C5] rounded-lg text-sm font-medium text-[#1F1B16] focus:outline-none focus:ring-2 focus:ring-[#C45E38]"
          >
            <option value="all">Semua Bintang (1 - 5)</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Bintang</option>
            <option value="4">⭐⭐⭐⭐ 4 Bintang</option>
            <option value="3">⭐⭐⭐ 3 Bintang</option>
            <option value="2">⭐⭐ 2 Bintang</option>
            <option value="1">⭐ 1 Bintang (Perlu Perhatian)</option>
          </select>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-[#D8D0C5] text-[#726B5B]">
            Tidak ada ulasan yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 rounded-xl border transition-all shadow-sm ${
                rev.status === 'flagged' ? 'bg-[#FFF9F5] border-[#C45E38]' : 'bg-white border-[#D8D0C5]'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1F1B16] flex items-center gap-2">
                    {rev.product_name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-semibold text-[#2C241D]">{rev.customer_name}</span>
                    {rev.verified_purchase ? (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Pembeli Terverifikasi
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-300">
                        Belum Terverifikasi
                      </span>
                    )}
                    <span className="text-[#827A6E]">{rev.created_at}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${idx < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[#403930] text-sm leading-relaxed mb-4 bg-[#FAF8F5] p-3 rounded-lg border border-[#EFECE6] font-sans">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[#EFECE6] text-xs">
                <div>
                  {rev.status === 'published' && (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      ● Ditampilkan Secara Publik
                    </span>
                  )}
                  {rev.status === 'hidden' && (
                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                      ● Disembunyikan oleh Admin
                    </span>
                  )}
                  {rev.status === 'flagged' && (
                    <span className="text-[#C45E38] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Dicurigai Spam / Konten Ilegal
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {rev.status === 'published' ? (
                    <button
                      onClick={() => handleToggleStatus(rev.id, 'hidden')}
                      className="px-3 py-1.5 bg-[#EFECE6] text-[#2C241D] font-medium rounded-lg hover:bg-[#D8D0C5] transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Sembunyikan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(rev.id, 'published')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Publikasikan
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="px-3 py-1.5 bg-[#F9EDE8] text-[#C45E38] font-medium rounded-lg hover:bg-[#F2D7CD] transition-colors flex items-center gap-1.5 border border-[#E9C3B1]"
                    title="Hapus Ulasan"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
