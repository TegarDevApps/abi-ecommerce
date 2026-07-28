import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '../types';

export interface LocalCartItem {
  id: string;
  product_id: string;
  variant_id?: string | null;
  qty: number;
  product: Product;
  variant?: ProductVariant;
}

interface CartState {
  guestSessionId: string;
  items: LocalCartItem[];
  isOpen: boolean; // slide-in drawer state
  isBouncing: boolean; // micro-animation trigger for cart counter
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  triggerBounce: () => void;
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  updateQty: (itemId: string, newQty: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getTotalWeightGrams: () => number;
}

const generateGuestSessionId = () => `guest_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestSessionId: generateGuestSessionId(),
      items: [],
      isOpen: false,
      isBouncing: false,
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set({ isOpen: !get().isOpen }),
      triggerBounce: () => {
        set({ isBouncing: true });
        setTimeout(() => set({ isBouncing: false }), 450);
      },
      addItem: (product, variant, qty = 1) => {
        const items = [...get().items];
        const existIdx = items.findIndex(
          (i) => i.product_id === product.id && (i.variant_id || null) === (variant?.id || null)
        );

        if (existIdx !== -1) {
          items[existIdx].qty += qty;
        } else {
          items.push({
            id: `${product.id}_${variant?.id || 'base'}_${Date.now()}`,
            product_id: product.id,
            variant_id: variant?.id || null,
            qty,
            product,
            variant,
          });
        }

        set({ items });
        get().triggerBounce();
        // Automatically slide open the drawer for immediate satisfying gratification
        set({ isOpen: true });
      },
      updateQty: (itemId, newQty) => {
        if (newQty <= 0) {
          get().removeItem(itemId);
          return;
        }
        const items = get().items.map((i) => (i.id === itemId ? { ...i, qty: newQty } : i));
        set({ items });
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const base = item.product.discount_price ?? item.product.base_price;
          const adjustment = item.variant?.price_adjustment || 0;
          return sum + (base + adjustment) * item.qty;
        }, 0);
      },
      getTotalWeightGrams: () => {
        return get().items.reduce((sum, item) => sum + (item.product.weight_grams || 500) * item.qty, 0);
      },
    }),
    {
      name: 'ajak-abi-store-guest-cart',
      partialize: (state) => ({ guestSessionId: state.guestSessionId, items: state.items }),
    }
  )
);
