import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import CategoryTable from '../components/Admin/CategoryTable';
import CategoryFormModal from '../components/Admin/CategoryFormModal';
import ConfirmDialog from '../components/Admin/ConfirmDialog';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // Modals state
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    // Track selected category for Edit / Delete
    const [selectedCategory, setSelectedCategory] = useState(null);

    // API call loading states
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toast = useToast();

    const loadCategories = useCallback(async () => {
        setIsFetching(true);
        try {
            const data = await AppApi.getCategories();
            setCategories(data);
        } catch (err) {
            toast.error(err.message || 'Không thể tải danh sách danh mục.', 'Lỗi Dữ Liệu');
            // Mock data for display if backend is down
            console.log('Sử dụng dữ liệu giả (offline mode)');
            setCategories([
                { id: '1', name: 'Điện thoại di động', description: 'Smartphones cao cấp nhất' },
                { id: '2', name: 'Máy tính xách tay', description: 'Laptop văn phòng và workstation' }
            ]);
        } finally {
            setIsFetching(false);
        }
    }, [toast]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Handle Create / Edit logic
    const handleOpenCreate = () => {
        setSelectedCategory(null);
        setFormModalOpen(true);
    };

    const handleOpenEdit = (category) => {
        setSelectedCategory(category);
        setFormModalOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (selectedCategory) {
                // UPDATE API
                await AppApi.updateCategory(selectedCategory.id, formData);
                toast.success(`Đã cập nhật danh mục: ${formData.name}`, 'Cập nhật thành công');
            } else {
                // CREATE API
                await AppApi.createCategory(formData);
                toast.success(`Đã tạo mới danh mục: ${formData.name}`, 'Tạo thành công');
            }
            setFormModalOpen(false);
            loadCategories(); // Refresh list
        } catch (err) {
            toast.error(err.message || 'Sự cố kết nối hệ thống', 'Lưu biểu mẫu thất bại');

            // MOCK UPDATE IF OFFLINE:
            if (!selectedCategory) {
                toast.info("Đã tạo mới trên bộ nhớ giả lập (Offline Mode).");
                setCategories([{ id: Date.now().toString(), name: formData.name, description: formData.description }, ...categories]);
                setFormModalOpen(false);
            } else {
                toast.info("Đã cập nhật trên bộ nhớ giả lập (Offline Mode).");
                setCategories(categories.map(c => c.id === selectedCategory.id ? { ...c, ...formData } : c));
                setFormModalOpen(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete logic
    const handleOpenDelete = (category) => {
        setSelectedCategory(category);
        setConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return;
        setIsSubmitting(true);
        try {
            await AppApi.deleteCategory(selectedCategory.id);
            toast.success(`Danh mục đã bị xóa vĩnh viễn`, 'Xóa Thành Công');
            setConfirmModalOpen(false);
            loadCategories();
        } catch (err) {
            toast.error(err.message || 'Cơ sở dữ liệu đang có vấn đề.', 'Lỗi Xóa Dữ Liệu');

            // MOCK DELETE IF OFFLINE:
            toast.info("Đã ẩn danh mục trên bộ nhớ giả lập (Offline Mode).");
            setCategories(categories.filter(c => c.id !== selectedCategory.id));
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
                        <h1 className="gradient-text" style={{ fontSize: '36px', marginBottom: '8px' }}>Quản Quản Danh Mục</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Phân hệ dành cho Ban Quản Trị Hệ Thống (Admin)</p>
                    </div>

                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleOpenCreate}>
                        <Plus size={18} /> Thêm Danh Mục
                    </button>
                </div>

                <CategoryTable
                    categories={categories}
                    isLoading={isFetching}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            </div>

            {/* Form Dialog for Create & Edit */}
            <CategoryFormModal
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedCategory}
                isLoading={isSubmitting}
            />

            {/* Confirm Dialog for Deletion */}
            <ConfirmDialog
                isOpen={confirmModalOpen}
                title="Cảnh Cáo Xóa Hệ Thống"
                message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.name}"? Hệ thống không thể phục hồi dữ liệu này.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmModalOpen(false)}
                isLoading={isSubmitting}
            />
        </>
    );
};

export default CategoryPage;
