import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  phone: string;
  avatar_url: string;
  email_verified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  activeRole: 'customer' | 'admin';
  initAuth: () => Promise<void>;
  login: (email: string, password: string, requiredRole: 'customer' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, phone: string, role?: 'customer' | 'admin') => Promise<{ success: boolean; needVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  // For quick local preview when offline or if user wants to bypass login during presentation
  demoLogin: (role: 'customer' | 'admin') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoadingAuth: true,
      activeRole: 'customer',

      initAuth: async () => {
        set({ isLoadingAuth: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            const u = session.user;
            const meta = u.user_metadata || {};
            const inferredRole: 'customer' | 'admin' = (meta.role === 'admin' || u.email?.includes('admin')) ? 'admin' : 'customer';
            
            set({
              isAuthenticated: true,
              activeRole: inferredRole,
              user: {
                id: u.id,
                email: u.email || '',
                full_name: meta.full_name || u.email?.split('@')[0] || 'Member Ajak Abi',
                role: inferredRole,
                phone: meta.phone || '08123456789',
                avatar_url: meta.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                email_verified: !!u.email_confirmed_at || u.confirmed_at !== undefined,
              },
            });
          } else {
            const cur = useAuthStore.getState().user;
            if (!cur?.id?.startsWith('a0000000') && !cur?.id?.startsWith('c0000000')) {
              set({ user: null, isAuthenticated: false });
            }
          }
        } catch (err) {
          console.error('Supabase Auth init error:', err);
        } finally {
          set({ isLoadingAuth: false });
        }

        // Listen for realtime auth changes (like clicking verification email in browser)
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session && session.user) {
            const u = session.user;
            const meta = u.user_metadata || {};
            const inferredRole: 'customer' | 'admin' = (meta.role === 'admin' || u.email?.includes('admin')) ? 'admin' : 'customer';
            set({
              isAuthenticated: true,
              activeRole: inferredRole,
              user: {
                id: u.id,
                email: u.email || '',
                full_name: meta.full_name || u.email?.split('@')[0] || 'Member Ajak Abi',
                role: inferredRole,
                phone: meta.phone || '08123456789',
                avatar_url: meta.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                email_verified: !!u.email_confirmed_at,
              },
            });
          } else {
            const cur = useAuthStore.getState().user;
            if (!cur?.id?.startsWith('a0000000') && !cur?.id?.startsWith('c0000000')) {
              set({ user: null, isAuthenticated: false });
            }
          }
        });
      },

      login: async (email, password, requiredRole) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            return { success: false, error: error.message || 'Email atau password salah.' };
          }
          if (data.user) {
            const meta = data.user.user_metadata || {};
            const userRole: 'customer' | 'admin' = (meta.role === 'admin' || data.user.email?.includes('admin')) ? 'admin' : 'customer';

            // Role segregation check
            if (requiredRole === 'admin' && userRole !== 'admin') {
              await supabase.auth.signOut();
              return { success: false, error: 'Akses Ditolak! Akun Anda terdaftar sebagai Customer biasa, bukan Admin Operasional Gudang.' };
            }

            set({
              isAuthenticated: true,
              activeRole: userRole,
              user: {
                id: data.user.id,
                email: data.user.email || '',
                full_name: meta.full_name || data.user.email?.split('@')[0] || 'Member Ajak Abi',
                role: userRole,
                phone: meta.phone || '08123456789',
                avatar_url: meta.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                email_verified: !!data.user.email_confirmed_at,
              }
            });
            return { success: true };
          }
          return { success: false, error: 'User tidak ditemukan.' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Gagal terhubung ke server Supabase.' };
        }
      },

      register: async (email, password, fullName, phone, role = 'customer') => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
                role: role,
              }
            }
          });
          if (error) {
            return { success: false, error: error.message };
          }
          if (data.user) {
            // Check if email verification is pending
            if (!data.user.email_confirmed_at && data.session === null) {
              return { success: true, needVerification: true };
            }
            return { success: true, needVerification: false };
          }
          return { success: false, error: 'Pendaftaran gagal.' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Terjadi kesalahan sistem.' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      demoLogin: (role) => {
        const mock: AuthUser = role === 'admin' ? {
          id: 'a0000000-0000-0000-0000-000000000001',
          email: 'admin@ajakabi.com',
          full_name: 'Ust. Abi Zaki (Admin Demo)',
          role: 'admin',
          phone: '081234567890',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          email_verified: true,
        } : {
          id: 'c0000000-0000-0000-0000-000000000001',
          email: 'customer@gmail.com',
          full_name: 'H. Ahmad Ihsan (Customer Demo)',
          role: 'customer',
          phone: '081987654321',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          email_verified: true,
        };
        set({ user: mock, isAuthenticated: true, activeRole: role });
      },
    }),
    {
      name: 'ajak-abi-auth-session-v2',
    }
  )
);
