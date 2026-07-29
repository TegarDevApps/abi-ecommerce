import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserPlus, Mail, Lock, User, Phone, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export const CustomerRegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await register(email, password, fullName, phone, 'customer');
      if (res.success) {
        setRegisteredSuccess(true);
        setNeedsVerify(!!res.needVerification);
        if (!res.needVerification) {
          setTimeout(() => {
            navigate('/akun');
          }, 2000);
        }
      } else {
        setErrorMsg(res.error || 'Pendaftaran gagal dilakukan. Coba gunakan email lain.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#FBF8F3]">
        <div className="max-w-md w-full bg-white rounded-modal border border-[#EDE7DE] p-8 text-center shadow-premium relative">
          <div className="w-16 h-16 bg-[#EAF3EC] text-[#2F643F] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C5E1CC]">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <h2 className="font-serif text-2xl font-bold text-[#1F1B16]">
            Alhamdulillah, Akun Berhasil Dibuat!
          </h2>

          {needsVerify ? (
            <div className="mt-4 p-5 bg-[#FAF3E0] border border-[#EBE1C6] rounded-card text-left text-xs text-[#8C6A1D] space-y-2">
              <p className="font-bold text-sm text-[#5C4511] flex items-center gap-2">
                <span>✉️ Verifikasi Email Diperlukan!</span>
              </p>
              <p>
                Kami telah mengirimkan tautan konfirmasi dari server Supabase ke inbox email Anda (<strong>{email}</strong>).
              </p>
              <p className="pt-1 font-semibold">
                Silakan buka email Anda dan klik link verifikasi tersebut untuk mulai bertransaksi dengan perlindungan penuh.
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#766F63] mt-2">
              Akun Anda siap digunakan. Mengalihkan ke dasbor profil Anda dalam detik...
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-[#F2EDE5]">
            <Link
              to="/masuk"
              className="inline-block w-full bg-[#6B4F3B] text-white font-semibold text-xs py-3 rounded-button shadow-sm hover:bg-[#4A3527] transition-colors"
            >
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#FBF8F3]">
      <div className="max-w-md w-full bg-white rounded-modal border border-[#EDE7DE] p-8 shadow-premium relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C9A227] via-[#6B4F3B] to-[#8B6A52]"></div>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3EC] text-[#2F643F] font-bold px-3 py-1 rounded-full border border-[#C5E1CC] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Registrasi Jamaah Baru
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1F1B16]">
            Daftar Ajak Abi Store
          </h1>
          <p className="text-xs text-[#766F63] mt-1.5">
            Lengkapi data diri Anda untuk mempercepat pesanan perlengkapan umrah berkualitas tinggi.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-[#FFF5F4] border border-[#F5D5D1] text-[#B5473A] text-xs rounded-card flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1 uppercase tracking-wide">
              Nama Lengkap (Sesuai Paspor / KTP)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="contoh: H. Ahmad Ihsan Mabrur"
                className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1 uppercase tracking-wide">
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="contoh: 081234567890"
                className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1 uppercase tracking-wide">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: ihsan@gmail.com"
                className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F1B16] mb-1 uppercase tracking-wide">
              Buat Password Kuat
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A49D92]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#DED6CC] rounded-input text-sm text-[#1F1B16] placeholder-[#A49D92] focus:outline-none focus:border-[#6B4F3B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A227] hover:bg-[#A9841C] text-white font-bold text-sm py-3 rounded-button shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Mendaftarkan...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Sekarang & Kirim Email Verifikasi</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#766F63] pt-6 border-t border-[#F2EDE5]">
          Sudah terdaftar sebagai Jamaah?{' '}
          <Link to="/masuk" className="text-[#6B4F3B] font-bold hover:underline">
            Masuk di sini →
          </Link>
        </div>

      </div>
    </div>
  );
};
