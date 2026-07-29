import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// Ensure native WebSocket compatibility for Node.js < 22 in backend script
(global as any).WebSocket = ws;

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey || url === 'local_sandbox') {
  console.error('❌ Error: SUPABASE_URL atau SUPABASE_SERVICE_KEY belum valid di file .env');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws as any,
  }
});

async function seedAdmin() {
  const adminEmail = 'admin@ajakabi.com';
  const adminPassword = 'AdminAjakAbi2026!';
  const adminName = 'Ust. Abi Zaki (Owner & Head Admin)';

  console.log(`🕋 Mendaftarkan akun Admin Gudang Resmi ke Supabase Cloud: ${adminEmail}...`);

  try {
    // 1. Create user in auth.users via Admin API (bypassing email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Automatically confirmed!
      user_metadata: {
        full_name: adminName,
        phone: '081234567890',
        role: 'admin',
      },
    });

    if (authError && !authError.message.toLowerCase().includes('already')) {
      throw authError;
    }

    if (authData.user) {
      console.log(`✅ Akun Auth berhasil dibuat dengan ID: ${authData.user.id}`);

      // 2. Ensure public.users has role='admin'
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: authData.user.id,
          email: adminEmail,
          full_name: adminName,
          phone: '081234567890',
          role: 'admin',
          email_verified: true,
        }, { onConflict: 'email' });

      if (dbError) {
        console.warn('⚠️ Gagal sync ke tabel public.users (mungkin trigger otomatis sudah berjalan):', dbError.message);
      } else {
        console.log(`✅ Status akun terkonfirmasi berhak penuh (Role = 'admin') di tabel public.users!`);
      }
    } else {
      console.log(`ℹ️ Akun ${adminEmail} kemungkinan sudah terdaftar sebelumnya di Supabase.`);
      
      // Update role to admin just in case
      await supabaseAdmin
        .from('users')
        .update({ role: 'admin', email_verified: true })
        .eq('email', adminEmail);
      console.log(`✅ Pangkat akun ${adminEmail} dipromosikan menjadi 'admin'.`);
    }

    console.log('\n================================================================');
    console.log('🎉 AKUN ADMIN SIAP DIPAKAI UNTUK LOGIN DI PORTAL ADMIN:');
    console.log(`📧 Email    : ${adminEmail}`);
    console.log(`🔑 Password : ${adminPassword}`);
    console.log('🌐 Portal   : http://localhost:5173/admin-login');
    console.log('================================================================\n');

  } catch (err: any) {
    console.error('❌ Gagal menjalankan seeding admin:', err.message || err);
  }
}

seedAdmin();
