import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../features/authSlice';
import App from '../App';
import HomePage from '../pages/home/HomePage';
import ShopPage from '../pages/shop/ShopPage';
import ProductPage from '../pages/product/ProductPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import OrdersPage from '../pages/orders/OrdersPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import WishlistPage from '../pages/wishlist/WishlistPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AccountPage from '../pages/account/AccountPage';
import AdminDashboard, { AdminOverview } from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductForm from '../pages/admin/AdminProductForm';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import PrivacyPage from '../pages/legal/PrivacyPage';
import TermsPage from '../pages/legal/TermsPage';
import ContactPage from '../pages/legal/ContactPage';
import RefundPolicyPage from '../pages/legal/RefundPolicyPage';
import Spinner from '../components/ui/Spinner';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useSelector((s) => s.auth);
  if (loading) return <Spinner className="mt-32" />;
  if (!user) return <Navigate to="/auth/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />

        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
