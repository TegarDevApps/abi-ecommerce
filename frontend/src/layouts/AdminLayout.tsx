import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Tag,
  MessageSquare,
  Users,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Search,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, toggleRole, logout } = useAuthStore();

  const navItems = [
    { title: 'Overview & Analisis', path: '/admin', icon: LayoutDashboard },
    { title: 'Manajemen Produk', path: '/admin/produk', icon: Package },
    { title: 'Manajemen Pesanan', path: '/admin/pesanan', icon: ShoppingCart, badge: 'Baru' },
    { title: 'Log Pembayaran', path: '/admin/pembayaran', icon: DollarSign },
    { title: 'Voucher & Diskon', path: '/admin/promo', icon: Tag },
    { title: 'Moderasi Ulasan', path: '/admin/ulasan', icon: MessageSquare },
    { title: 'Data Pelanggan', path: '/admin/pelanggan', icon: Users },
    { title: 'CMS Konten & Banner', path: '/admin/konten', icon: ImageIcon },
    { title: 'Laporan Penjualan', path: '/admin/laporan', icon: FileText },
    { title: 'Audit Log Sistem', path: '/admin/audit-log', icon: ShieldAlert },
  ];

  const handleSwitchToStore = () => {
    toggleRole();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#1F1B16] flex flex-col md:flex-row font-sans">
      
      {/* Fixed Left Sidebar Console */}
      <aside className="w-full md:w-64 bg-[#2C241D] text-[#EDE7DE] flex flex-col shrink-0 border-r border-[#3E332B] md:sticky md:top-0 md:h-screen shadow-lg z-30">
        
        {/* Brand Top */}
        <div className="p-5 border-b border-[#40352D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227] flex items-center justify-center font-serif font-bold text-ink text-base shadow">
              AA
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white tracking-tight">Admin Portal</h2>
              <span className="text-[11px] text-[#A69B8F] block uppercase tracking-wider">Ajak Abi Store</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="text-[10px] font-bold text-[#A69B8F] uppercase tracking-widest mb-2 px-2">
            Modul Manajemen
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between py-2.5 px-3.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#6B4F3B] text-white font-bold shadow-md border-l-4 border-[#C9A227]'
                    : 'text-[#C2B8AB] hover:bg-[#3E332B] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A227]' : 'text-[#A69B8F]'}`} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-[#C9A227] text-[#1F1B16] text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Switcher & Profile */}
        <div className="p-4 border-t border-[#40352D] bg-[#221B16] space-y-3">
          <button
            onClick={handleSwitchToStore}
            className="w-full py-2.5 px-3 rounded-lg bg-[#C9A227] hover:bg-[#B38F1F] text-[#1F1B16] text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ke Toko Online (Store)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2 truncate">
              <img src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100'} alt="Admin" className="w-7 h-7 rounded-full object-cover border border-[#C9A227]" />
              <div className="truncate">
                <span className="font-semibold text-white block truncate">{user?.full_name || 'Ust. Abi Zaki'}</span>
                <span className="text-[10px] text-[#A69B8F]">Owner / Sysadmin</span>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-1.5 hover:bg-[#3E332B] text-[#A69B8F] hover:text-[#B5473A] rounded transition-colors"
              title="Keluar dari Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Admin Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E6E0D5] flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-lg font-bold text-ink">
              {navItems.find((i) => i.path === location.pathname)?.title || 'Panel Manajemen'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-[#EAF3EC] text-[#2F643F] font-semibold px-2 py-0.5 rounded-full border border-[#C5E1CC]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>System Realtime Connected</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Cari invoice #AAS, nama produk..."
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#968F83]" />
            </div>
            <button className="relative p-2 text-[#766F63] hover:text-ink hover:bg-[#FAF8F5] rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B5473A]"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
