import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/localDb';
import { MidtransSandboxService } from '../services/midtransService';
import { ShippingCalculatorService } from '../services/shippingService';
import { broadcastOrderStatus } from '../websocket/wsServer';
import { StoreProduct, StoreOrder, StoreOrderItem, StorePayment, StoreCartItem, StoreAddress, StoreReview } from '../types';

export const apiRouter = Router();

// ============================================================================
// 1. PUBLIC CATALOG & BANNERS (CMS Lite)
// ============================================================================

// Get Active Banners for Homepage Hero
apiRouter.get('/banners', (req: Request, res: Response) => {
  const activeBanners = db.banners
    .filter((b) => b.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  res.json({ success: true, data: activeBanners });
});

// Get Categories Tree for Mega Menu & Filters
apiRouter.get('/categories', (req: Request, res: Response) => {
  const sorted = [...db.categories].sort((a, b) => a.sort_order - b.sort_order);
  res.json({ success: true, data: sorted });
});

// Get Products with Filtering, Search Autocomplete, and Sorting
apiRouter.get('/products', (req: Request, res: Response) => {
  const { category, search, min_price, max_price, sort, featured, is_bundling } = req.query;

  let products = db.getProductsWithRelations().filter((p) => p.status === 'active');

  // Filter by category slug
  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter((p) => p.category?.slug === category);
  }

  // Filter by bundling
  if (is_bundling === 'true') {
    products = products.filter((p) => p.is_bundling);
  }

  // Filter by featured
  if (featured === 'true') {
    products = products.filter((p) => p.is_featured);
  }

  // Filter by search term (name, description, brand, tags)
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  // Filter by price range
  if (min_price && !isNaN(Number(min_price))) {
    products = products.filter((p) => (p.discount_price ?? p.base_price) >= Number(min_price));
  }
  if (max_price && !isNaN(Number(max_price))) {
    products = products.filter((p) => (p.discount_price ?? p.base_price) <= Number(max_price));
  }

  // Sorting: terlaris (review_count), termurah, terbaru, rating tertinggi
  if (sort === 'terlaris') {
    products.sort((a, b) => b.review_count - a.review_count);
  } else if (sort === 'termurah') {
    products.sort((a, b) => (a.discount_price ?? a.base_price) - (b.discount_price ?? b.base_price));
  } else if (sort === 'termahal') {
    products.sort((a, b) => (b.discount_price ?? b.base_price) - (a.discount_price ?? a.base_price));
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating_avg - a.rating_avg);
  }

  res.json({ success: true, count: products.length, data: products });
});

// Get Single Product by Slug + Frequently Bought Together
apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Produk tidak ditemukan' });
  }

  // Get cross-sell / related items (same category or frequently bought travel accessories)
  const related = db
    .getProductsWithRelations()
    .filter((p) => p.id !== product.id && p.status === 'active')
    .slice(0, 4);

  // Get customer reviews
  const reviews = db.reviews.filter((r) => r.product_id === product.id && r.status === 'published');

  res.json({
    success: true,
    data: {
      ...product,
      related_products: related,
      reviews,
    },
  });
});

// ============================================================================
// 2. SHOPPING CART & GUEST SESSION MERGING
// ============================================================================

// Get or Create Cart by Session ID / User ID
apiRouter.get('/cart', (req: Request, res: Response) => {
  const { sessionId, userId } = req.query;
  let cart = db.carts.find((c) => (userId && c.user_id === userId) || (sessionId && c.guest_session_id === sessionId));

  if (!cart) {
    cart = {
      id: uuidv4(),
      user_id: typeof userId === 'string' ? userId : null,
      guest_session_id: typeof sessionId === 'string' ? sessionId : null,
      items: [],
    };
    db.carts.push(cart);
  }

  // Populate cart items with latest product prices and variant info
  const items = db.cart_items
    .filter((item) => item.cart_id === cart!.id)
    .map((item) => {
      const product = db.products.find((p) => p.id === item.product_id);
      const variant = db.variants.find((v) => v.id === item.variant_id);
      return { ...item, product, variant };
    })
    .filter((i) => i.product != null);

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.discount_price ?? i.product?.base_price ?? 0) * i.qty, 0);

  res.json({ success: true, data: { cart_id: cart.id, items, totalQty, subtotal } });
});

