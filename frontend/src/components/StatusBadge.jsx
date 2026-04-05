import React from 'react';

const StatusBadge = ({ status }) => {
    const config = {
        PENDING: { label: 'Chờ thanh toán', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
        RESERVED: { label: 'Đang giữ hàng', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        PAID: { label: 'Đã hoàn tất', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
        FAILED: { label: 'Thanh toán lỗi', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        EXPIRED: { label: 'Đã hết hạn', color: 'bg-zinc-700/20 text-zinc-500 border-zinc-700/30' }
    };

    const { label, color } = config[status] || { label: status, color: 'bg-white/5 text-white/50 border-white/10' };

    return (
        <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${color} inline-flex items-center gap-1.5 transition-all`}>
            {status === 'RESERVED' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>}
            {label}
        </span>
    );
};

export default StatusBadge;
