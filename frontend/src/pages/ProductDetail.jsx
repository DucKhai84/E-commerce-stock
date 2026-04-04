import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppApi } from '../services/api';
import MentionInput from '../components/MentionInput';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const toast = useToast();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await AppApi.getProductById(id);
                setProduct(data);
                if (data.reviews) setReviews(data.reviews);
            } catch (err) {
                toast.error("Không thể tải thông tin sản phẩm.", "Lỗi kết nối");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, toast]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            toast.success("Sản phẩm đã được đẩy vào giỏ hàng của bạn.", "Thêm thành công");
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
                <div style={{ flex: '1 1 400px', minHeight: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                    💻
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

            <div style={{ marginTop: '60px' }}>
                <h2 style={{ marginBottom: '32px' }}>Phản Hồi Của Khách Hàng</h2>

                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px', color: 'var(--text-muted)' }}>Viết đánh giá (Gõ phím @ để nhắc tên)</h3>
                    <MentionInput
                        onSubmit={(val, mentions) => {
                            toast.success("Hệ thống đã ghi nhận đánh giá của bạn!", "Đăng tải thành công");
                            setReviews([{ id: Date.now(), comment: val, user: { fullName: "Chính Bạn" } }, ...reviews]);
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviews.map(rev => (
                        <div key={rev.id} className="glass-panel" style={{ padding: '24px' }}>
                            <div style={{ fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>{rev.user.fullName}</div>
                            <p style={{ color: 'var(--text-muted)' }}>{rev.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
