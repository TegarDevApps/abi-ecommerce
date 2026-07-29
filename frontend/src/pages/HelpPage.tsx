import React, { useState } from 'react';
import { HelpCircle, ShoppingBag, Truck, CreditCard, ShieldCheck, ChevronDown, ChevronUp, MessageCircle, CheckCircle2 } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Pilih Produk & Varian Ibadah',
      desc: 'Jelajahi etalase Ajak Abi Store mulai dari Air Zam-Zam murni, Ihram serat bambu organik, hingga Koper Sultan 24". Klik tombol "Tambah ke Keranjang" pada produk pilihan Anda.',
      icon: ShoppingBag
    },
    {
      step: '02',
      title: 'Isi Alamat & Pilih Ongkos Kirim Realtime',
      desc: 'Masuk ke halaman Checkout, masukkan nama serta alamat pengiriman Anda di seluruh Indonesia. Tarif ongkos kirim ekspedisi (Biteship/RajaOngkir) akan terkalkulasi secara otomatis.',
      icon: Truck
    },
    {
      step: '03',
      title: 'Pembayaran Aman via Virtual Account & QRIS',
      desc: 'Selesaikan transaksi melalui sistem Midtrans / Xendit terotentikasi. Tersedia bank transfer (BCA, BSI, Mandiri VA), E-Wallet QRIS (GoPay/OVO), serta simulasi pembayaran langsung.',
      icon: CreditCard
    },
    {
      step: '04',
      title: 'Pesanan Diproses & Dilacak Realtime',
      desc: 'Setelah pembayaran berhasil terkonfirmasi server (settled), nomor resi pengiriman instan dikeluarkan dan pesanan Anda akan segera dipacking khusus bergaransi anti-pecah.',
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      q: 'Apakah Air Zam-Zam yang dijual di Ajak Abi Store 100% Original & Murni?',
      a: 'Betul sekali. Air Zam-Zam kami dijamin 100% otentik asal Mata Air Zam-Zam Mekkah yang diimpor melalui jalur rasmi Bandara Internasional King Abdulaziz Jeddah dengan segel utuh berpita barcode dari National Water Company Mekkah. Kami memberikan Garansi Uang Kembali 100% jika terbukti tidak asli.'
    },
    {
      q: 'Apa keunggulan Kain Ihram Serat Bambu berbanding kain biasa?',
      a: 'Kain Ihram Serat Bambu Organik 100% kami dirajut khusus berdaya serat 450 GSM tanpa jahitan yang memenuhi kaidah syari. Teknologi serat bambu memiliki rongga ventilasi super sejuk (cooling effect) dan dapat menyerap keringat 3x lebih baik di bawah terik matahari Tanah Suci.'
    },
    {
      q: 'Bagaimana cara kerja TSA Lock pada Koper Umrah Sultan 24 Inch?',
      a: 'Koper Sultan 24 Inch dilengkapi sistem kombinasi pengaman ganda berstandar Internasional TSA (Transportation Security Administration). Petugas bandara internasional dapat memeriksa bagasi secara resmi menggunakan kunci khusus tanpa merusak kerangka alumunium koper Anda.'
    },
    {
      q: 'Apakah saya perlu mendaftar akun terlebih dahulu sebelum berbelanja (Guest Checkout)?',
      a: 'Anda bisa langsung berbelanja tanpa login dengan memanfaatkan fitur Guest Session Cart kami! Namun, mendaftarkan akun jamaah resmi memberikan keuntungan kelola riwayat pesanan seumur hidup, akses voucher eksklusif, serta tingkatan tier VIP (Platinum Mabrur).'
    },
    {
      q: 'Bagaimana jika barang yang diterima rusak, cacat pengiriman, atau tertabrak bagasi?',
      a: 'Semua pesanan dilindungi Asuransi Pengiriman Ajak Abi Shield. Cukup rekam video unboxing saat paket tiba dan laporkan kepada Tim Customer Service WA kami dalam waktu 3x24 jam untuk pengantian produk baru tanpa biaya tambahan.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 text-[#1F1B16]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE6] border border-[#D8D0C5] text-xs font-serif font-bold text-[#C45E38] uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" /> Pusat Bantuan & Edukasi Jamaah
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1B16] leading-tight">
            Cara Mudah Berbelanja & Pertanyaan Umum (FAQ)
          </h1>
          <p className="mt-4 text-base text-[#726B5B] font-sans">
            Panduan lengkap melakukan pemesanan perlengkapan haji dan umrah bermutu tinggi di Ajak Abi Store dengan kenyamanan dan keamanan berstandar syariah.
          </p>
        </div>

        {/* 4 Steps Walkthrough */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl font-bold text-[#1F1B16] mb-8 text-center sm:text-left flex items-center gap-3">
            <span className="w-2.5 h-7 bg-[#C45E38] rounded-full inline-block"></span>
            4 Langkah Mudah Berbelanja Hingga Paket Sampai di Rumah
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#D8D0C5] shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all hover:border-[#C45E38]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-serif font-bold text-3xl text-[#D4AF37] opacity-80">{item.step}</span>
                    <div className="p-3 bg-[#FAF8F5] text-[#C45E38] rounded-xl border border-[#EFECE6]">
                      <item.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1F1B16] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#726B5B] leading-relaxed font-sans">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#EFECE6] flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Dilindungi Sistem Realtime
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D8D0C5] shadow-sm mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#1F1B16] mb-2">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-sm text-[#726B5B]">
              Temukan jawaban cepat mengenai kualitas material produk, keaslian Air Zam-Zam, hingga garansi toko kami.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#EFECE6] rounded-2xl overflow-hidden transition-all bg-[#FAF8F5]/50 hover:bg-[#FAF8F5]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="font-serif font-bold text-base text-[#1F1B16]">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#D8D0C5] flex items-center justify-center text-[#C45E38] shrink-0 shadow-xs">
                    {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-6 pt-1 text-sm text-[#5C5549] leading-relaxed border-t border-[#EFECE6]/60 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Consultation Banner */}
        <div className="bg-[#2C241D] text-[#EDE7DE] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#40352D] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Masih Punya Pertanyaan atau Ingin Pemesanan Khusus Rombongan?
            </h3>
            <p className="text-sm text-[#A8A196] font-sans">
              Tim Konsultan Umrah & Layanan Pelanggan kami siap membantu Anda 7 hari dalam seminggu via WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-[#C45E38] hover:bg-[#B34E2A] text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp CS →
          </a>
        </div>

      </div>
    </div>
  );
};