// Add Item to Cart
apiRouter.post('/cart/items', (req: Request, res: Response) => {
  const { cart_id, product_id, variant_id, qty = 1 } = req.body;
  const product = db.products.find((p) => p.id === product_id);
  if (!product) return res.status(404).json({ success: false, error: 'Produk tidak ditemukan' });

  let existing = db.cart_items.find((i) => i.cart_id === cart_id && i.product_id === product_id && i.variant_id === (variant_id || null));

  if (existing) {
    existing.qty += Number(qty);
  } else {
    existing = {
      id: uuidv4(),
      cart_id,
      product_id,
      variant_id: variant_id || null,
      qty: Number(qty),
      price_snapshot: product.discount_price ?? product.base_price,
    };
    db.cart_items.push(existing);
  }

  res.json({ success: true, message: 'Item berhasil ditambahkan ke keranjang', data: existing });
});

// Update Item Qty or Remove
apiRouter.delete('/cart/items/:itemId', (req: Request, res: Response) => {
  const index = db.cart_items.findIndex((i) => i.id === req.params.itemId);
  if (index !== -1) {
    db.cart_items.splice(index, 1);
  }
  res.json({ success: true, message: 'Item dihapus dari keranjang' });
});

// Merge Guest Cart to Account upon Login
apiRouter.post('/cart/merge', (req: Request, res: Response) => {
  const { guest_session_id, user_id } = req.body;
  const guestCart = db.carts.find((c) => c.guest_session_id === guest_session_id);
  let userCart = db.carts.find((c) => c.user_id === user_id);

  if (!userCart && user_id) {
    userCart = { id: uuidv4(), user_id, guest_session_id: null, items: [] };
    db.carts.push(userCart);
  }

  if (guestCart && userCart && guestCart.id !== userCart.id) {
    // Migrate items from guest cart to user cart
    const guestItems = db.cart_items.filter((i) => i.cart_id === guestCart.id);
    guestItems.forEach((gItem) => {
      const existInUser = db.cart_items.find((u) => u.cart_id === userCart!.id && u.product_id === gItem.product_id && u.variant_id === gItem.variant_id);
      if (existInUser) {
        existInUser.qty += gItem.qty;
        db.cart_items = db.cart_items.filter((i) => i.id !== gItem.id);
      } else {
        gItem.cart_id = userCart!.id;
      }
    });
  }

  res.json({ success: true, message: 'Keranjang belanja berhasil digabungkan (auto-merge)' });
});

// ============================================================================
// 3. SHIPPING & VOUCHER EVALUATION
// ============================================================================

