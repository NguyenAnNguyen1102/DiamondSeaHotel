import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra xem người dùng đã đăng nhập hay chưa khi khởi động
    useEffect(() => {
        const checkAuthStatus = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Hàm đăng nhập
    const login = async (email, password) => {
        try {
            const response = await api({
                method: 'post',
                url: '/login',
                data: { email, password }
            });

            if (response.data.success) {
                const userData = response.data.user;

                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem("user", JSON.stringify(userData));

                // Cập nhật state
                setUser(userData);
                setIsAuthenticated(true);

                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || "Đăng nhập thất bại"
                };
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Email hoặc mật khẩu không chính xác"
            };
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    };

    // Hàm đăng ký
    const register = async (fullName, email, password) => {
        try {
            const response = await api.post('/register', {
                userName: fullName,
                email,
                password
            });

            if (response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || "Đăng ký thất bại"
                };
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Email đã được sử dụng"
            };
        }
    };


    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const authContextValue = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        register,
        updateUser
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

