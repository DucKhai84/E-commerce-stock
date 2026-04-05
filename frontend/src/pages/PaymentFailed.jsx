import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { X, RotateCcw, ClipboardList, Home, AlertCircle } from 'lucide-react';
import { AppApi } from '../services/api';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const data = await AppApi.getOrderById(orderId);
                    setOrder(data);
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleRetry = () => {
        navigate('/cart');
    };

    if (!orderId) {
        return (
            <div className="payment-failed-wrapper min-h-screen flex flex-col items-center justify-start bg-surface px-4 pt-12">
                <style>{cssTemplate}</style>
                <div className="payment-card text-center animate-fade-in">
                    <AlertCircle size={48} className="mx-auto text-danger mb-4 opacity-80" />
                    <h2 className="text-xl font-bold text-primary mb-2">Phiên làm việc không hợp lệ</h2>
                    <p className="text-muted text-sm mb-6">Không tìm thấy thông tin giao dịch thanh toán.</p>
                    <Link to="/" className="btn-outlined inline-flex items-center gap-2">
                        <Home size={16} /> Quay về Trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-failed-wrapper min-h-screen flex flex-col items-center justify-start bg-surface px-4 pt-12 pb-16">
            <style>{cssTemplate}</style>

            <div className="payment-card animate-fade-in">
                {/* Header Section */}
                <div className="header-section text-center mb-8">
                    <div className="icon-circle mx-auto mb-5 bg-danger text-white">
                        <X size={28} strokeWidth={3} />
                    </div>
                    <h1 className="title text-[22px] font-bold text-primary mb-1">Thanh toán thất bại</h1>
                    <p className="subtitle text-[14px] text-muted">Giao dịch của bạn không thể hoàn tất</p>
                </div>

                {/* Metadata Block */}
                <div className="metadata-box bg-secondary mb-6">
                    <div className="metadata-row">
                        <span className="label text-muted">Mã đơn hàng</span>
                        <span className="value font-mono text-[12px] text-primary bg-white/5 px-2 py-0.5 rounded leading-none">
                            #{orderId.substring(0, 14)}...
                        </span>
                    </div>
                    <div className="metadata-row">
                        <span className="label text-muted">Tổng tiền</span>
                        <span className="value font-bold text-[14px] text-primary">
                            {loading ? (
                                <span className="skeleton-line w-20"></span>
                            ) : (
                                order ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount).replace('₫', '₫') : '700.000 ₫'
                            )}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <hr className="divider mb-6" />

                {/* Possible Reasons */}
                <div className="reasons-section mb-10 text-left">
                    <h3 className="uppercase-label text-[11px] font-bold text-muted mb-4 tracking-[0.1em]">NGUYÊN NHÂN CÓ THỂ</h3>
                    <div className="flex flex-col gap-2.5">
                        {[
                            "Số dư không đủ",
                            "Vượt quá giới hạn giao dịch",
                            "Giao dịch bị hủy thủ công",
                            "Lỗi kết nối tạm thời với ngân hàng"
                        ].map((reason, idx) => (
                            <div key={idx} className="reason-pill bg-secondary flex items-center gap-3">
                                <div className="dot w-[6px] h-[6px] rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.3)]"></div>
                                <span className="text-[13px] text-muted font-medium">{reason}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons Row */}
                <div className="actions-row flex items-center gap-[12px] mb-8">
                    <button onClick={handleRetry} className="btn-primary flex-1 h-11 flex items-center justify-center gap-2 px-4 shadow-lg shadow-black/10">
                        <RotateCcw size={15} strokeWidth={2.5} />
                        <span>Thử lại</span>
                    </button>
                    <Link to="/orders" className="btn-outlined flex-1 h-11 flex items-center justify-center gap-2 px-4">
                        <ClipboardList size={15} strokeWidth={2} />
                        <span>Đơn hàng</span>
                    </Link>
                    <Link to="/" className="btn-outlined flex-1 h-11 flex items-center justify-center gap-2 px-4">
                        <Home size={15} strokeWidth={2} />
                        <span>Trang chủ</span>
                    </Link>
                </div>

                {/* Footer Notice */}
                <div className="footer-notice text-center space-y-1.5 border-t-[0.5px] border-white/5 pt-6">
                    <p className="text-[12px] text-muted leading-relaxed">Không có khoản tiền nào bị trừ khỏi tài khoản của bạn.</p>
                    <p className="text-[12px] text-muted leading-relaxed">Các giao dịch đang chờ xử lý sẽ tự động được hoàn lại.</p>
                    <p className="text-[12px] text-muted pt-1">
                        Cần hỗ trợ? <span className="contact-link underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">Liên hệ chúng tôi</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Updated CSS Variables and Layout
const cssTemplate = `
:root {
  --bg-surface: #121212; /* Will adapt if site has global vars */
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-muted: #8c8c8c;
  --border-color: rgba(255, 255, 255, 0.08);
  --danger: #ef4444;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-surface: #ffffff;
    --bg-secondary: #f9f9f9;
    --text-primary: #1a1a1a;
    --text-muted: #666666;
    --border-color: rgba(0, 0, 0, 0.06);
  }
}

/* Ensure we use site global background color if it exists */
.payment-failed-wrapper {
    background-color: var(--color-background-primary, var(--bg-surface));
}

.payment-card {
    max-width: 420px;
    width: 100%;
    margin-top: 3rem; /* Requirements: margin-top: 3rem */
    background-color: var(--bg-surface);
    border: 0.5px solid var(--border-color);
    border-radius: 20px;
    padding: 2.5rem 2rem;
}

.icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metadata-box {
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.metadata-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.divider {
    border: none;
    border-top: 0.5px solid var(--border-color);
    margin: 0;
}

.reason-pill {
    padding: 8px 12px;
    border-radius: 10px;
}

.btn-primary {
    background-color: var(--text-primary);
    color: var(--bg-surface);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    border: none;
}
.btn-primary:active { transform: scale(0.97); }

.btn-outlined {
    background: transparent;
    color: var(--text-primary);
    border: 0.5px solid var(--border-color);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    text-decoration: none;
}
.btn-outlined:hover { background: var(--bg-secondary); }
.btn-outlined:active { transform: scale(0.97); }

.skeleton-line {
    display: inline-block;
    height: 14px;
    background: var(--bg-secondary);
    border-radius: 4px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

export default PaymentFailed;
