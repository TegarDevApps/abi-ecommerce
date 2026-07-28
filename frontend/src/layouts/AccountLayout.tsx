import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, MessageSquare, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AccountLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Explicit instruction: NO heavy admin sidebar dashboard! Lightweight horizontal tabs for online retail experience.
  const tabs = [
    { name: 'Profil Saya', path: '/akun', icon: User, exact: true },
    { name: 'Pesanan & Resi', path: '/akun/pesanan', icon: ShoppingBag },
    { name: 'Alamat Pengiriman', path: '/akun/alamat', icon: MapPin },
    { name: 'Wishlist Favorit', path: '/wishlist', icon: Heart },
    { name: 'Ulasan Saya', path: '/akun/ulasan-saya', icon: MessageSquare },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* User Header Profile Banner */}
      <div className="bg-white rounded-card border border-[#EDE7DE] p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'}
            alt="Customer Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A227]/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-serif font-bold text-xl text-ink">{user?.full_name || 'H. Ahmad Ihsan'}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3EC] text-[#2F643F] px-2.5 py-0.5 rounded-full font-bold border border-[#C5E1CC]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Jamaah Terverifikasi
              </span>
            </div>
            <p className="text-xs text-[#766F63] mt-1">{user?.email || 'customer@gmail.com'} • WhatsApp: {user?.phone || '081987654321'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-button border border-[#DED6CC] text-[#766F63] hover:text-[#B5473A] hover:bg-[#FAF6F4] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Lightweight Horizontal Navigation Tabs (NO Admin Sidebar!) */}
      <div className="border-b border-[#EDE7DE] mb-8 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-2 sm:gap-8 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact 
              ? location.pathname === tab.path 
              : location.pathname.startsWith(tab.path);

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2.5 py-3 px-3 sm:px-1 text-sm font-semibold border-b-2 transition-all select-none ${
                  isActive
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-[#766F63] hover:text-ink hover:border-[#DCD3C6]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A227]' : 'text-[#A39A8E]'}`} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Account Tab Content */}
      <div className="min-h-[400px]">
        <Outlet />
      </div>

    </div>
  );
};
