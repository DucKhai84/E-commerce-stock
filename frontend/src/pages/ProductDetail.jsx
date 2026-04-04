import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';

const ProductDetail = () => {
    const { id } = useParams();
    const toast = useToast();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        try {
            const data = await AppApi.getProductById(id);
            setProduct(data);
        } catch (err) {
            toast.error("Không thể tải thông tin sản phẩm.", "Lỗi kết nối");
        } finally {
            setLoading(false);
        }
    }, [id, toast]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            toast.success("Sản phẩm đã được đẩy vào giỏ hàng của bạn.", "Thêm thành công");
        }
    };

    const handleNewReview = async (rating, comment) => {
        try {
            await AppApi.addReview(id, { rating, comment });
            toast.success("Cảm ơn bạn đã đánh giá!", "Gửi thành công");
            await fetchProduct(); // Refresh reviews
        } catch (err) {
            toast.error(err.message || "Không thể gửi đánh giá.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
        try {
            await AppApi.deleteReview(id, reviewId);
            toast.success("Đã xóa đánh giá thành công", "Hệ thống");
            await fetchProduct();
        } catch (err) {
            toast.error(err.message || "Không thể xóa đánh giá.");
        }
    };

    if (loading) return <div style={{ marginTop: '40px' }}>Đang nạp chi tiết sản phẩm...</div>;

    if (!product) return (
        <div style={{ marginTop: '40px' }}>
            <h2>Không tìm thấy sản phẩm hoặc lỗi kết nối.</h2>
            <Link to="/" style={{ color: 'var(--accent)' }}>Quay lại trang chủ</Link>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ marginTop: '40px' }}>
            <Link to="/" style={{ color: 'var(--accent)', marginBottom: '20px', display: 'inline-block' }}>← Quay lại danh mục</Link>

            <div className="glass-panel" style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 400px', minHeight: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', overflow: 'hidden' }}>
                    {product.imageUrl ? (
                        <img src={`http://localhost:3000${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        "💻"
                    )}
                </div>

                <div style={{ flex: '1 1 400px' }}>
                    <h1 className="gradient-text" style={{ fontSize: '36px', marginBottom: '16px' }}>{product.name}</h1>
                    <p className="product-price" style={{ fontSize: '28px', marginBottom: '24px' }}>${product.price}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px', lineHeight: '1.8' }}>
                        {product.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                        <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }} onClick={handleAddToCart}>
                            Bỏ Vào Giỏ
                        </button>
                        <div style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Tồn kho: {product.stock}
                        </div>
                    </div>
                </div>
            </div>

            <ReviewSection
                productId={id}
                reviews={product.reviews || []}
                onNewReview={handleNewReview}
                onDeleteReview={handleDeleteReview}
            />
        </div>
    );
};

export default ProductDetail;
