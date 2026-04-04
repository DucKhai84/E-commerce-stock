import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const maxToasts = 5;

    const addToast = useCallback((type, message, title = '') => {
        const id = Math.random().toString(36).substr(2, 9);

        setToasts((prev) => {
            // Prevent rapid fire duplicates of exact same message
            if (prev.some(t => t.message === message && Date.now() - t.timestamp < 1000)) {
                return prev;
            }

            const newToasts = [...prev, { id, type, message, title, timeout: 4000, timestamp: Date.now() }];
            // Keep only maxToasts
            if (newToasts.length > maxToasts) {
                return newToasts.slice(newToasts.length - maxToasts);
            }
            return newToasts;
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (message, title) => addToast('success', message, title),
        error: (message, title) => addToast('error', message, title),
        warning: (message, title) => addToast('warning', message, title),
        info: (message, title) => addToast('info', message, title),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
