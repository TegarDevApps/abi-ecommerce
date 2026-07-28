import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Clock, Smartphone, Building2, QrCode, AlertCircle, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';

interface MidtransSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: number;
  snapToken?: string;
  onSuccess: () => void;
}

export const MidtransSimulatorModal: React.FC<MidtransSimulatorModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  snapToken = 'SANDBOX-TOKEN-SIMULATION',
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'va_mandiri' | 'va_bca' | 'qris' | 'gopay'>('va_mandiri');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const vaNumbers = {
    va_mandiri: '89600 0812 3456 7890',
    va_bca: '12800 0819 8765 4321',
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const methodLabel =
        activeTab === 'va_mandiri' ? 'Midtrans Snap - Virtual Account Mandiri' :
        activeTab === 'va_bca' ? 'Midtrans Snap - Virtual Account BCA' :
        activeTab === 'qris' ? 'Midtrans Snap - QRIS Interactive Scan' :
        'Midtrans Snap - GoPay Wallet';

      await api.simulatePaymentSuccess(orderNumber, methodLabel);

      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1200);
    } catch (err) {
      alert('Gagal menyimulasikan pembayaran sandbox. Silakan coba lagi.');
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in-up font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-[24px] shadow-2xl overflow-hidden border border-[#DCD3C5] flex flex-col max-h-[92vh]">
        
        {/* Midtrans Header Banner */}
        <div className="bg-[#002855] text-white p-6 pb-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[#002855] flex flex-col items-center justify-center font-black leading-none text-xs shadow-inner">
              <span>SNAP</span>
              <span className="text-[9px] font-semibold">SANDBOX</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-wide">Midtrans Secure Gateway</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">Order Invoice: <strong>{orderNumber}</strong></p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-blue-200 block">Total Tagihan:</span>
            <span className="text-lg font-black tabular-price text-amber-300">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Sandbox Notice Banner */}
        <div className="bg-amber-50 text-amber-900 px-6 py-2.5 border-b border-amber-200 flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Ini adalah mode simulasi Sandbox resmi. Anda tidak memerlukan transfer uang sungguhan untuk memverifikasi order ini!</span>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#766F63] block mb-2.5">
              Pilih Kanal Pembayaran Simulasi:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'va_mandiri', label: 'Mandiri VA', icon: Building2 },
                { id: 'va_bca', label: 'BCA VA', icon: Building2 },
                { id: 'qris', label: 'QRIS Scan', icon: QrCode },
                { id: 'gopay', label: 'GoPay / OVO', icon: Smartphone },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      active
                        ? 'border-[#002855] bg-blue-50/70 text-[#002855] font-bold shadow'
                        : 'border-[#E5E0D8] bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#E2DCD2] space-y-4">
            
            {(activeTab === 'va_mandiri' || activeTab === 'va_bca') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#59524B]">
                  <span>Nomor Virtual Account {activeTab === 'va_mandiri' ? 'Bank Mandiri' : 'Bank BCA'}:</span>
                  <span className="text-[#3E7B4F] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif dicek otomatis
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#D5CEC4] shadow-inner">
                  <span className="font-mono text-xl font-extrabold tracking-widest text-[#002855]">
                    {vaNumbers[activeTab as keyof typeof vaNumbers]}
                  </span>
                  <button
                    onClick={() => handleCopy(vaNumbers[activeTab as keyof typeof vaNumbers])}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Tersalin!' : 'Salin No VA'}</span>
                  </button>
                </div>

                <div className="text-xs text-[#766F63] space-y-1.5 border-t border-[#EAE3D8] pt-3">
                  <p className="font-bold text-ink">Petunjuk Simulasi Sandbox:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Di lingkungan produksi, pelanggan membuka m-Banking (Livin' / myBCA) dan mamasukkan kode di atas.</li>
                    <li>Untuk testing lokal ini, cukup tekan tombol <strong>"Simulasikan Pembayaran Berhasil"</strong> di bawah.</li>
                    <li>Sistem WebSockets backend akan langsung bereaksi dan mengubah status dari <em>Menunggu Pembayaran</em> menjadi <em>Diproses</em>.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'qris' && (
              <div className="text-center space-y-4 py-2">
                <p className="text-xs font-bold text-ink">Scan kode QRIS ini dengan aplikasi m-Banking atau e-Wallet (BCA Mobile, Livin, GoPay, OVO, Dana):</p>
                <div className="w-48 h-48 mx-auto bg-white p-3.5 rounded-2xl border-2 border-[#C9A227] shadow-lg flex flex-col items-center justify-center">
                  <QrCode className="w-36 h-36 text-[#1F1B16]" />
                  <span className="text-[10px] font-bold text-[#8B6A52] mt-1">AJAK ABI STORE — QRIS</span>
                </div>
                <p className="text-xs text-[#766F63] italic">
                  *Simulasi Webhook memverifikasi pembayaran seketika tanpa scan kamera sungguhan.
                </p>
              </div>
            )}

            {activeTab === 'gopay' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-green-500 text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
                  G
                </div>
                <h4 className="font-bold text-base text-ink">Konfirmasi via GoPay / OVO App</h4>
                <p className="text-xs text-[#766F63] max-w-sm mx-auto">
                  Tautan Deep Link akan mengarahkan pelanggan membuka aplikasi dompet digital langsung dari smartphone mereka.
                </p>
              </div>
            )}
          </div>

          {/* SIMULATE SUCCESS BUTTON (Main testing gratification!) */}
          <div className="pt-2 space-y-3">
            <Button
              onClick={handleSimulatePayment}
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              className="py-4 text-base font-extrabold shadow-xl bg-[#002855] hover:bg-[#001D3E] text-white"
            >
              ✅ Simulasikan Pembayaran Berhasil (Sandbox Webhook)
            </Button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-2.5 text-xs font-bold text-[#766F63] hover:text-[#B5473A] text-center transition-colors"
            >
              Kembali & Bayar Nanti (Simpan di Daftar Pesanan Menunggu Pembayaran)
            </button>
          </div>

          {/* SSL Trust Footer */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#766F63] pt-2 border-t border-[#EAE3D8]">
            <Lock className="w-3.5 h-3.5 text-[#3E7B4F]" />
            <span>Encrypted 256-Bit TLS by Midtrans Sandbox Security • Token: {snapToken.substring(0, 15)}...</span>
          </div>

        </div>

      </div>
    </div>
  );
};
