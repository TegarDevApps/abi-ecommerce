import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, demoLogin } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email, password, 'customer');
      if (res.success) {
        navigate('/akun');
      } else {
        setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email dan password Anda.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    demoLogin('customer');
    navigate('/akun');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#FBF8F3]">
      <div className="max-w-md w-full bg-white rounded-modal border border-[#EDE7DE] p-8 shadow-premium relative overflow-hidden">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6B4F3B] via-[#C9A227] to-[#8B6A52]"></div>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF3E0] text-[#8C6A1D] font-bold px-3 py-1 rounded-full border border-[#EBE1C6] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Portal Jamaah & Member
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1F1B16]">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs text-[#766F63] mt-2">
            Nikmati kemudahan berbelanja perlengkapan Umrah & Haji dengan diskon eksklusif dan pelacakan resi real-time.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-[#FFF5F4] border border-[#F5D5D1] text-[#B5473A] text-xs rounded-card flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1.5 uppercase tracking-wide">
              Email Terdaftar
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: ahman.ihsan@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B] focus:ring-1 focus:ring-[#6B4F3B] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B] focus:ring-1 focus:ring-[#6B4F3B] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4F3B] hover:bg-[#4A3527] text-white font-semibold text-sm py-3 rounded-button shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Memvalidasi...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Bypass for Live Presentations & Sandbox Verification */}
        <div className="mt-6 pt-6 border-t border-[#F2EDE5]">
          <button
            onClick={handleDemoBypass}
            type="button"
            className="w-full bg-[#FAF5EE] hover:bg-[#F3ECE0] text-[#6B4F3B] border border-[#E0D7CB] text-xs font-bold py-2.5 rounded-button transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>⚡ Masuk Mode Demo Cepat (Tanpa Ketik)</span>
          </button>
          <p className="text-[11px] text-[#8C8477] text-center mt-1.5">
            Gunakan mode ini jika Anda ingin langsung menelaah fitur belanja tanpa verifikasi email Supabase terlebih dahulu.
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-[#766F63]">
          Belum memiliki akun Jamaah?{' '}
          <Link to="/daftar" className="text-[#B5473A] font-bold hover:underline inline-flex items-center gap-1">
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F2EDE5] text-center">
          <Link to="/admin-login" className="text-[11px] text-[#8C6A1D] font-bold hover:underline">
            ⚙️ Butuh akses pengelola gudang? Ke Portal Login Admin di sini →
          </Link>
        </div>

      </div>
    </div>
  );
};