apiRouter.post('/shipping/calculate', async (req: Request, res: Response) => {
  const { destination_city, weight_grams = 1000 } = req.body;
  try {
    const options = await ShippingCalculatorService.calculateRates({ destination_city, weight_grams });
    res.json({ success: true, data: options });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/vouchers/validate', (req: Request, res: Response) => {
  const { code, subtotal = 0 } = req.body;
  const voucher = db.vouchers.find((v) => v.code.toUpperCase() === (code || '').toUpperCase());

  if (!voucher) {
    return res.status(404).json({ success: false, error: 'Kode voucher tidak valid atau tidak ditemukan' });
  }

  if (subtotal < voucher.min_purchase) {
    return res.status(400).json({
      success: false,
      error: `Minimum pembelian Rp ${voucher.min_purchase.toLocaleString('id-ID')} untuk menggunakan voucher ini`,
    });
  }

  if (voucher.used_count >= voucher.quota) {
    return res.status(400).json({ success: false, error: 'Kuota pemakaian voucher ini sudah habis' });
  }

  let discount = 0;
  if (voucher.discount_type === 'percentage') {
    discount = Math.round((subtotal * voucher.discount_value) / 100);
    if (voucher.max_discount && discount > voucher.max_discount) {
      discount = voucher.max_discount;
    }
  } else {
    discount = voucher.discount_value;
  }

  res.json({
    success: true,
    data: {
      code: voucher.code,
      discount_amount: discount,
      message: `Berhasil mendapat potongan diskon Rp ${discount.toLocaleString('id-ID')}`,
    },
  });
});

// ============================================================================
// 4. ORDER CHECKOUT & PAYMENT SIMULATION
// ============================================================================

const checkoutSchema = z.object({
  user_id: z.string().optional().nullable(),
  guest_email: z.string().email('Format email tidak valid'),
  recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  phone: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  full_address: z.string().min(10, 'Alamat lengkap sangat dibutuhkan'),
  city: z.string().min(2, 'Kota tujuan wajib diisi'),
  shipping_courier: z.string(),
  shipping_cost: z.number().nonnegative(),
  voucher_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(
    z.object({
      product_id: z.string(),
      variant_id: z.string().optional().nullable(),
      qty: z.number().positive(),
    })
  ),
});

apiRouter.post('/orders', async (req: Request, res: Response) => {
  const parse = checkoutSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, errors: parse.error.format() });
  }

  const { guest_email, recipient_name, phone, full_address, city, shipping_courier, shipping_cost, voucher_code, notes, items } = parse.data;

  // Calculate prices and decrement variant stocks if applicable
  let subtotal = 0;
  const orderItems: StoreOrderItem[] = [];
  const snapItemDetails: any[] = [];
  const orderId = uuidv4();

  for (const item of items) {
    const p = db.products.find((prod) => prod.id === item.product_id);
    if (!p) continue;
    const v = item.variant_id ? db.variants.find((varnt) => varnt.id === item.variant_id) : null;
    
    const price = (p.discount_price ?? p.base_price) + (v ? v.price_adjustment : 0);
    const itemSubtotal = price * item.qty;
    subtotal += itemSubtotal;

    const nameSnapshot = `${p.name} ${v ? `(${v.variant_value})` : ''}`.substring(0, 50);

    orderItems.push({
      id: uuidv4(),
      order_id: orderId,
      product_id: p.id,
      variant_id: v ? v.id : null,
      product_name_snapshot: nameSnapshot,
      price_snapshot: price,
      qty: item.qty,
      subtotal: itemSubtotal,
    });

    snapItemDetails.push({
      id: p.sku + (v ? `-${v.sku_variant}` : ''),
      price,
      quantity: item.qty,
      name: nameSnapshot,
    });

    // Reduce inventory stock in demo engine
    if (v) {
      v.stock = Math.max(0, v.stock - item.qty);
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (voucher_code) {
    const voucher = db.vouchers.find((v) => v.code.toUpperCase() === voucher_code.toUpperCase());
    if (voucher && subtotal >= voucher.min_purchase) {
      voucher.used_count += 1;
      if (voucher.discount_type === 'percentage') {
        discountAmount = Math.min(Math.round((subtotal * voucher.discount_value) / 100), voucher.max_discount || 9999999);
      } else {
        discountAmount = voucher.discount_value;
      }
      snapItemDetails.push({ id: 'VOUCHER_DISCOUNT', price: -discountAmount, quantity: 1, name: `Diskon (${voucher.code})` });
    }
  }

  if (shipping_cost > 0) {
    snapItemDetails.push({ id: 'SHIPPING_FEE', price: shipping_cost, quantity: 1, name: `Ongkir (${shipping_courier})` });
  }

  const total = subtotal - discountAmount + shipping_cost;
  const orderNumber = `#AAS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(db.orders.length + 1).padStart(3, '0')}`;

  const newOrder: StoreOrder = {
    id: orderId,
    order_number: orderNumber,
    user_id: req.body.user_id || null,
    guest_email,
    address_id: null,
    address_snapshot: { recipient_name, phone, full_address, city },
    subtotal,
    shipping_cost,
    discount_amount: discountAmount,
    total,
    payment_method: 'Midtrans Snap - Menunggu Pembayaran',
    payment_status: 'pending',
    order_status: 'menunggu_pembayaran',
    shipping_courier,
    tracking_number: null,
    notes: notes || '',
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  db.orders.unshift(newOrder);
  db.order_items.push(...orderItems);

  // Generate Midtrans Snap Sandbox Token
  const snapResponse = await MidtransSandboxService.createTransaction({
    order_id: orderId,
    order_number: orderNumber,
    gross_amount: total,
    customer_details: { first_name: recipient_name, email: guest_email, phone },
    item_details: snapItemDetails,
  });

  const paymentRecord: StorePayment = {
    id: uuidv4(),
    order_id: orderId,
    provider: 'midtrans',
    provider_ref_id: snapResponse.token,
    amount: total,
    status: 'pending',
    raw_payload: snapResponse,
  };
  db.payments.unshift(paymentRecord);

  // Clear guest/user cart after order created
  db.cart_items = db.cart_items.filter((i) => !items.some((item) => item.product_id === i.product_id));

  db.logAudit('CREATE_ORDER', 'store_orders', orderNumber, { total, shipping_courier, guest_email });
  broadcastOrderStatus(orderId, orderNumber, 'menunggu_pembayaran', 'Pesanan baru berhasil dibuat.');

  res.json({
    success: true,
    message: 'Pesanan berhasil dibuat! Silakan lanjutkan ke pembayaran.',
    data: {
      order: newOrder,
      snap_token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
      sandbox_instructions: snapResponse.sandbox_instructions,
    },
  });
});

// SIMULATE MIDTRANS WEBHOOK / SANDBOX SUCCESS BUTTON
apiRouter.post('/payments/simulate-success', (req: Request, res: Response) => {
  const { order_number, payment_method_label = 'Midtrans Snap - VA Mandiri' } = req.body;
  const order = db.orders.find((o) => o.order_number === order_number || o.id === order_number);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });
  }

  order.payment_status = 'paid';
  order.payment_method = payment_method_label;
  order.order_status = 'diproses';

  const payment = db.payments.find((p) => p.order_id === order.id);
  if (payment) {
    payment.status = 'settled';
    payment.paid_at = new Date().toISOString();
  }

  db.logAudit('PAYMENT_RECEIVED', 'store_orders', order.order_number, { amount: order.total, method: payment_method_label });

  // Real-time WebSocket broadcast to instant wake-up frontend
  broadcastOrderStatus(order.id, order.order_number, 'diproses', 'Pembayaran terverifikasi. Pesanan sedang diproses & dikemas gudang.');

  res.json({
    success: true,
    message: `Verifikasi pembayaran sukses (Sandbox Webhook Simulator). Status pesanan diperbarui menjadi DIPROSES.`,
    data: order,
  });
});

