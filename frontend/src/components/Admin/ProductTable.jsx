import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const ProductTable = ({ products, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div className="admin-status-box">Đang tải kho hàng...</div>;
    }

    if (!products || products.length === 0) {
        return (
            <div className="admin-status-box glass-panel">
                <p>Hiện không tìm chấy sản phẩm nào trong kho.</p>
            </div>
        );
    }

    return (
        <div className="admin-table-wrapper glass-panel">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Tên Sản Phẩm</th>
                        <th>Loại</th>
                        <th>Đơn Giá</th>
                        <th>Tồn Kho</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id}>
                            <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>{prod.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{prod.category?.name || 'Khác'}</td>
                            <td style={{ color: '#10b981', fontWeight: 600 }}>${prod.price}</td>
                            <td style={{ color: prod.stock > 0 ? 'var(--text-main)' : '#ef4444' }}>{prod.stock > 0 ? prod.stock : 'Hết hàng'}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => onEdit(prod)}
                                        className="action-btn edit-btn"
                                        title="Chỉnh Sửa Sản Phẩm"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(prod)}
                                        className="action-btn delete-btn"
                                        title="Xóa Bỏ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
