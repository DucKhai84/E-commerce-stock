import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import ProductTable from '../components/Admin/ProductTable';
import ProductFormModal from '../components/Admin/ProductFormModal';
import ConfirmDialog from '../components/Admin/ConfirmDialog';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // Modals state
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    // Track selected product
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Progress
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toast = useToast();

    const loadProducts = useCallback(async () => {
        setIsFetching(true);
        try {
            const data = await AppApi.getProducts();
            setProducts(data);
        } catch (err) {
            toast.error(err.message || 'Không thể tải kho hàng.', 'Lỗi Hệ Thống');

            // Mock data usage if backend is dead
            console.log('Chuyển sang Offline Mock Data cho Sản Phẩm');
            setProducts([
                { id: '1', name: 'MacBook Pro 16" M3 Max', description: '', price: 3499, stock: 12, category: { name: 'Điện toán' } },
                { id: '2', name: 'Sony WH-1000XM5', description: '', price: 399, stock: 0, category: { name: 'Tai nghe' } }
            ]);
        } finally {
            setIsFetching(false);
        }
    }, [toast]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setFormModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setFormModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (selectedProduct) {
                await AppApi.updateProduct(selectedProduct.id, formData);
                toast.success(`Đã cập nhật hàng hóa: ${formData.name}`, 'Lưu Thành Công');
            } else {
                await AppApi.createProduct(formData);
                toast.success(`Đã bổ sung ${formData.name} vào kho!`, 'Nhập Kho Thành Công');
            }
            setFormModalOpen(false);
            loadProducts();
        } catch (err) {
            toast.error(err.message || 'Nhập kho thất bại do máy chủ từ chối', 'Cảnh Báo');

            // Mock flow
            if (!selectedProduct) {
                toast.info("Đã tạo mới trên bộ nhớ giả lập (Offline Mode).");
                setProducts([{ id: Date.now().toString(), ...formData, category: { name: 'Tự chọn (Giả lập)' } }, ...products]);
                setFormModalOpen(false);
            } else {
                toast.info("Đã cập nhật trên bộ nhớ giả lập (Offline Mode).");
                setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...formData, category: p.category || { name: 'Tự chọn' } } : p));
                setFormModalOpen(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDelete = (product) => {
        setSelectedProduct(product);
        setConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        setIsSubmitting(true);
        try {
            await AppApi.deleteProduct(selectedProduct.id);
            toast.success(`Hàng hóa đã bị tiêu hủy hợp lệ`, 'Xóa Thành Công');
            setConfirmModalOpen(false);
            loadProducts();
        } catch (err) {
            toast.error(err.message || 'Hệ thống báo lỗi khi cố xuất hủy.', 'Lỗi Thao Tác');

            // Mock flow
            toast.info("Đã ẩn sản phẩm khỏi kho (Offline Mode).");
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setConfirmModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="animate-fade-in" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: '36px', marginBottom: '8px' }}>Quản Lý Kho Nhập Hàng</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Phân hệ dành cho Admin (Tạo/Sửa sản phẩm)</p>
                    </div>

                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleOpenCreate}>
                        <Plus size={18} /> Nhập Kho Mới
                    </button>
                </div>

                <ProductTable
                    products={products}
                    isLoading={isFetching}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            </div>

            <ProductFormModal
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedProduct}
                isLoading={isSubmitting}
            />

            <ConfirmDialog
                isOpen={confirmModalOpen}
                title="Tiêu Hủy Sản Phẩm"
                message={`Bạn có chắc chắn muốn xóa vĩnh viễn mặt hàng "${selectedProduct?.name}" khỏi kho lưu trữ? Thao tác này không thể thu hồi.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmModalOpen(false)}
                isLoading={isSubmitting}
            />
        </>
    );
};

export default ProductPage;