// Get Order Details & Tracking timeline by Order Number
apiRouter.get('/orders/:idOrNumber', (req: Request, res: Response) => {
  const param = req.params.idOrNumber;
  const order = db.orders.find((o) => o.order_number.toUpperCase() === param.toUpperCase() || o.id === param);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Nomor pesanan tidak ditemukan di sistem' });
  }

  const items = db.order_items.filter((i) => i.order_id === order.id);
  const payment = db.payments.find((p) => p.order_id === order.id);

  res.json({
    success: true,
    data: {
      ...order,
      items,
      payment,
    },
  });
});

// ============================================================================
// 5. CUSTOMER ACCOUNT & REVIEWS (No Admin Sidebar for Customer!)
// ============================================================================

apiRouter.get('/account/orders', (req: Request, res: Response) => {
  const { email } = req.query;
  const orders = db.orders.filter((o) => !email || o.guest_email === email || o.user_id === 'c0000000-0000-0000-0000-000000000001');
  res.json({ success: true, data: orders });
});

apiRouter.get('/account/profile', (req: Request, res: Response) => {
  const user = db.users.find((u) => u.role === 'customer') || db.users[1];
  res.json({ success: true, data: user });
});

apiRouter.get('/account/addresses', (req: Request, res: Response) => {
  res.json({ success: true, data: db.addresses });
});

apiRouter.post('/account/addresses', (req: Request, res: Response) => {
  const newAddr: StoreAddress = {
    id: uuidv4(),
    user_id: 'c0000000-0000-0000-0000-000000000001',
    ...req.body,
    is_default: db.addresses.length === 0,
  };
  db.addresses.push(newAddr);
  res.json({ success: true, data: newAddr });
});

// Submit Customer Review
apiRouter.post('/reviews', (req: Request, res: Response) => {
  const { product_id, order_item_id, rating, comment, photo_urls = [] } = req.body;
  const newReview: StoreReview = {
    id: uuidv4(),
    product_id,
    user_id: 'c0000000-0000-0000-0000-000000000001',
    order_item_id: order_item_id || null,
    rating: Number(rating),
    comment,
    photo_urls,
    status: 'published',
    user_name: 'H. Ahmad Ihsan (Pembeli Terverifikasi)',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    created_at: new Date().toISOString(),
  };
  db.reviews.unshift(newReview);
  res.json({ success: true, message: 'Ulasan Anda berhasil dikirim! Terima kasih atas partisipasi Anda.', data: newReview });
});

