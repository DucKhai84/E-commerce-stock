import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import { ShoppingBag, Clock, ArrowRight, RefreshCw, ChevronRight, Hash, CreditCard, LayoutGrid } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await AppApi.getMyOrders();
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                toast.error("Không thể tải lịch sử đơn hàng.", "Lỗi hệ thống");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [toast]);

    const handlePaymentRetry = async (orderId) => {
        try {
            const { vnpUrl } = await AppApi.createPaymentUrl(orderId);
            window.location.href = vnpUrl;
        } catch (error) {
            toast.error(error.message || "Không thể khởi tạo lại thanh toán.");
        }
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-32 min-h-screen">
            <div className="flex flex-col gap-12 max-w-4xl mx-auto items-center">
                <div className="h-20 bg-white/5 animate-pulse rounded-3xl w-64"></div>
                {[1, 2].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[40px] w-full border border-white/5"></div>)}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-20 md:py-32 min-h-screen relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed top-[15%] left-[-15%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[140px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] -z-10"></div>

            <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Centered Header Header */}
                <div className="flex flex-col items-center text-center mb-24 animate-fade-in w-full">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/10 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm">
                        <LayoutGrid size={12} /> Account Activity
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                        Lịch sử <span className="text-white/20 italic">đơn hàng</span>
                    </h1>
                    <p className="text-white/40 text-lg md:text-xl font-medium max-w-lg leading-relaxed mb-12">
                        Quản lý và theo dõi hành trình mua sắm của bạn tại một nơi duy nhất.
                    </p>

                    <div className="flex gap-6">
                        <div className="glass-panel px-10 py-6 rounded-3xl border border-white/5 text-center shadow-xl">
                            <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-2">Tổng số đơn</p>
                            <p className="text-4xl font-black text-white">{orders.length}</p>
                        </div>
                        <div className="glass-panel px-10 py-6 rounded-3xl border border-white/5 text-center shadow-xl">
                            <p className="text-green-400/30 text-[11px] font-bold uppercase tracking-widest mb-2">Đã hoàn tất</p>
                            <p className="text-4xl font-black text-green-400">{orders.filter(o => o.status === 'PAID').length}</p>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-panel p-24 text-center rounded-[48px] border border-white/10 shadow-3xl w-full">
                        <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
                            <ShoppingBag size={48} className="text-white/10" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">Trống trải quá!</h2>
                        <p className="text-white/40 mb-12 max-w-sm mx-auto text-lg">Có vẻ như bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu chọn lựa những món đồ tuyệt vời ngay nhé.</p>
                        <Link to="/" className="btn-primary inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-500/20">
                            Bắt đầu mua sắm <ArrowRight size={24} />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 w-full animate-slide-up">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} onRetry={() => handlePaymentRetry(order.id)} />
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(60px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                }
            ` }} />
        </div>
    );
};

const OrderCard = ({ order, onRetry }) => {
    return (
        <div className="group relative w-full">
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>

            <div className="glass-panel p-10 md:p-14 rounded-[48px] border border-white/5 group-hover:border-white/10 transition-all duration-700 text-center flex flex-col items-center">

                {/* Status & ID Centered */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        {order.status === 'RESERVED' && (
                            <div className="flex items-center gap-2 text-orange-400 bg-orange-400/10 px-4 py-1.5 rounded-full border border-orange-400/10 text-xs font-bold">
                                <Clock size={12} className="animate-pulse" />
                                <Countdown expiresAt={order.expiresAt} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Transaction Auth Key</p>
                        <h3 className="text-2xl font-black text-white tracking-widest font-mono uppercase group-hover:text-red-500 transition-colors">
                            #{order.id.substring(0, 14)}
                        </h3>
                    </div>
                </div>

                {/* Amount Highlight Centered */}
                <div className="mb-12">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/15 mb-3">Total Investment</p>
                    <p className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount).replace('₫', '₫')}
                    </p>
                </div>

                {/* Footer Info Centered */}
                <div className="w-full h-[1px] bg-white/5 mb-10 group-hover:bg-white/10 transition-colors"></div>

                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-wrap justify-center gap-8 text-white/30 text-[12px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock size={16} className="text-white/10" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-2"><CreditCard size={16} className="text-white/10" /> Secured Gateway</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                        {(order.status === 'RESERVED' || order.status === 'FAILED') && (
                            <button
                                onClick={onRetry}
                                className="h-14 bg-red-600 hover:bg-red-500 text-white font-black px-12 rounded-2xl flex items-center justify-center gap-3 text-sm transition-all shadow-2xl shadow-red-600/20 hover:scale-105 active:scale-95"
                            >
                                <RefreshCw size={20} /> Hoàn tất thanh toán
                            </button>
                        )}
                        <Link
                            to={`/orders/${order.id}`}
                            className="h-14 bg-white/5 hover:bg-white/10 text-white font-bold px-12 rounded-2xl flex items-center justify-center gap-2 text-sm border border-white/5 transition-all hover:border-white/20 active:scale-95 group/btn"
                        >
                            Quản lý chi tiết <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Countdown = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const update = () => {
            const diff = new Date(expiresAt) - new Date();
            if (diff <= 0) {
                setTimeLeft('00:00');
                return;
            }
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    return <span>{timeLeft}</span>;
}

export default OrderHistory;
