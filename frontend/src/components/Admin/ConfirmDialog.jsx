import React from 'react';
import './Admin.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay animate-fade-in">
            <div className="glass-panel admin-modal">
                <h3 className="admin-modal-title" style={{ color: '#ef4444' }}>{title}</h3>
                <p className="admin-modal-desc">{message}</p>

                <div className="admin-modal-footer">
                    <button
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Hủy Bỏ
                    </button>
                    <button
                        className="btn-primary"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