// ============================================================================
// 6. ADMIN CONSOLE MODULES
// ============================================================================

// Overview Analytics
apiRouter.get('/admin/overview', (req: Request, res: Response) => {
  const totalRevenue = db.orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const orderCounts = {
    menunggu_pembayaran: db.orders.filter((o) => o.order_status === 'menunggu_pembayaran').length,
    diproses: db.orders.filter((o) => o.order_status === 'diproses').length,
    dikemas: db.orders.filter((o) => o.order_status === 'dikemas').length,
    dikirim: db.orders.filter((o) => o.order_status === 'dikirim').length,
    selesai: db.orders.filter((o) => o.order_status === 'selesai').length,
    dibatalkan: db.orders.filter((o) => o.order_status === 'dibatalkan').length,
  };

  // Low stock alert
  const lowStockVariants = db.variants.filter((v) => v.stock < 30).map((v) => {
    const p = db.products.find((prod) => prod.id === v.product_id);
    return { ...v, product_name: p?.name || 'Produk' };
  });

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      totalCustomers: db.users.filter((u) => u.role === 'customer').length + 12, // simulated past guests
      orderCounts,
      lowStockVariants,
      recentOrders: db.orders.slice(0, 5),
    },
  });
});

// Admin Product CRUD
apiRouter.get('/admin/products', (req: Request, res: Response) => {
  res.json({ success: true, data: db.getProductsWithRelations() });
});

apiRouter.post('/admin/products', (req: Request, res: Response) => {
  const newProd: StoreProduct = {
    id: uuidv4(),
    ...req.body,
    rating_avg: 0.0,
    review_count: 0,
  };
  db.products.unshift(newProd);
  db.logAudit('CREATE_PRODUCT', 'store_products', newProd.id, { name: newProd.name });
  res.json({ success: true, data: newProd });
});

// Admin Order Management & Fulfillment
apiRouter.get('/admin/orders', (req: Request, res: Response) => {
  res.json({ success: true, data: db.orders });
});

apiRouter.post('/admin/orders/:orderId/status', (req: Request, res: Response) => {
  const { status, tracking_number } = req.body;
  const order = db.orders.find((o) => o.id === req.params.orderId || o.order_number === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan' });

  order.order_status = status;
  if (tracking_number) order.tracking_number = tracking_number;
  if (status === 'diproses' || status === 'dikemas' || status === 'dikirim' || status === 'selesai') {
    order.payment_status = 'paid';
  }

  db.logAudit('UPDATE_ORDER_STATUS', 'store_orders', order.order_number, { new_status: status, tracking_number });
  broadcastOrderStatus(order.id, order.order_number, status, tracking_number ? `Nomor Resi: ${tracking_number}` : undefined);

  res.json({ success: true, message: `Status pesanan ${order.order_number} berhasil diperbarui menjadi ${status}`, data: order });
});

// Admin Reviews Moderation
apiRouter.get('/admin/reviews', (req: Request, res: Response) => {
  const allReviews = db.reviews.map((r) => {
    const p = db.products.find((prod) => prod.id === r.product_id);
    return { ...r, product_name: p?.name };
  });
  res.json({ success: true, data: allReviews });
});

apiRouter.post('/admin/reviews/:reviewId/reply', (req: Request, res: Response) => {
  const { reply_text, status } = req.body;
  const review = db.reviews.find((r) => r.id === req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, error: 'Ulasan tidak ditemukan' });

  if (reply_text !== undefined) review.admin_reply = reply_text;
  if (status !== undefined) review.status = status;

  db.logAudit('MODERATE_REVIEW', 'store_reviews', review.id, { status, has_reply: !!reply_text });
  res.json({ success: true, data: review });
});

// Admin Customers List
apiRouter.get('/admin/customers', (req: Request, res: Response) => {
  const customers = db.users.filter((u) => u.role === 'customer').map((u) => {
    const userOrders = db.orders.filter((o) => o.user_id === u.id || o.guest_email === u.email);
    const spent = userOrders.reduce((sum, o) => sum + o.total, 0);
    return { ...u, order_count: userOrders.length, total_spent: spent };
  });
  res.json({ success: true, data: customers });
});

// Admin Audit Logs
apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, data: db.audit_logs });
});
