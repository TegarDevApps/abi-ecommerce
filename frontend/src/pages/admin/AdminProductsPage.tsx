import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Sparkles, AlertTriangle, Layers, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Add/Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: 'AAS-PROD-01',
    category_id: '',
    brand: 'Ajak Abi Signature',
    base_price: 250000,
    discount_price: 225000,
    weight_grams: 800,
    description: 'Bahan berkualitas premium tidak terawang & sesuai standar maskapai.',
    is_bundling: false,
    images_str: 'https://images.unsplash.com/photo-1591871937631-2f64059d234f?q=80&w=600',
    bundling_items_json: '[{"name": "Kain Ihram Serat Bambu 100%", "qty": 1}, {"name": "Sabuk Ihram Tanpa Jahitan", "qty": 1}]',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = () => {
    setIsLoading(true);
    Promise.all([api.getProducts(), api.getCategories()]).then(([prods, cats]) => {
      setProducts(prods || []);
      setCategories(cats || []);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      sku: `AAS-SKU-${Math.floor(100 + Math.random() * 900)}`,
      category_id: categories[0]?.id || '',
      brand: 'Ajak Abi Signature',
      base_price: 350000,
      discount_price: 299000,
      weight_grams: 750,
      description: 'Koleksi istimewa yang didesain secara teliti untuk menahan cuaca ekstrem Timur Tengah.',
      is_bundling: false,
      images_str: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600',
      bundling_items_json: '[{"name": "Item Paket A", "qty": 1}, {"name": "Item Paket B", "qty": 1}]',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      sku: p.sku || 'AAS-PROD-XX',
      category_id: p.category_id || '',
      brand: p.brand || '',
      base_price: p.base_price,
      discount_price: p.discount_price || p.base_price,
      weight_grams: p.weight_grams || 500,
      description: p.description || '',
      is_bundling: p.is_bundling || false,
      images_str: p.images ? p.images.join('\n') : '',
      bundling_items_json: p.bundling_items ? JSON.stringify(p.bundling_items) : '[]',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const imagesArr = formData.images_str.split('\n').map((i) => i.trim()).filter(Boolean);
      let bundlingArr = [];
      if (formData.is_bundling) {
        try {
          bundlingArr = JSON.parse(formData.bundling_items_json);
        } catch (err) {
          alert('Format JSON rincian paket bundling kurang pas. Mohon periksa kembali.');
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        sku: formData.sku,
        category_id: formData.category_id || (categories[0] ? categories[0].id : null),
        brand: formData.brand,
        base_price: Number(formData.base_price),
        discount_price: Number(formData.discount_price),
        weight_grams: Number(formData.weight_grams),
        description: formData.description,
        is_bundling: formData.is_bundling,
        images: imagesArr,
        bundling_items: bundlingArr,
      };

      if (editingId) {
        await api.client.put(`/admin/products/${editingId}`, payload);
        alert('Produk berhasil diperbarui!');
      } else {
        await api.client.post('/admin/products', payload);
        alert('Produk baru berhasil ditambahkan ke katalog!');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(`Gagal menyimpan produk: ${err.message || 'Error server'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Anda yakin ingin menghapus produk "${name}" dari sistem database Ajak Abi?`)) {
      try {
        await api.client.delete(`/admin/products/${id}`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert('Gagal menghapus produk dari server.');
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterType === 'bundling') return p.is_bundling;
    if (filterType === 'regular') return !p.is_bundling;
    return true;
  }).filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1B16]">Kelola Katalog Produk & Bundling</h1>
          <p className="text-xs text-gray-500 mt-1">Atur spesifikasi material ihram, mukena travel, serta racikan item paket bundling siap keberangkatan.</p>
        </div>
        
        <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-card border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-[#6B4F3B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Semua ({products.length})
          </button>
          <button
            onClick={() => setFilterType('regular')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'regular' ? 'bg-[#6B4F3B] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Perlengkapan Satuan ({products.filter((p) => !p.is_bundling).length})
          </button>
          <button
            onClick={() => setFilterType('bundling')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${filterType === 'bundling' ? 'bg-[#C9A227] text-white shadow-sm' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paket Bundling ({products.filter((p) => p.is_bundling).length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau SKU produk..."
            className="w-full bg-gray-50 border border-gray-300 focus:border-[#6B4F3B] rounded-xl py-2 pl-9 pr-3 text-xs text-gray-800 outline-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* TABLE PRODUCTS */}
      <div className="bg-white rounded-card border border-gray-200/80 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] text-gray-600 text-xs font-bold border-b border-gray-200">
              <th className="py-4 px-6">Informasi Produk</th>
              <th className="py-4 px-6">Kategori / Tipe</th>
              <th className="py-4 px-6">Harga & Diskon</th>
              <th className="py-4 px-6">Stok Gudang</th>
              <th className="py-4 px-6 text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">Memuat katalog dari database...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">Tidak ada produk ditemukan sesuai kata kunci pencarian.</td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=200'}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-gray-900 line-clamp-1 max-w-xs">{p.name}</span>
                          {p.is_bundling && <Badge variant="gold" size="sm">✨ Bundling</Badge>}
                        </div>
                        <span className="text-xs text-gray-500 font-mono">SKU: {p.sku} • {p.weight_grams} Gram</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs">
                    <span className="font-bold text-gray-800">{p.category?.name || 'Katalog Umrah'}</span>
                    <span className="text-gray-500 block">{p.brand}</span>
                  </td>

                  <td className="py-4 px-6 text-xs tabular-price">
                    <span className="font-extrabold text-[#6B4F3B] text-sm block">Rp {(p.discount_price ?? p.base_price).toLocaleString('id-ID')}</span>
                    {p.discount_price && p.discount_price < p.base_price && (
                      <span className="text-gray-400 line-through">Rp {p.base_price.toLocaleString('id-ID')}</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <Badge variant="success" size="md">
                      Tersedia 45 Pcs
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 bg-white hover:bg-amber-50 text-amber-700 rounded-lg border border-gray-300 hover:border-amber-400 transition-colors font-bold text-xs"
                      title="Edit Produk / Paket Bundling"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-lg border border-gray-300 hover:border-red-300 transition-colors font-bold text-xs"
                      title="Hapus dari database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Spesifikasi Produk & Bundling' : 'Tambah Produk Baru ke Katalog'} maxWidth="2xl">
        <form onSubmit={handleSaveProduct} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nama Produk / Paket:</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kain Ihram Serat Bambu Organik"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:border-[#6B4F3B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">SKU Gudang & Kode Barcode:</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono text-gray-900 outline-none focus:border-[#6B4F3B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Harga Normal (Base):</label>
              <input
                type="number"
                required
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-bold tabular-price text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Harga Setelah Diskon:</label>
              <input
                type="number"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-extrabold text-[#6B4F3B] tabular-price outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Berat Kirim (Gram):</label>
              <input
                type="number"
                required
                value={formData.weight_grams}
                onChange={(e) => setFormData({ ...formData, weight_grams: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Lengkap & Keunggulan Syariat:</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Daftar Foto Produk (1 URL per baris):</label>
            <textarea
              rows={3}
              value={formData.images_str}
              onChange={(e) => setFormData({ ...formData, images_str: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1542296332..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-mono text-gray-800 outline-none"
            />
          </div>

          {/* BUNDLING SPECIAL TOGGLE & EDITOR (Section 5.5 Compliance) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_bundling}
                onChange={(e) => setFormData({ ...formData, is_bundling: e.target.checked })}
                className="w-4 h-4 text-[#C9A227] rounded accent-[#C9A227]"
              />
              <span className="text-xs font-extrabold text-[#8B6A52] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Jadikan Sebagai Paket Bundling Umrah (Harga Paket Hemat)</span>
              </span>
            </label>

            {formData.is_bundling && (
              <div className="space-y-2 pt-2 border-t border-amber-200">
                <label className="text-xs font-bold text-amber-950 block">Rincian Komposisi Item Paket (JSON format):</label>
                <textarea
                  rows={3}
                  value={formData.bundling_items_json}
                  onChange={(e) => setFormData({ ...formData, bundling_items_json: e.target.value })}
                  className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs font-mono text-gray-900 outline-none"
                />
                <p className="text-[10px] text-amber-800 italic">
                  *Contoh format: <code>{'[{"name":"Ihram Sutra","qty":1},{"name":"Mukena Travel","qty":2}]'}</code>
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />} className="font-extrabold px-8">
              {editingId ? 'Simpan Perubahan' : 'Menerbitkan Ke Katalog'}
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
