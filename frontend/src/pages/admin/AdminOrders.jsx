import React, { useEffect, useState } from 'react';
import { AppApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import { Search, Filter, ClipboardList, Eye, ArrowUpDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await AppApi.getOrders();
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setFilteredOrders(data);
            } catch (error) {
                toast.error("Không thể tải danh sách đơn hàng.", "Lỗi Admin");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [toast]);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== 'ALL') {
            result = result.filter(o => o.status === statusFilter);
        }
        if (searchTerm) {
            result = result.filter(o =>
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredOrders(result);
    }, [statusFilter, searchTerm, orders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await AppApi.updateOrderStatus(orderId, newStatus);
            toast.success(`Đã cập nhật đơn #${orderId.substring(0, 8)} sang ${newStatus}`, "Hệ thống");
            // Refresh list
            const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
            setOrders(updated);
        } catch (error) {
            toast.error(error.message || "Lỗi khi cập nhật trạng thái.");
        }
    };

    if (loading) return <div className="p-10 text-white">Đang nạp dữ liệu quản trị...</div>;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-green-500/20 text-green-500 rounded-2xl">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Quản lý Đơn hàng</h1>
                        <p className="text-muted">Xem và điều chỉnh tất cả giao dịch trong hệ thống</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none md:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, tên khách..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-green-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative flex-1 md:flex-none">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-white text-sm focus:border-green-500 outline-none appearance-none transition-all cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ thanh toán</option>
                            <option value="RESERVED">Đang giữ hàng</option>
                            <option value="PAID">Đã hoàn tất</option>
                            <option value="FAILED">Thanh toán lỗi</option>
                            <option value="EXPIRED">Đã hết hạn</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border border-white/5 shadow-2xl" style={{ borderRadius: '24px' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-muted text-xs uppercase tracking-widest">
                                <th className="p-6 font-bold">Mã Đơn / Khách hàng</th>
                                <th className="p-6 font-bold"><div className="flex items-center gap-2">Ngày tạo <ArrowUpDown size={14} /></div></th>
                                <th className="p-6 font-bold text-center">Trạng thái</th>
                                <th className="p-6 font-bold text-right">Tổng tiền</th>
                                <th className="p-6 font-bold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-muted italic">Không tìm thấy đơn hàng nào khớp với bộ lọc</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-white text-sm font-bold tracking-wider group-hover:text-green-400 transition-colors">
                                                    #{order.id.toUpperCase()}
                                                </span>
                                                <span className="text-muted text-xs flex items-center gap-1.5 capitalize">
                                                    👤 {order.user?.username || 'Khách vãng lai'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1 text-muted text-[13px]">
                                                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                                <span className="pl-5 opacity-60 text-[11px]">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <StatusBadge status={order.status} />
                                                <select
                                                    className="bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-[11px] text-white/60 focus:border-green-500 outline-none cursor-pointer"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="PENDING">Chờ thanh toán</option>
                                                    <option value="RESERVED">Đang giữ hàng</option>
                                                    <option value="PAID">Đã hoàn tất</option>
                                                    <option value="FAILED">Thanh toán lỗi</option>
                                                    <option value="EXPIRED">Đã hết hạn</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="text-white font-bold text-lg tracking-tight">
                                                {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="inline-flex p-3 bg-white/5 hover:bg-green-500/20 text-white hover:text-green-400 rounded-xl transition-all border border-white/5"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-muted text-sm px-4">
                <p>Hiển thị <strong>{filteredOrders.length}</strong> / <strong>{orders.length}</strong> đơn hàng</p>
                <div className="opacity-60 italic">Cập nhật tự động mỗi khi trạng thái thay đổi</div>
            </div>
        </div>
    );
};

export default AdminOrders;
