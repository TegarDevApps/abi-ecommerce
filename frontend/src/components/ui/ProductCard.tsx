import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  size?: 'standard' | 'featured'; // Section 5.2: Varied sizes in grid instead of rigid 4-col
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, size = 'standard' }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const hasDiscount = product.discount_price !== undefined && product.discount_price !== null && product.discount_price < product.base_price;
  const finalPrice = product.discount_price || product.base_price;
  const savings = hasDiscount ? product.base_price - product.discount_price! : 0;
  const discountPercent = hasDiscount ? Math.round((savings / product.base_price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // If product has multiple variants, navigate to detail page; otherwise add directly
    if (product.variants && product.variants.length > 1) {
      navigate(`/produk/${product.slug}`);
    } else {
      addItem(product, product.variants?.[0], 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFeatured = size === 'featured' || (product.is_bundling && size !== 'standard');

  return (
    <div
      onClick={() => navigate(`/produk/${product.slug}`)}
      className={`group relative flex flex-col rounded-card premium-card-border overflow-hidden cursor-pointer ${
        isFeatured ? 'md:col-span-2 md:flex-row bg-[#FAFAF8]' : 'bg-white'
      }`}
    >
      {/* Photo Showcase with consistent ratio */}
      <div className={`relative overflow-hidden bg-[#F5F2ED] ${isFeatured ? 'md:w-1/2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/5] w-full'}`}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.is_bundling && (
            <Badge variant="gold" size="sm">✨ Paket Lengkap Umrah</Badge>
          )}
          {hasDiscount && !product.is_bundling && (
            <Badge variant="terracotta" size="sm">Hemat {discountPercent}%</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted ? 'bg-primary/90 text-white shadow-md' : 'bg-white/80 text-ink/70 hover:bg-white hover:text-primary'
          }`}
          aria-label="Simpan ke Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Floating Add to Cart Button (smooth fade in on hover) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:block">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-button shadow-premium flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.variants && product.variants.length > 1 ? 'Pilih Varian' : 'Tambah ke Keranjang'}</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className={`flex flex-col flex-1 p-4 md:p-5 justify-between ${isFeatured ? 'md:w-1/2' : ''}`}>
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-[#766F63] mb-1 font-medium">
            <span>{product.brand || 'Ajak Abi Signature'}</span>
            <div className="flex items-center gap-1 text-[#C9A227] font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating_avg.toFixed(1)}</span>
              <span className="text-[#766F63] font-normal">({product.review_count})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-serif text-ink font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors ${isFeatured ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
            {product.name}
          </h3>

          {/* Bundling items recipe breakdown if featured bundle */}
          {product.is_bundling && product.bundling_items.length > 0 && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#FAF6EE] border border-[#EBE3C8]">
              <p className="text-[11px] font-semibold text-[#8B6A52] mb-1.5 uppercase tracking-wider">Isi Dalam Paket:</p>
              <ul className="space-y-1">
                {product.bundling_items.map((bItem, idx) => (
                  <li key={idx} className="text-xs text-ink/85 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="truncate">{bItem.name}</span>
                    <span className="text-[#766F63] text-[11px] ml-auto">({bItem.qty}x)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isFeatured && !product.is_bundling && (
            <p className="text-xs text-[#766F63] line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing Area */}
        <div className="pt-3 border-t border-[#F2EDE5] mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-[#766F63] line-through tabular-price mb-0.5">
                Rp {product.base_price.toLocaleString('id-ID')}
              </span>
            )}
            <div className="flex items-baseline justify-between">
              <span className={`font-bold tabular-price text-ink ${isFeatured ? 'text-lg md:text-2xl' : 'text-base md:text-lg'}`}>
                Rp {finalPrice.toLocaleString('id-ID')}
              </span>
              
              {/* Mobile CTA Icon */}
              <button
                onClick={handleAddToCart}
                className="md:hidden p-2 bg-primary text-white rounded-button shadow-sm active:scale-95"
                aria-label="Tambah ke keranjang"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
