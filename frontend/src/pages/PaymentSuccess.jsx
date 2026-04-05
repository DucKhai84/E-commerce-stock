import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { AppApi } from '../services/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            AppApi.getOrderById(orderId)
                .then(data => {
                    setOrder(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching order:", err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [orderId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="glass-panel max-w-md w-full p-8 text-center" style={{ borderRadius: '24px' }}>
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-500/20 rounded-full text-green-500 animate-bounce-subtle">
                        <CheckCircle size={64} />
                    </div>
                </div>

                <h1 className="gradient-text text-3xl font-bold mb-2">Thanh Toán Thành Công!</h1>
                <p className="text-muted mb-8 text-lg">Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi.</p>

                {order && (
                    <div className="bg-white/5 rounded-xl p-6 mb-8 text-left border border-white/10">
                        <div className="flex justify-between mb-3 pb-3 border-b border-white/5">
                            <span className="text-muted">Mã đơn hàng:</span>
                            <span className="font-mono font-medium text-white">{order.id.substring(0, 12)}...</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-muted">Tổng thanh toán:</span>
                            <span className="font-bold text-green-400 text-lg">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">Trạng thái:</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full uppercase font-bold">Đã Thanh Toán</span>
                        </div>
                    </div>
                )}

                {!order && orderId && (
                    <p className="text-red-400 mb-6 italic">Đơn hàng #{orderId} đang được cập nhật hệ thống...</p>
                )}

                <div className="flex flex-col gap-4">
                    <Link to="/catalog" className="btn-primary flex items-center justify-center gap-2 py-4">
                        <ShoppingBag size={18} /> Tiếp tục mua sắm
                    </Link>
                    <Link to="/" className="flex items-center justify-center gap-2 text-muted hover:text-white transition-colors py-2">
                        <Home size={18} /> Quay về trang chủ
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted text-sm italic">
                    Một email xác nhận chi tiết đơn hàng đã được gửi đến bạn.<br />
                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ.
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
