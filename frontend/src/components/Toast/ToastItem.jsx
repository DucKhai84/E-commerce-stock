import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
    success: <CheckCircle size={20} className="toast-icon toast-icon-success" />,
    error: <XCircle size={20} className="toast-icon toast-icon-error" />,
    warning: <AlertTriangle size={20} className="toast-icon toast-icon-warning" />,
    info: <Info size={20} className="toast-icon toast-icon-info" />
};

const ToastItem = ({ toast, removeToast }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const timerRef = useRef(null);

    const startTimer = () => {
        timerRef.current = setTimeout(() => {
            handleClose();
        }, toast.timeout || 4000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleClose = () => {
        setIsFadingOut(true);
        // Wait for the exit animation to finish before unmounting
        setTimeout(() => {
            removeToast(toast.id);
        }, 300); // matching animation length
    };

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, []);

    return (
        <div
            className={`toast-item ${isFadingOut ? 'toast-fade-out' : 'toast-slide-in'} toast-${toast.type}`}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
        >
            <div className="toast-icon-container">
                {ICONS[toast.type]}
            </div>

            <div className="toast-content">
                {toast.title && <h4 className="toast-title">{toast.title}</h4>}
                <p className="toast-message">{toast.message}</p>
            </div>

            <button className="toast-close-btn" onClick={handleClose}>
                <X size={16} />
            </button>

            {/* Optional: Add a progress bar visually indicating duration */}
            <div className="toast-progress" style={{ animationDuration: `${toast.timeout}ms` }} />
        </div>
    );
};

export default ToastItem;
