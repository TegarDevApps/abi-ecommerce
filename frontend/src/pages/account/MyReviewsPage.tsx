import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Review } from '../../types';

export const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getAccountReviews('H. Ahmad Ihsan')
      .then((res) => {
        setReviews(res || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="py-20 text-center text-sm text-[#766F63]">Memuat riwayat ulasan yang pernah Anda kirimkan...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-card border border-[#EDE7DE] p-12 text-center space-y-3">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="font-serif font-bold text-lg text-ink">Belum Ada Ulasan Dikirimkan</h3>
        <p className="text-xs text-[#766F63]">Anda belum memberikan penilaian bintang terhadap perlengkapan yang Anda beli. Ulas produk setelah menerima pesanan Anda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#EDE7DE]">
        <h3 className="font-serif font-bold text-xl text-ink">Ulasan & Testimoni Saya ({reviews.length})</h3>
        <p className="text-xs text-[#766F63]">Terima kasih telah membantu calon jamaah lain membuat keputusan pembelian yang tepat.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-ink">{rev.user_name || 'H. Ahmad Ihsan'}</span>
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
              <div className="flex text-amber-500">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-sm text-ink font-serif italic">"{rev.comment}"</p>
            <span className="text-[11px] text-gray-400 block">{new Date(rev.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>

            {rev.admin_reply && (
              <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#ECE3C8] text-xs space-y-1 mt-2">
                <span className="font-bold text-[#8B6A52] block">📢 Balasan Resmi Ust. Abi Zaki:</span>
                <p className="text-ink/90 italic">"{rev.admin_reply}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
