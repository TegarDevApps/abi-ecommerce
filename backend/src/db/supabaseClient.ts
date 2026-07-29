import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from '../config';
import { db } from './localDb';

// Ensure Node <22 WebSocket compatibility
if (!(global as any).WebSocket) {
  (global as any).WebSocket = ws;
}

export const supabase = !config.isLocalSandbox
  ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY || config.SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws as any },
    })
  : null;

export async function getLiveBanners() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('⚠️ Fallback ke memori lokal untuk banners:', e);
    }
  }
  return db.banners.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getLiveCategories() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('⚠️ Fallback ke memori lokal untuk categories:', e);
    }
  }
  return [...db.categories].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getLiveProductsWithRelations() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)');
      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          ...p,
          category_slug: p.category?.slug || 'umum',
          category_name: p.category?.name || 'Umum'
        }));
      }
    } catch (e) {
      console.warn('⚠️ Fallback ke memori lokal untuk products:', e);
    }
  }
  return db.getProductsWithRelations();
}

export async function getLiveProductBySlug(slug: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .eq('slug', slug)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn(`⚠️ Fallback ke memori lokal untuk product slug ${slug}:`, e);
    }
  }
  return db.getProductBySlug(slug);
}

export async function getLiveReviewsByProductId(productId: string) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn(`⚠️ Fallback ke memori lokal untuk ulasan produk ${productId}`);
    }
  }
  return db.reviews.filter((r) => r.product_id === productId && r.status === 'published');
}
