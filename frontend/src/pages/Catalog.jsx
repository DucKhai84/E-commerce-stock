import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppApi } from '../services/api';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const data = await AppApi.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }, []);

    if (loading) return <div style={{ marginTop: '40px' }}>Đang tải danh sách sản phẩm...</div>;

    return (
        <div className="animate-fade-in" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '8px' }}>Danh Mục Sản Phẩm</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Khám phá các sản phẩm công nghệ tinh tế nhất.</p>
                </div>
            </div>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="glass-panel product-card">
                        <div className="product-image-placeholder" style={{ overflow: 'hidden' }}>
                            {product.imageUrl ? (
                                <img src={`http://localhost:3000${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                "📦"
                            )}
                        </div>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">{product.description}</p>
                        <div style={{ margin: '8px 0', fontSize: '14px', color: product.stock > 0 ? 'var(--accent)' : '#ff4d4f' }}>
                            {product.stock > 0 ? `Sẵn có: ${product.stock}` : 'Hết hàng hoặc đang được giữ'}
                        </div>
                        <div className="product-footer">
                            <span className="product-price">${product.price}</span>
                            <Link to={`/product/${product.id}`} className="btn-primary" style={{ padding: '8px 16px' }}>Xem Chi Tiết</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
