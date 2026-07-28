import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  phone: string;
  avatar_url: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  activeRole: 'customer' | 'admin';
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  toggleRole: () => void;
  logout: () => void;
}

const customerDemo: AuthUser = {
  id: 'c0000000-0000-0000-0000-000000000001',
  email: 'customer@gmail.com',
  full_name: 'H. Ahmad Ihsan',
  role: 'customer',
  phone: '081987654321',
  avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
};

const adminDemo: AuthUser = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: 'admin@ajakabi.com',
  full_name: 'Ust. Abi Zaki (Owner)',
  role: 'admin',
  phone: '081234567890',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: customerDemo,
      isAuthenticated: true,
      activeRole: 'customer',
      loginAsCustomer: () => set({ user: customerDemo, isAuthenticated: true, activeRole: 'customer' }),
      loginAsAdmin: () => set({ user: adminDemo, isAuthenticated: true, activeRole: 'admin' }),
      toggleRole: () => {
        if (get().activeRole === 'customer') {
          get().loginAsAdmin();
        } else {
          get().loginAsCustomer();
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'ajak-abi-auth-session',
    }
  )
);
