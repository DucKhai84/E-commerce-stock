import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ marginTop: '50px', textAlign: 'center' }}>Đang kiểm tra phân quyền bảo mật cấp cao...</div>;
    }

    // Redirect to login if completely logged out
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Redirect to 403 Access Denied if User is not an admin
    if (user.role !== 'ADMIN') {
        return <Navigate to="/403" replace />;
    }

    // Render admin child routes
    return <Outlet />;
};

export default AdminRoute;
