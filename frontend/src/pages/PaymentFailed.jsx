import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { XCircle, Repeat, Home, HelpCircle } from 'lucide-react';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    const handleRetry = () => {
        // Redirection logic to retry payment process
        // For simple case, go back to order list or checkout
        navigate('/cart');
    };

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="glass-panel max-w-md w-full p-8 text-center" style={{ borderRadius: '24px' }}>
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-500/20 rounded-full text-red-500 animate-pulse">
                        <XCircle size={64} />
                    </div>
                </div>

                <h1 className="gradient-text-red text-3xl font-bold mb-2">Thanh Toán Thất Bại!</h1>
                <p className="text-muted mb-8 text-lg">Giao dịch thanh toán không thành công.</p>

                <div className="bg-white/5 rounded-xl p-6 mb-8 text-left border border-white/10">
                    <div className="flex justify-between mb-3 pb-3 border-b border-white/5">
                        <span className="text-muted">Mã đơn hàng:</span>
                        <span className="font-mono font-medium text-white">{orderId?.substring(0, 12)}...</span>
                    </div>
                    <div className="flex items-start gap-4 mt-2">
                        <HelpCircle size={24} className="text-muted shrink-0" />
                        <p className="text-sm text-yellow-500/80">
                            Các lỗi phổ biến: Tài khoản không đủ số dư, vượt hạn mức thanh toán, hoặc bạn đã hủy giao dịch.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button onClick={handleRetry} className="btn-primary flex items-center justify-center gap-2 py-4">
                        <Repeat size={18} /> Thử lại với phương thức khác
                    </button>
                    <Link to="/" className="flex items-center justify-center gap-2 text-muted hover:text-white transition-colors py-2">
                        <Home size={18} /> Quay về trang chủ
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted text-sm italic">
                    Số tiền chưa được trừ khỏi tài khoản của bạn.<br />
                    Vui lòng liên hệ ngân hàng nếu thấy có biến động số dư ngoài mong đợi.
                </p>
            </div>
        </div>
    );
};

export default PaymentFailed;
