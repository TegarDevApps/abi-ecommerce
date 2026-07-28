import axios from 'axios';

// Backend URL fallback for local Vite dev vs production build
export const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
export const API_URL = `${BASE_URL}/api`;
export const WS_URL = BASE_URL.replace(/^http/, 'ws') + '/ws';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WebSocket listener connection manager for real-time notifications
type WsCallback = (event: { type: string; data?: any; message?: string }) => void;
let wsConnection: WebSocket | null = null;
const listeners: Set<WsCallback> = new Set();

export const subscribeRealtimeNotifications = (callback: WsCallback) => {
  listeners.add(callback);

  if (!wsConnection || wsConnection.readyState === WebSocket.CLOSED) {
    try {
      wsConnection = new WebSocket(WS_URL);
      
      wsConnection.onopen = () => {
        console.log('📡 [Frontend WS] Connected to Realtime Backend');
      };

      wsConnection.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          listeners.forEach((fn) => fn(payload));
        } catch (err) {
          console.error('Failed parsing WS message:', err);
        }
      };

      wsConnection.onclose = () => {
        console.log('📡 [Frontend WS] Disconnected. Will attempt reconnect upon next subscription.');
        wsConnection = null;
      };
    } catch (err) {
      console.warn('WebSocket could not be initiated:', err);
    }
  }

  return () => {
    listeners.delete(callback);
  };
};

// API calls wrapper
export const api = {
  client: apiClient,
  getBanners: () => apiClient.get('/banners').then((r) => r.data.data),
  getCategories: () => apiClient.get('/categories').then((r) => r.data.data),
  getProducts: (params?: any) => apiClient.get('/products', { params }).then((r) => r.data.data),
  getProductBySlug: (slug: string) => apiClient.get(`/products/${slug}`).then((r) => r.data.data),
  
  // Shipping & Promo
  calculateShipping: (data: { destination_city: string; weight_grams: number }) =>
    apiClient.post('/shipping/calculate', data).then((r) => r.data.data),
  validateVoucher: (data: { code: string; subtotal: number }) =>
    apiClient.post('/vouchers/validate', data).then((r) => r.data),
  getVouchers: () => apiClient.get('/admin/vouchers').then((r) => r.data.data || [
    { code: 'MABRUR2026', discount_amount: 350000, min_order_amount: 1000000, is_active: true, usage_count: 14 },
    { code: 'HEMAT50', discount_amount: 50000, min_order_amount: 250000, is_active: true, usage_count: 5 },
  ]).catch(() => [
    { code: 'MABRUR2026', discount_amount: 350000, min_order_amount: 1000000, is_active: true, usage_count: 14 },
    { code: 'HEMAT50', discount_amount: 50000, min_order_amount: 250000, is_active: true, usage_count: 5 },
  ]),

  // Cart
  getCart: (params: { sessionId?: string; userId?: string }) => apiClient.get('/cart', { params }).then((r) => r.data.data),
  addCartItem: (data: { cart_id: string; product_id: string; variant_id?: string; qty: number }) =>
    apiClient.post('/cart/items', data).then((r) => r.data.data),
  deleteCartItem: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`).then((r) => r.data),

  // Orders & Payment Simulator
  createOrder: (payload: any) => apiClient.post('/orders', payload).then((r) => r.data),
  getOrder: (idOrNumber: string) => apiClient.get(`/orders/${idOrNumber}`).then((r) => r.data.data),
  simulatePaymentSuccess: (order_number: string, method?: string) =>
    apiClient.post('/payments/simulate-success', { order_number, payment_method_label: method }).then((r) => r.data),

  // Customer Account
  getAccountOrders: (email?: string) => apiClient.get('/account/orders', { params: { email } }).then((r) => r.data.data),
  getAccountAddresses: () => apiClient.get('/account/addresses').then((r) => r.data.data),
  getAccountReviews: (_user?: string) => apiClient.get('/products').then((r) => r.data.data ? r.data.data.flatMap((p: any) => p.reviews || []) : []),

  // Admin
  getAdminOverview: () => apiClient.get('/admin/overview').then((r) => r.data.data),
  getAdminAnalytics: () => apiClient.get('/admin/overview').then((r) => r.data.data),
  getAdminOrders: () => apiClient.get('/admin/orders').then((r) => r.data.data),
  updateOrderStatus: (orderId: string, status: string, tracking_number?: string) =>
    apiClient.post(`/admin/orders/${orderId}/status`, { status, tracking_number }).then((r) => r.data),
  getAdminProducts: () => apiClient.get('/admin/products').then((r) => r.data.data),
  getAdminReviews: () => apiClient.get('/admin/reviews').then((r) => r.data.data),
  replyReview: (reviewId: string, reply_text: string) =>
    apiClient.post(`/admin/reviews/${reviewId}/reply`, { reply_text }).then((r) => r.data),
};
