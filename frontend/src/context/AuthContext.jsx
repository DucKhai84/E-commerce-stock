import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Lỗi khi đọc dữ liệu User từ kho lưu trữ");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken, newUserInfo) => {
        setToken(newToken);
        setUser(newUserInfo);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('token', newToken); // For backward compatibility with older code
        localStorage.setItem('user', JSON.stringify(newUserInfo));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được bọc trong AuthProvider');
    }
    return context;
};
