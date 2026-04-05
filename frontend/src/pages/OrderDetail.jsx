import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Calendar, Package, AlertCircle } from 'lucide-react';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const backLink = user?.role === 'ADMIN' ? '/admin/orders' : '/my-orders';

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await AppApi.getOrderById(id);
                setOrder(data);
            } catch (error) {
                toast.error("Không thể tải thông tin đơn hàng.", "Lỗi");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id, toast]);

    if (loading) return <div className="container mx-auto p-10 text-white">Đang tải chi tiết đơn hàng...</div>;

    if (!order) return (
        <div className="container mx-auto p-10 text-center">
            <h2 className="text-white text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
            <Link to={backLink} className="btn-primary px-6 py-2 rounded-lg">Quay lại danh sách</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in max-w-4xl">
            <Link to={backLink} className="flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors">
                <ChevronLeft size={20} /> Quay lại danh sách đơn hàng
            </Link>

            <div className="glass-panel p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl">
                {/* Header Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Chi tiết đơn hàng</h1>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="font-mono text-muted text-sm">#{order.id.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-3 text-muted text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <Calendar size={18} />
                        <span>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-6 mb-12">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Package size={20} className="text-red-500" /> Danh sách sản phẩm
                    </h3>
                    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-muted text-xs uppercase tracking-widest">
                                    <th className="p-5 font-bold">Sản phẩm</th>
                                    <th className="p-5 font-bold text-center">Số lượng</th>
                                    <th className="p-5 font-bold text-right">Đơn giá</th>
                                    <th className="p-5 font-bold text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {order.orderItems?.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-xl">
                                                    {item.product?.imageUrl ? (
                                                        <img src={`http://localhost:3000${item.product.imageUrl}`} className="w-full h-full object-contain" alt={item.product.name} />
                                                    ) : "💻"}
                                                </div>
                                                <span className="text-white font-medium text-sm">{item.product?.name || 'Sản phẩm không tên'}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center text-white/70 font-mono text-sm">{item.quantity}</td>
                                        <td className="p-5 text-right text-white/70 text-sm">{new Intl.NumberFormat('vi-VN').format(item.price)} đ</td>
                                        <td className="p-5 text-right text-white font-bold text-sm">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-8 border-t border-white/5">
                    <div className="max-w-xs">
                        {order.status === 'EXPIRED' && (
                            <div className="flex items-start gap-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-xs leading-relaxed">Đơn hàng này đã hết hạn giữ hàng. Số lượng sản phẩm đã được hoàn lại kho.</p>
                            </div>
                        )}
                        {order.status === 'PAID' && (
                            <div className="flex items-start gap-3 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-xs leading-relaxed">Đơn hàng đã được thanh toán thành công. Chúng tôi đang chuẩn bị gửi hàng cho bạn.</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-auto min-w-[240px] space-y-4">
                        <div className="flex justify-between text-muted text-sm">
                            <span>Tạm tính</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ</span>
                        </div>
                        <div className="flex justify-between text-muted text-sm">
                            <span>Phí giao hàng</span>
                            <span className="text-green-400">Miễn phí</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-white font-bold">Tổng số tiền</span>
                            <span className="text-3xl font-black text-white tracking-tight">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount).replace('₫', '₫')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
