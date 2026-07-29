import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { apiRouter } from './routes/api';
import { initWebSocketServer } from './websocket/wsServer';

const app: Express = express();
const httpServer = http.createServer(app);

// Initialize WebSocket Server for Real-Time Order Updates
initWebSocketServer(httpServer);

// Middleware
app.use(cors({
  origin: '*', // For local dev and preview comfort
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    name: 'Ajak Abi Store Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
    storageMode: config.isLocalSandbox ? 'Local Mock Sandbox DB' : 'Supabase Cloud Postgres',
  });
});

// Mount main e-commerce API Router
app.use('/api', apiRouter);

// Global 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.originalUrl} tidak Ditemukan` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 [Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

// Start Server only if NOT running in Vercel Serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = config.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log('================================================================');
    console.log(`✨ [Ajak Abi Store] Backend API Server running on port ${PORT}`);
    console.log(`🌐 HTTP URL:      http://localhost:${PORT}/api`);
    console.log(`📡 WebSocket URL: ws://localhost:${PORT}/ws`);
    console.log('================================================================');
  });
}

// Export for Vercel Serverless Functions
export default app;
