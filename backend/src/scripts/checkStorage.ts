import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

(global as any).WebSocket = ws;

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey || url === 'local_sandbox') {
  console.error('❌ Error: SUPABASE_URL atau SUPABASE_SERVICE_KEY belum valid');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws as any }
});

async function exploreStorage() {
  console.log('📡 Menghubungi Supabase Storage Cloud Anda...');
  const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
  if (bucketError) {
    console.error('❌ Gagal membaca bucket:', bucketError.message);
    return;
  }
  console.log(`📦 Terdeteksi ${buckets.length} Buckets:`);
  for (const bucket of buckets) {
    console.log(`  📁 Bucket Name: "${bucket.name}" (Public: ${bucket.public})`);
    
    // List root files/folders in bucket
    const { data: files, error: fileError } = await supabaseAdmin.storage.from(bucket.name).list('', { limit: 100 });
    if (fileError) {
      console.warn(`    ⚠️ Gagal list files di ${bucket.name}: ${fileError.message}`);
      continue;
    }
    if (files) {
      for (const file of files) {
        if (file.metadata === null || (file as any).id === null) {
          console.log(`    📂 Folder: /${file.name}/`);
          // Explore folder inside
          const { data: subfiles } = await supabaseAdmin.storage.from(bucket.name).list(file.name, { limit: 100 });
          if (subfiles) {
            for (const sub of subfiles) {
              const publicUrl = supabaseAdmin.storage.from(bucket.name).getPublicUrl(`${file.name}/${sub.name}`).data.publicUrl;
              console.log(`      🖼️ Foto: ${sub.name} -> ${publicUrl}`);
            }
          }
        } else {
          const publicUrl = supabaseAdmin.storage.from(bucket.name).getPublicUrl(file.name).data.publicUrl;
          console.log(`    🖼️ Foto/File: ${file.name} -> ${publicUrl}`);
        }
      }
    }
  }
  
  console.log('\n📊 Mengecek jumlah produk di database real Supabase Anda (tabel public.products)...');
  const { data: prods, error: prodErr, count } = await supabaseAdmin.from('products').select('id, name, sku', { count: 'exact' });
  if (prodErr) {
    console.log('⚠️ Tabel products belum terisi atau belum bisa dibaca:', prodErr.message);
  } else {
    console.log(`✅ Terdapat ${prods?.length || 0} produk saat ini di tabel Live Supabase.`);
    prods?.forEach((p: any, i: number) => console.log(`  ${i+1}. [${p.sku}] ${p.name}`));
  }
}

exploreStorage();
