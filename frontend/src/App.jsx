import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, ShieldCheck } from 'lucide-react';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AuthParams from './pages/Auth';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import CartPage from './pages/Cart';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import AccessDenied from './pages/AccessDenied';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import AdminRoute from './components/Routes/AdminRoute';
import './index.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info("Đã đăng xuất ra khỏi hệ thống an toàn", "Trạng thái báo cáo");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <nav className="navbar">
      <div className="layout-container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className="nav-brand gradient-text">Tech Store</Link>
          {user?.role === 'ADMIN' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin/categories" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                <ShieldCheck size={16} /> Danh Mục
              </Link>
              <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '6px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                <Package size={16} /> Nhập Kho
              </Link>
            </div>
          )}
        </div>
        <div className="nav-links">
          <Link to="/" className="btn-secondary" style={{ border: 'none', padding: '8px' }} title="Trang Chủ">
            <Package size={20} />
          </Link>
          <Link
            to="/cart"
            className="btn-secondary"
            style={{ border: 'none', padding: '8px', position: 'relative' }}
            title="Giỏ Hàng"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="btn-secondary" style={{ border: 'none', padding: '8px', color: '#ef4444' }} title="Đăng Xuất">
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/auth" className="btn-primary">Đăng Nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />
            <div className="layout-container" style={{ paddingBottom: '60px' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/auth" element={<AuthParams />} />
                <Route path="/403" element={<AccessDenied />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />

                {/* Admin Protected Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/categories" element={<CategoryPage />} />
                  <Route path="/admin/products" element={<ProductPage />} />
                </Route>

              </Routes>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
