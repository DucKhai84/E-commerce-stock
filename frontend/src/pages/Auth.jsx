import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                toast.info("Hệ thống đang xác thực danh tính...");
                const { token, user } = await AppApi.login({ email: formData.email, password: formData.password });
                login(token, user);
                toast.success(`Tài khoản ${user.fullName || 'Người dùng'} đã truy cập!`, "Đăng nhập thành công");
                navigate('/');
            } else {
                toast.info("Đang khởi tạo hồ sơ của bạn...");
                await AppApi.register(formData);
                setIsLogin(true);
                toast.success("Hồ sơ đã tạo thành công! Hãy đăng nhập để tiếp tục.", "Chào mừng bạn");
            }
        } catch (err) {
            toast.error(err.message || 'Thiết lập thất bại. Vui lòng kiểm tra lại thông tin đã cung cấp.', "Quyền truy cập bị từ chối");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '28px' }} className="gradient-text">
                    {isLogin ? 'Chào mừng trở lại' : 'Đăng ký thành viên'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <input
                            name="fullName"
                            placeholder="Họ và Tên"
                            className="input-field"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Địa chỉ Email"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'Đang tải...' : (isLogin ? 'Đăng Nhập' : 'Xác Nhận Đăng Ký')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
                    {isLogin ? "Chưa có tài khoản?" : "Đã làm thành viên?"}{' '}
                    <span
                        onClick={() => { setIsLogin(!isLogin); }}
                        style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '500' }}
                    >
                        {isLogin ? 'Tạo mới' : 'Đăng nhập'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
