import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw, Check, Sparkles, Layers, Package } from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filters state initialized from URL params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'terlaris';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>(initialSort);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3500000);
  const [onlyBundling, setOnlyBundling] = useState<boolean>(initialCategory === 'paket-bundling');

  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getProducts(), api.getCategories()]).then(([prods, cats]) => {
      setAllProducts(prods || []);
      setCategories(cats || []);
      setIsLoading(false);
    });
  }, []);

  // Synchronize filter state when URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category');
    const bundling = searchParams.get('is_bundling');
    const q = searchParams.get('search');
    
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      if (cat === 'paket-bundling' || bundling === 'true') {
        setOnlyBundling(true);
      } else {
        setOnlyBundling(false);
      }
    } else if (bundling === 'true') {
      setOnlyBundling(true);
    }
    
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams, selectedCategory, searchQuery]);

  // Compute filtered & sorted list
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'paket-bundling') {
      result = result.filter((p: any) => p.category?.slug === selectedCategory || p.category_slug === selectedCategory);
    }

    // Bundling filter
    if (onlyBundling || selectedCategory === 'paket-bundling' || searchParams.get('is_bundling') === 'true') {
      result = result.filter((p: any) => p.is_bundling);
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    // Price range
    result = result.filter((p) => (p.discount_price ?? p.base_price) <= maxPriceFilter);

    // Sorting
    if (sortOption === 'terlaris') {
      result.sort((a, b) => b.review_count - a.review_count);
    } else if (sortOption === 'termurah') {
      result.sort((a, b) => (a.discount_price ?? a.base_price) - (b.discount_price ?? b.base_price));
    } else if (sortOption === 'termahal') {
      result.sort((a, b) => (b.discount_price ?? b.base_price) - (a.discount_price ?? a.base_price));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating_avg - a.rating_avg);
    }

    return result;
  }, [allProducts, selectedCategory, onlyBundling, searchQuery, maxPriceFilter, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPriceFilter(3500000);
    setOnlyBundling(false);
    setSortOption('terlaris');
    setSearchParams({});
  };

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Breadcrumbs & Heading */}
      <div className="mb-8 pb-6 border-b border-[#EDE7DE]">
        <div className="text-xs text-[#766F63] mb-2 font-medium">
          <span className="cursor-pointer hover:text-ink" onClick={() => { setSelectedCategory('all'); setSearchParams({}); }}>Beranda</span>
          {' / '}
          <span className="text-ink font-bold">
            {currentCategoryObj ? currentCategoryObj.name : selectedCategory === 'paket-bundling' ? 'Paket Bundling Umrah' : 'Semua Katalog Produk'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {currentCategoryObj ? currentCategoryObj.name : selectedCategory === 'paket-bundling' ? 'Paket Komplit Bundling' : 'Katalog Perlengkapan Umrah & Haji'}
            </h1>
            <p className="text-sm text-[#766F63] max-w-2xl mt-1.5 leading-relaxed">
              {currentCategoryObj
                ? `Menampilkan perlengkapan berkualitas tinggi kategori ${currentCategoryObj.name} dengan jaminan kenyamanan di cuaca Tanah Suci.`
                : 'Pilihan lengkap mulai dari ihram berserah pendingin serat bambu, mukena travel sutra anti kusut, hingga koper hardcase standar maskapai internasional.'}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden py-2.5 px-4 bg-white border border-[#DCD3C5] rounded-button font-bold text-xs flex items-center justify-center gap-2 text-ink shadow-sm active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filter & Urutan ({filteredProducts.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FILTER SIDEBAR (Desktop) */}
        <aside className={`md:col-span-3 bg-white border border-[#EBE3D8] rounded-card p-6 shadow-sm md:sticky md:top-24 space-y-7 ${
          showMobileFilter ? 'fixed inset-0 z-50 overflow-y-auto block rounded-none border-0' : 'hidden md:block'
        }`}>
          {showMobileFilter && (
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE7DE] md:hidden">
              <h3 className="font-serif font-bold text-lg text-ink">Filter Katalog</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-sm font-bold text-primary">Tutup ✕</button>
            </div>
          )}

          {/* Search Filtering Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">Cari Kata Kunci:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: ihram, koper..."
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-lg py-2 pl-3 pr-8 text-xs text-ink outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-xs font-bold text-[#766F63]">✕</button>
              )}
            </div>
          </div>

          {/* Kategori Perlengkapan */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">Kategori Perlengkapan:</label>
            <div className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => { setSelectedCategory('all'); setOnlyBundling(false); setSearchParams({ category: 'all' }); }}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-all ${
                  selectedCategory === 'all' && !onlyBundling ? 'bg-primary text-white font-bold shadow' : 'text-[#6B5A4B] hover:bg-[#FAF6F2]'
                }`}
              >
                <span>Semua Produk</span>
                <span>({allProducts.length})</span>
              </button>

              <button
                onClick={() => { setSelectedCategory('paket-bundling'); setOnlyBundling(true); setSearchParams({ category: 'paket-bundling' }); }}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-all ${
                  selectedCategory === 'paket-bundling' || onlyBundling ? 'bg-[#C9A227] text-white font-bold shadow' : 'text-[#9A7D18] hover:bg-[#FAF8E8] bg-[#FDFBF2] border border-[#F3ECCE]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Paket Bundling Umrah</span>
                </span>
                <span>({allProducts.filter((p) => p.is_bundling).length})</span>
              </button>

              {categories.map((cat) => {
                const count = allProducts.filter((p) => p.category?.slug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setOnlyBundling(false); setSearchParams({ category: cat.slug }); }}
                    className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between transition-all ${
                      selectedCategory === cat.slug ? 'bg-primary text-white font-bold shadow' : 'text-[#6B5A4B] hover:bg-[#FAF6F2]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-[#EDE7DE]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-ink uppercase tracking-wider">Harga Maksimal:</label>
              <span className="font-bold text-primary tabular-price">Rp {maxPriceFilter.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="3500000"
              step="50000"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-[#968F83]">
              <span>Rp 50rb</span>
              <span>Rp 3,5 Jt+</span>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2">
            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-[#766F63] border-[#C2B5A7] font-semibold"
            >
              Reset Semua Filter
            </Button>
            {showMobileFilter && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowMobileFilter(false)}
                className="mt-3 font-bold md:hidden"
              >
                Terapkan Filter ({filteredProducts.length} Produk)
              </Button>
            )}
          </div>

        </aside>

        {/* RIGHT CATALOG VIEWPORT */}
        <main className="md:col-span-9 space-y-6">
          
          {/* Top Bar Sorting & Results Count */}
          <div className="bg-white border border-[#EFECE6] rounded-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-xs font-semibold text-ink flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Menampilkan <strong className="text-primary font-bold">{filteredProducts.length}</strong> produk perlengkapan terpilih</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-medium text-[#766F63] hidden sm:inline-block">Urutkan Berdasarkan:</span>
              <select
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value); setSearchParams((prev) => { prev.set('sort', e.target.value); return prev; }); }}
                className="bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-lg text-xs font-bold py-2 px-3.5 text-ink outline-none cursor-pointer shadow-sm w-full sm:w-52"
              >
                <option value="terlaris">🔥 Paling Laris / Populer</option>
                <option value="termurah">💰 Harga Termurah</option>
                <option value="termahal">💎 Harga Termahal</option>
                <option value="rating">⭐ Rating Ulasan Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Products Grid Display */}
          {isLoading ? (
            <div className="py-20 text-center text-sm font-medium text-[#766F63]">
              Mengambil katalog produk dari server...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-card border border-[#EDE7DE] p-12 text-center my-8 shadow-sm">
              <div className="w-16 h-16 bg-[#FAF6EE] text-[#9A7D18] rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                🔍
              </div>
              <h3 className="font-serif font-bold text-lg text-ink mb-1">Produk Tidak Ditemukan</h3>
              <p className="text-sm text-[#766F63] max-w-md mx-auto mb-6">
                Tidak ada produk yang cocok dengan filter atau kata kunci Anda saat ini. Cobalah kurangi filter atau periksa ejaan pencarian Anda.
              </p>
              <Button onClick={handleResetFilters} variant="primary" size="md">
                Kembali ke Semua Koleksi
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  size={prod.is_bundling && selectedCategory === 'paket-bundling' ? 'featured' : 'standard'}
                />
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
