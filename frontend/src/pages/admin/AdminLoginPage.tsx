import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, Lock, Mail, KeyRound, AlertTriangle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, demoLogin } = useAuthStore();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Specifically assert requiredRole as 'admin'
      const res = await login(email, password, 'admin');
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.error || 'Autentikasi gagal! Pastikan akun ini diberdayakan dengan hak Admin Operasional.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    demoLogin('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#1A1612] text-[#EDE7DE] flex items-center justify-center px-4 sm:px-6 py-12 font-sans selection:bg-[#C9A227]/30">
      <div className="max-w-md w-full bg-[#2C241D] rounded-modal border-2 border-[#C9A227]/40 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glowing Gold Executive Border Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C9A227] via-[#F4E9C1] to-[#C9A227]"></div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#3E332B] border border-[#52443A] flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="inline-block text-[11px] font-extrabold bg-[#C9A227] text-white px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Konsol Operasional Gudang & Owner
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
            Portal Khusus Admin
          </h1>
          <p className="text-xs text-[#B5A89B] mt-2">
            Akses dibatasi. Portal ini dipisahkan secara ketat dari pendaftaran customer/member reguler.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-[#B5473A]/20 border border-[#B5473A] text-[#F3C5C0] text-xs rounded-card flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#E87568] mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#E2D9CD] mb-1.5 uppercase tracking-wide">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6D]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ajakabi.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1914] border border-[#4A3C30] rounded-input text-sm text-white placeholder-[#706357] focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E2D9CD] mb-1.5 uppercase tracking-wide">
              Password Keamanan
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6D]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1914] border border-[#4A3C30] rounded-input text-sm text-white placeholder-[#706357] focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A227] hover:bg-[#A9841C] text-[#1F1B16] font-extrabold text-sm py-3 rounded-button shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {loading ? (
              <span>Memeriksa Hak Akses...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Masuk ke Konsol Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Bypass for Testing */}
        <div className="mt-6 pt-6 border-t border-[#3E332B]">
          <button
            onClick={handleDemoBypass}
            type="button"
            className="w-full bg-[#3E332B] hover:bg-[#4E4137] text-[#C9A227] border border-[#625246] text-xs font-extrabold py-2.5 rounded-button transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Masuk Mode Demo Admin (Tanpa Kredensial Cloud)</span>
          </button>
          <p className="text-[11px] text-[#8C7C6D] text-center mt-1.5">
            Klik di sini jika Anda sedang bereksperimen di tahap pengembangan lokal untuk membuka panel manajemen pesanan.
          </p>
        </div>

        <div className="mt-8 text-center pt-6 border-t border-[#3E332B]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-[#B5A89B] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Etalase Customer</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
