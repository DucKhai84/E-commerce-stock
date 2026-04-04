const BASE_URL = 'http://localhost:3000/api/v1';

export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Attempt parsing json regardless of ok to get error message
        let data;
        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok) {
            throw new Error((data && data.message) || `API Error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
};

export const AppApi = {
    // Auth
    login: (credentials) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    // Products & Categories
    getCategories: () => apiCall('/categories', { method: 'GET' }),
    createCategory: (data) => apiCall('/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id, data) => apiCall(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCategory: (id) => apiCall(`/categories/${id}`, { method: 'DELETE' }),

    getProducts: () => apiCall('/products', { method: 'GET' }),
    getProductById: (id) => apiCall(`/products/${id}`, { method: 'GET' }),
    createProduct: (data) => apiCall('/products', { method: 'POST', body: data }),
    updateProduct: (id, data) => apiCall(`/products/${id}`, { method: 'PUT', body: data }),
    deleteProduct: (id) => apiCall(`/products/${id}`, { method: 'DELETE' }),

    // Addresses
    getAddresses: () => apiCall('/addresses', { method: 'GET' }),
    createAddress: (data) => apiCall('/addresses', { method: 'POST', body: JSON.stringify(data) }),

    // Orders
    placeOrder: (data) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getOrders: () => apiCall('/orders', { method: 'GET' }),

    // Cart
    getCart: () => apiCall('/cart', { method: 'GET' }),
    addToCart: (data) => apiCall('/cart', { method: 'POST', body: JSON.stringify(data) }),
    removeFromCart: (itemId) => apiCall(`/cart/${itemId}`, { method: 'DELETE' }),

    // Reviews
    getReviews: (productId) => apiCall(`/products/${productId}/reviews`, { method: 'GET' }),
    addReview: (productId, data) => apiCall(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
    deleteReview: (productId, reviewId) => apiCall(`/products/${productId}/reviews/${reviewId}`, { method: 'DELETE' }),

    // Mention search
    searchUsers: (query) => apiCall(`/users?q=${encodeURIComponent(query)}`, { method: 'GET' })
};
