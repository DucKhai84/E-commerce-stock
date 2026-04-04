import React from 'react';
import ToastItem from './ToastItem';
import './Toast.css';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
