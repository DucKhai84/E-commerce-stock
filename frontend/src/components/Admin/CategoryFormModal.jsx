import React, { useState, useEffect } from 'react';
import './Admin.css';

const CategoryFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        onSubmit(formData);
    };

    return (
        <div className="admin-modal-overlay animate-fade-in">
            <div className="glass-panel admin-modal">
                <h3 className="admin-modal-title gradient-text">
                    {initialData ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Tên Danh Mục *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="VD: Phụ kiện máy tính"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Mô Tả</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Mô tả chi tiết về danh mục..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading || !formData.name.trim()}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
