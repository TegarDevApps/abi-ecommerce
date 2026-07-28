import { Server as HttpServer } from 'http';
import { Server as WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;
const clients: Set<WebSocket> = new Set();

export const initWebSocketServer = (httpServer: HttpServer) => {
  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('📡 [WebSocket] New client connected for real-time notifications.');
    clients.add(ws);

    // Send welcome / ping message
    ws.send(JSON.stringify({ type: 'CONNECTION_ESTABLISHED', message: 'Connected to Ajak Abi Store Realtime Feed' }));

    ws.on('close', () => {
      clients.delete(ws);
      console.log('📡 [WebSocket] Client disconnected.');
    });

    ws.on('error', (err) => {
      console.error('📡 [WebSocket Error]:', err);
      clients.delete(ws);
    });
  });

  console.log('🚀 [WebSocket Server] Initialized on /ws endpoint.');
};

export const broadcastOrderStatus = (orderId: string, orderNumber: string, status: string, notes?: string) => {
  const payload = JSON.stringify({
    type: 'ORDER_STATUS_UPDATED',
    data: {
      orderId,
      orderNumber,
      status,
      notes,
      updated_at: new Date().toISOString(),
    }
  });

  let sentCount = 0;
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
      sentCount++;
    }
  });

  console.log(`📡 [Realtime Broadcast] Sent Order Update (${orderNumber} -> ${status}) to ${sentCount} active client(s).`);
};
