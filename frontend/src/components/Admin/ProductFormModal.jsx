import React, { useState, useEffect } from 'react';
import { AppApi } from '../../services/api';
import './Admin.css';

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            // Tải danh mục mỗi khi mở nắp Modal
            AppApi.getCategories().then(setCategories).catch((err) => {
                console.warn("Không thể tải Category:", err);
            });

            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    price: initialData.price || '',
                    stock: initialData.stock || '',
                    categoryId: initialData.categoryId || (initialData.category?.id) || ''
                });
                setPreview(initialData.imageUrl ? `http://localhost:3000${initialData.imageUrl}` : '');
            } else {
                setFormData({ name: '', description: '', price: '', stock: '', categoryId: '' });
                setPreview('');
            }
            setImageFile(null);
            setErrors({});
        }

        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
        if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Tồn kho không được nhỏ hơn 0';
        if (!formData.categoryId) newErrors.categoryId = 'Xin hãy chọn một phân loại danh mục';
        if (!initialData && !imageFile) newErrors.image = 'Vui lòng chọn ảnh sản phẩm';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            data.append('categoryId', formData.categoryId);
            if (imageFile) {
                data.append('image', imageFile);
            }
            onSubmit(data);
        }
    };

    return (
        <div className="admin-modal-overlay animate-fade-in" style={{ overflowY: 'auto', padding: '20px 0' }}>
            <div className="glass-panel admin-modal" style={{ margin: 'auto' }}>
                <h3 className="admin-modal-title gradient-text">
                    {initialData ? 'Sửa Yết Thị Hàng Hóa' : 'Thêm Sản Phẩm Mới'}
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Tên Sản Phẩm *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="VD: iPhone 15 Pro Max"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                        />
                        {errors.name && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Đơn Giá ($) *</label>
                            <input
                                className="input-field"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                disabled={isLoading}
                            />
                            {errors.price && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.price}</span>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Tồn Kho (Cái) *</label>
                            <input
                                className="input-field"
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                disabled={isLoading}
                            />
                            {errors.stock && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.stock}</span>}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Phân Loại Danh Mục *</label>
                        <select
                            className="input-field"
                            style={{ padding: '12px', WebkitAppearance: 'none' }}
                            value={formData?.categoryId || ''}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            disabled={isLoading}
                        >
                            <option value="" disabled>-- Chọn phân loại phù hợp --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.categoryId}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Ảnh Sản Phẩm *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="product-image-upload"
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="product-image-upload"
                                className="input-field"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderStyle: 'dashed',
                                    height: '120px'
                                }}
                            >
                                {imageFile ? 'Đổi ảnh khác' : 'Chọn ảnh sản phẩm'}
                            </label>
                            {errors.image && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.image}</span>}
                        </div>
                        {preview && (
                            <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Mô Tả Sản Phẩm</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Giới thiệu nhanh về tính năng..."
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu truyền...' : 'Lưu Vào Kho'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
