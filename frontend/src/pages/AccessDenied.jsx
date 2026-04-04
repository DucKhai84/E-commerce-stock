import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDenied = () => {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '80px', textAlign: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '60px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: '#ef4444' }}>
                    <ShieldAlert size={80} />
                </div>

                <h1 className="gradient-text" style={{ fontSize: '32px', marginBottom: '16px' }}>
                    Truy cập bị từ chối
                </h1>

                <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
                    Bạn không có quyền quản trị viên (ADMIN) để xem nội dung hoặc tính năng này. Hãy quay về khu vực cửa hàng dành cho khách hàng.
                </p>

                <Link to="/" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px' }}>
                    Quay Về Trang Chủ
                </Link>
            </div>
        </div>
    );
};

export default AccessDenied;
