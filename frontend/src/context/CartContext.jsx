import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    // 1. Fetch from backend if logged in
    const syncCart = useCallback(async () => {
        if (!token) {
            // Offline fallback: load from localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error("Lỗi khi giải mã giỏ hàng");
                }
            }
            return;
        }

        setIsLoading(true);
        try {
            const data = await AppApi.getCart();
            console.log("[CartContext] Raw Cart Data from API:", data);

            // Map backend structure (cartItems[].product) to flat or consistent structure
            const items = (data.cartItems || []).map(item => {
                console.log("[CartContext] Processing Item:", item);
                return {
                    id: item.productId, // We use productId as primary key for UI logic
                    itemId: item.id,    // Database CartItem ID
                    name: item.product?.name || "Sản phẩm không xác định",
                    price: item.product?.price || 0,
                    quantity: item.quantity
                };
            });
            console.log("[CartContext] Mapped Cart Items:", items);
            setCart(items);
        } catch (err) {
            console.warn("Lỗi đồng bộ giỏ hàng với server:", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        syncCart();
    }, [syncCart]);

    // 2. Add to cart (Sync with backend)
    const addToCart = async (product, quantity = 1) => {
        console.log("[CartContext] Adding to cart:", product, quantity);
        if (token) {
            try {
                const response = await AppApi.addToCart({ productId: product.id, quantity });
                console.log("[CartContext] Added to cart (server response):", response);
                await syncCart(); // Refresh from DB
            } catch (err) {
                console.error("Không thể thêm vào giỏ hàng server:", err);
            }
        } else {
            // Local only fallback
            console.log("[CartContext] Local only (offline) mode.");
            setCart((prev) => {
                const exist = prev.find(i => i.id === product.id);
                const updated = exist
                    ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
                    : [...prev, { id: product.id, name: product.name, price: product.price, quantity }];

                console.log("[CartContext] Updated local cart:", updated);
                localStorage.setItem('cart', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const removeFromCart = async (productId, itemId) => {
        if (token && itemId) {
            try {
                await AppApi.removeFromCart(itemId);
                await syncCart();
            } catch (err) { console.error(err); }
        } else {
            setCart(prev => {
                const filtered = prev.filter(i => i.id !== productId);
                localStorage.setItem('cart', JSON.stringify(filtered));
                return filtered;
            });
        }
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    const cartCount = cart.reduce((count, item) => count + (item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, isLoading, refreshCart: syncCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
