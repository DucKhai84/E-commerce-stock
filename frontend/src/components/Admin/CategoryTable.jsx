import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './Admin.css';

const CategoryTable = ({ categories, onEdit, onDelete, isLoading }) => {
    if (isLoading) {
        return <div className="admin-status-box">Đang tải biểu dữ liệu...</div>;
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="admin-status-box glass-panel">
                <p>Hiện chưa có danh mục nào trong hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="admin-table-wrapper glass-panel">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Tên Danh Mục</th>
                        <th>Mô Tả</th>
                        <th style={{ width: '150px', textAlign: 'center' }}>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>{cat.name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{cat.description || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Trống</span>}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="action-btn edit-btn"
                                        title="Chỉnh Sửa"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat)}
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

export default CategoryTable;
