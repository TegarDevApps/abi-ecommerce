import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AccountLayout } from './layouts/AccountLayout';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';

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

// Auto scroll to top on navigation change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        
        {/* CUSTOMER STOREFRONT PORTAL (Retail Experience with Mega Menu & Bottom Mobile Bar) */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="produk" element={<CatalogPage />} />
          <Route path="produk/:slug" element={<ProductDetailPage />} />
          <Route path="keranjang" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pesanan/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
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
          <Route path="voucher" element={<AdminVouchersPage />} />
          <Route path="banner" element={<AdminBannersPage />} />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};
export default App;
