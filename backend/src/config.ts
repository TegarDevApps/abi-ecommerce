import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Zod schema for validating process.env variables
const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().default('local_sandbox'),
  SUPABASE_ANON_KEY: z.string().default('sandbox_anon_key'),
  SUPABASE_SERVICE_KEY: z.string().default('sandbox_service_key'),
  MIDTRANS_SERVER_KEY: z.string().default('SB-Mid-server-AJAKABI2026'),
  MIDTRANS_CLIENT_KEY: z.string().default('SB-Mid-client-AJAKABI2026'),
  MIDTRANS_IS_PRODUCTION: z.string().default('false').transform((val) => val === 'true'),
  BITESHIP_API_KEY: z.string().default('biteship_simulated_key'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables detected by Zod:', parseResult.error.format());
  process.exit(1);
}

export const config = {
  ...parseResult.data,
  isLocalSandbox: parseResult.data.SUPABASE_URL === 'local_sandbox' || !parseResult.data.SUPABASE_URL.startsWith('http'),
};

console.log(`🚀 Environment configured in ${config.isLocalSandbox ? 'LOCAL MOCK SANDBOX' : 'SUPABASE CLOUD'} mode.`);
