import React, { useEffect, useState } from 'react';
import { Image, Plus, Trash2, Edit, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Banner } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const AdminBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Form banner
  const [title, setTitle] = useState('Koleksi Spesial Musim Haji & Umrah');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200');
  const [linkUrl, setLinkUrl] = useState('/produk');

  useEffect(() => {
    setIsLoading(true);
    api.getBanners().then((res) => {
      setBanners(res || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner = {
      id: `ban-${Date.now()}`,
      title,
      image_url: imageUrl,
      link_url: linkUrl,
      sort_order: banners.length + 1,
      is_active: true,
    };

    setBanners((prev) => [newBanner, ...prev]);
    setIsOpen(false);
    alert('Banner hero baru berhasil dipasang di beranda utama!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus slide banner ini dari Beranda Ajak Abi Store?')) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B16]">Kelola Banner Hero Beranda (CMS)</h1>
          <p className="text-xs text-gray-500 mt-1">Atur presentasi visual eksklusif yang menyerap perhatian saat customer mengakses Homepage.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Pasang Banner Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-xs text-gray-400">Memuat slide banner...</p>
        ) : banners.map((b, idx) => (
          <div key={b.id} className="rounded-[20px] bg-white border border-gray-200/80 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative aspect-[16/8] bg-gray-900 overflow-hidden">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                <div>
                  <Badge variant="gold" className="mb-2 text-[10px]">Slide #{idx+1} (Aktif)</Badge>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">{b.title}</h3>
                  <span className="text-xs text-blue-200 block mt-1">Tautan Tujuan: {b.link_url}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#FAF8F5] border-t border-gray-200 flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-700 font-bold">✔ Tayang di Beranda</span>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Banner</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Tambah Banner Hero Beranda Baru" maxWidth="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Utama Banner:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 font-semibold" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">URL Foto / Gambar Widescreen:</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-800" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tautan Tombol (Link URL):</label>
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-800" required />
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">Pasang ke Beranda</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
