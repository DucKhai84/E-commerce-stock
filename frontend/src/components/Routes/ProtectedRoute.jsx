import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ marginTop: '50px', textAlign: 'center' }}>Đang kiểm tra quyền truy cập...</div>;
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Render child routes
    return <Outlet />;
};

export default ProtectedRoute;
