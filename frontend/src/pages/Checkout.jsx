import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { AppApi } from '../services/api';
import { MapPin, Plus, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const toast = useToast();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const [newAddress, setNewAddress] = useState({
        addressLine: '',
        city: '',
        district: '',
        ward: ''
    });
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const data = await AppApi.getAddresses();
            setAddresses(data);
            if (data.length > 0 && !selectedAddressId) {
                setSelectedAddressId(data[0].id);
            }
        } catch (err) {
            console.error("Không thể tải địa chỉ:", err);
            // Mock addresses if API fails
            const mock = [
                { id: 'addr-1', addressLine: '123 Đường ABC', city: 'Hà Nội', district: 'Cầu Giấy', ward: 'Dịch Vọng' },
                { id: 'addr-2', addressLine: '456 Đường XYZ', city: 'TP. HCM', district: 'Quận 1', ward: 'Bến Nghé' }
            ];
            setAddresses(mock);
            setSelectedAddressId(mock[0].id);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!newAddress.addressLine || !newAddress.city) return;

        setIsAddingAddress(true);
        try {
            const added = await AppApi.createAddress(newAddress);
            toast.success("Đã thêm địa chỉ giao hàng mới", "Thành công");
            setShowAddressModal(false);
            setNewAddress({ addressLine: '', city: '', district: '', ward: '' });

            // Refresh list and select new
            const updated = await AppApi.getAddresses();
            setAddresses(updated);
            setSelectedAddressId(added.id || updated[updated.length - 1].id);
        } catch (err) {
            toast.error("Không thể lưu địa chỉ mới", "Lỗi dữ liệu");
        } finally {
            setIsAddingAddress(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.warning("Vui lòng chọn hoặc thêm địa chỉ nhận hàng để tiếp tục.");
            return;
        }

        if (cart.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.");
            return;
        }

        setIsPlacingOrder(true);
        try {
            const orderData = {
                paymentMethod: 'COD',
                addressId: selectedAddressId,
                orderItems: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await AppApi.placeOrder(orderData);

            // Re-fetch cart isn't strictly necessary as clearCart handles it, 
            // but clearCart is better here
            clearCart();

            toast.success(
                "Đơn hàng đã được ghi nhận. Sản phẩm của bạn được giữ trong kho 10 phút để chờ thanh toán.",
                "Đặt hàng thành công"
            );

            // Redirect to Home as per requirement
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            toast.error(err.message || "Gặp lỗi khi xử lý đặt hàng. Vui lòng thử lại sau.", "Lỗi thanh toán");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Hãy chọn cho mình những sản phẩm ưng ý trước khi thanh toán.</p>
                <Link to="/" className="btn-primary">Quay lại Cửa hàng</Link>
            </div>
        );
    }

    return (
        <>
            <div className="animate-fade-in" style={{ marginTop: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '32px', marginBottom: '30px' }}>Thanh Toán Đơn Hàng</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', flexWrap: 'wrap' }}>

                    {/* Left Column: Address Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={20} color="var(--accent)" /> Địa Chỉ Nhận Hàng
                                </h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    <Plus size={14} /> Thêm mới
                                </button>
                            </div>

                            {isLoadingAddresses ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tìm địa chỉ của bạn...</div>
                            ) : addresses.length === 0 ? (
                                <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Bạn chưa có địa chỉ giao hàng nào.</p>
                                    <button onClick={() => setShowAddressModal(true)} className="btn-primary">Thêm địa chỉ đầu tiên</button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {addresses.map(addr => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`glass-panel ${selectedAddressId === addr.id ? 'active-address' : ''}`}
                                            style={{
                                                padding: '16px',
                                                cursor: 'pointer',
                                                borderWidth: '2px',
                                                borderColor: selectedAddressId === addr.id ? 'var(--accent)' : 'transparent',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                                <input
                                                    type="radio"
                                                    checked={selectedAddressId === addr.id}
                                                    readOnly
                                                    style={{ marginTop: '4px' }}
                                                />
                                                <div>
                                                    <p style={{ fontWeight: '500' }}>{addr.addressLine}</p>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                                        {addr.ward}, {addr.district}, {addr.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <CreditCard size={20} color="var(--accent)" /> Phương Thức Thanh Toán
                            </h2>
                            <div className="glass-panel active-address" style={{ padding: '16px', borderColor: 'var(--accent)', borderWidth: '2px' }}>
                                <p style={{ fontWeight: '500' }}>Thanh toán khi nhận hàng (COD)</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Thanh toán bằng tiền mặt ngay khi đơn hàng được giao đến bạn.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="glass-panel" style={{ padding: '30px', height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Tóm tắt đơn hàng</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SL: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '18px', fontWeight: '700' }}>
                                <span>Tổng cộng:</span>
                                <span className="gradient-text">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || !selectedAddressId}
                            className="btn-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {isPlacingOrder ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : 'Đặt Hàng Ngay'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="admin-modal-overlay">
                    <div className="glass-panel admin-modal" style={{ maxWidth: '500px' }}>
                        <h3 className="admin-modal-title">Thêm Địa Chỉ Mới</h3>
                        <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <input
                                className="input-field"
                                placeholder="Số nhà, tên đường..."
                                value={newAddress.addressLine}
                                onChange={e => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <input
                                    className="input-field"
                                    placeholder="Xã/Phường"
                                    value={newAddress.ward}
                                    onChange={e => setNewAddress({ ...newAddress, ward: e.target.value })}
                                    required
                                />
                                <input
                                    className="input-field"
                                    placeholder="Quận/Huyện"
                                    value={newAddress.district}
                                    onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                className="input-field"
                                placeholder="Thành phố/Tỉnh"
                                value={newAddress.city}
                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                required
                            />

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddressModal(false)}>Hủy</button>
                                <button type="submit" className="btn-primary" disabled={isAddingAddress}>
                                    {isAddingAddress ? 'Đang lưu...' : 'Xác Nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .active-address {
          background: rgba(59, 132, 246, 0.05) !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </>
    );
};

export default Checkout;
