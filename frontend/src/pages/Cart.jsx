import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from 'lucide-react';

const CartPage = () => {
    const { cart, cartTotal, removeFromCart, addToCart, isLoading } = useCart();

    if (isLoading && cart.length === 0) {
        return <div style={{ marginTop: '100px', textAlign: 'center' }}>Đang nạp dữ liệu giỏ hàng từ máy chủ...</div>;
    }

    if (cart.length === 0) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <ShoppingCart size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                <h2 style={{ marginBottom: '10px' }}>Giỏ hàng của bạn đang trống</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Hãy dạo quanh cửa hàng để tìm những món đồ ưng ý nhất.</p>
                <Link to="/" className="btn-primary">Quay lại Cửa hàng</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ marginTop: '40px' }}>
            <h1 className="gradient-text" style={{ fontSize: '32px', marginBottom: '30px' }}>Giỏ Hàng Của Bạn</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '30px', alignItems: 'start' }}>

                {/* Cart items list */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '15px',
                                    borderBottom: '1px solid var(--glass-border)',
                                    position: 'relative'
                                }}
                            >
                                {/* Product Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{item.name}</h3>
                                    <p style={{ color: '#60a5fa', fontWeight: 'bold' }}>${item.price}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px' }}>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.itemId)}
                                        style={{ background: 'none', color: 'var(--text-muted)' }}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price }, 1)}
                                        style={{ background: 'none', color: 'var(--text-muted)' }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                    <p style={{ fontWeight: '700', fontSize: '18px' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>

                                {/* Delete button (force remove) */}
                                <button
                                    onClick={() => removeFromCart(item.id, item.itemId)}
                                    style={{ background: 'none', color: '#ef4444', marginLeft: '10px' }}
                                    title="Xóa món này"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
                    <h2 style={{ fontSize: '22px', marginBottom: '24px' }}>Thanh toán</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tổng giá trị:</span>
                        <span style={{ fontSize: '20px', fontWeight: '700' }}>${cartTotal.toFixed(2)}</span>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '30px' }}>
                        * Thuế và phí vận chuyển sẽ được tính toán tại bước tiếp theo.
                    </p>

                    <Link
                        to="/checkout"
                        className="btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '16px',
                            width: '100%'
                        }}
                    >
                        Tiếp tục thanh toán <ArrowRight size={18} />
                    </Link>

                    <Link
                        to="/"
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '15px',
                            fontSize: '14px',
                            color: 'var(--text-muted)',
                            textDecoration: 'underline'
                        }}
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default CartPage;
