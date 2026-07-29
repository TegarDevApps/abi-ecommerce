import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AccountLayout } from './layouts/AccountLayout';
import { useAuthStore } from './store/authStore';

// Authentication Pages
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { HelpPage } from './pages/HelpPage';

// Customer Profile Tabs (NO Dashboard sidebar shell!)
import { ProfilePage } from './pages/account/ProfilePage';
import { OrdersHistoryPage } from './pages/account/OrdersHistoryPage';
import { AddressesPage } from './pages/account/AddressesPage';
import { WishlistPage } from './pages/account/WishlistPage';
import { MyReviewsPage } from './pages/account/MyReviewsPage';

// Admin Portal Pages (With Dashboard sidebar shell)
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminVouchersPage } from './pages/admin/AdminVouchersPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Auto scroll to top on navigation change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        
        {/* STANDALONE EXCLUSIVE ADMIN LOGIN PORTAL (Strictly Separate from Customer Auth!) */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />

        {/* CUSTOMER STOREFRONT PORTAL (Retail Experience with Mega Menu & Bottom Mobile Bar) */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="masuk" element={<CustomerLoginPage />} />
          <Route path="login" element={<Navigate to="/masuk" replace />} />
          <Route path="daftar" element={<CustomerRegisterPage />} />
          <Route path="register" element={<Navigate to="/daftar" replace />} />
          
          <Route path="produk" element={<CatalogPage />} />
          <Route path="produk/:slug" element={<ProductDetailPage />} />
          <Route path="keranjang" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pesanan/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="bantuan" element={<HelpPage />} />
          <Route path="cara-belanja" element={<HelpPage />} />
          <Route path="faq" element={<HelpPage />} />
          <Route path="kebijakan-retur" element={<HelpPage />} />
          
          {/* Customer Account Area (Strictly Horizontal Tabs inside StoreLayout - NO Admin Sidebar!) */}
          <Route path="akun" element={<AccountLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="pesanan" element={<OrdersHistoryPage />} />
            <Route path="alamat" element={<AddressesPage />} />
            <Route path="ulasan-saya" element={<MyReviewsPage />} />
          </Route>
        </Route>

        {/* ADMIN ENTERPRISE DASHBOARD PORTAL (Isolated Sidebar & Operations Control) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="produk" element={<AdminProductsPage />} />
          <Route path="pesanan" element={<AdminOrdersPage />} />
          <Route path="pembayaran" element={<AdminPaymentsPage />} />
          <Route path="promo" element={<AdminVouchersPage />} />
          <Route path="voucher" element={<AdminVouchersPage />} />
          <Route path="ulasan" element={<AdminReviewsPage />} />
          <Route path="pelanggan" element={<AdminCustomersPage />} />
          <Route path="konten" element={<AdminBannersPage />} />
          <Route path="banner" element={<AdminBannersPage />} />
          <Route path="laporan" element={<AdminReportsPage />} />
          <Route path="audit-log" element={<AdminAuditLogsPage />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};
export default App;
