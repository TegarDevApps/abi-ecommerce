import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, ShieldCheck, Award, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.full_name || 'H. Ahmad Ihsan');
  const [email, setEmail] = useState(user?.email || 'customer@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '081987654321');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profil Anda berhasil diperbarui di sistem database!');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EFECE6] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#FAF6F0] text-primary rounded-xl font-bold">📦</div>
          <div>
            <span className="text-xs text-[#766F63] block">Total Transaksi</span>
            <span className="font-serif font-bold text-lg text-ink">4 Pesanan</span>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-white border border-[#EFECE6] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#FAF6EE] text-[#C9A227] rounded-xl font-bold">👑</div>
          <div>
            <span className="text-xs text-[#766F63] block">Status Jamaah</span>
            <span className="font-serif font-bold text-lg text-ink">Platinum Member</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EFECE6] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#EAF3EC] text-[#2F643F] rounded-xl font-bold">✔</div>
          <div>
            <span className="text-xs text-[#766F63] block">Keamanan Akun</span>
            <span className="font-serif font-bold text-lg text-[#2F643F]">Terverifikasi 2FA</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-card border border-[#EFECE6] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-[#F2EDE5]">
          <h3 className="font-serif text-xl font-bold text-ink">Informasi Pribadi & Kontak</h3>
          <p className="text-xs text-[#766F63] mt-0.5">Informasi ini akan diisi secara otomatis sebagai penerima pada saat checkout pesanan baru.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">Nama Lengkap Sesuai KTP/Paspor:</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-sm font-semibold text-ink outline-none"
                required
              />
              <User className="w-4 h-4 absolute left-3 top-3.5 text-[#968F83]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">Alamat Email Utama:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-sm font-semibold text-ink outline-none"
                required
              />
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#968F83]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">No. WhatsApp & SMS Notification:</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#DCD3C5] focus:border-primary rounded-xl py-2.5 pl-9 pr-3 text-sm font-semibold text-ink outline-none"
                required
              />
              <Phone className="w-4 h-4 absolute left-3 top-3.5 text-[#968F83]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">Tanggal Bergabung:</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value="12 Oktober 2024 (Jamaah Aktif)"
                className="w-full bg-[#F3F0EC] border border-[#DCD3C5] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#766F63] outline-none cursor-not-allowed font-medium"
              />
              <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-[#968F83]" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F2EDE5] flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold shadow-md px-8"
          >
            Simpan Perubahan Profil
          </Button>
        </div>
      </form>

    </div>
  );
};
