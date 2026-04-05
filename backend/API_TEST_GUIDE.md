# 🛒 E-commerce API v1 - Ultimate Test Guide

This guide contains EVERY endpoint available in the system, organized by resource and business flow.

## 🌐 Base URL
`http://localhost:3000/api/v1`

---

## 👨‍💻 Roles & Permissions (Realistic)

| Role | Permissions |
| :--- | :--- |
| **GUEST** | Can only Register or Login. |
| **USER** | View Categories/Products, Manage **OWN** Cart, Addresses, Orders & Reviews. |
| **ADMIN** | Full access: Manage all Users, Products, Categories, Orders, Inventory, and Payments. |

---

## 🔐 Authentication
**1. Login:** `POST /auth/login` -> Copy `token`.
**2. Header:** Use Header `Authorization: Bearer <TOKEN>` for all requests below.

---

## 📦 1. Shopping Flow (Categories & Products)

### Get All Categories (Clean View)
- **GET /categories** (Returns simple list without nested products)

### Get All Products
- **GET /products**

---

## 🛒 2. Cart System (Giỏ hàng)

### Add to Cart
- **POST /cart**
```json
{
  "productId": "PROD_ID_HERE",
  "quantity": 2
}
```

### View My Cart
- **GET /cart** (Returns items with current prices and total)

### Update Quantity / Remove
- **PUT /cart/:cartItemId** (JSON: `{"quantity": 5}`)
- **DELETE /cart/:cartItemId**

---

## 🏠 3. Address Management (Địa chỉ)

### Add New Address
- **POST /addresses**
```json
{
  "addressLine": "123 Main St",
  "city": "HCM City",
  "district": "District 1",
  "ward": "Ward 5"
}
```

### View My Addresses
- **GET /addresses**

---

## 💳 4. Order & Checkout Flow (Đặt hàng)

### 🔄 The Process:
1.  **Select Items:** Add to `Cart`.
2.  **Checkout:** Call `POST /orders`.
3.  **Automation:** 
    -   Stock is checked and decremented.
    -   A **Payment** record is auto-generated (`PENDING`).
    -   Your **Cart** is automatically cleared.

### Place Order
- **POST /orders**
```json
{
  "paymentMethod": "COD", 
  "orderItems": [
    {
      "productId": "PROD_ID",
      "quantity": 1,
      "price": 1500
    }
  ]
}
```
*(Note: userId is taken automatically from your token)*

---

## 💸 5. Payments (Thanh toán)

### View Order Payment Info
- **GET /payments/:orderId**

### Update Payment Status (Admin Only)
- **PUT /payments/:orderId/status**
```json
### Get All Payments (Admin Only)
- **GET /payments**

### Delete Payment Record (Admin Only)
- **DELETE /payments/:orderId**

---

## ⭐ 6. Product Reviews (Đánh giá)

### Add Review
- **POST /products/:productId/reviews**
```json
{
  "rating": 5,
  "comment": "Excellent quality laptop!"
}
```

### View Product Reviews
- **GET /products/:productId/reviews**

---

## 🛖 7. Inventory (Admin Only)
- **PUT /inventory/:id** (Update warehouse stock/location)

---

## 👥 8. Users
- **GET /users** (Admin Only - List all)
- **GET /users/:id** (Self/Admin - Profile)

## 🏷️ 9. Brands (Thương hiệu)
### Get All Brands
- **GET /brands**
### Create Brand (Admin Only)
- **POST /brands**
```json
{
  "name": "Apple",
  "description": "Premium electronics brand"
}
```

---

## 🖼️ 10. Product Gallery (Ảnh sản phẩm)
### Add Image (Admin Only)
- **POST /products/:productId/images**
```json
{
  "url": "/uploads/products/image1.jpg",
  "isMain": true
}
```
### Get All Product Images
- **GET /products/:productId/images**

---

## ❤️ 11. Wishlist (Sản phẩm yêu thích)
### Add to Wishlist
- **POST /wishlist** (JSON: `{"productId": "PROD_ID"}`)
### View My Wishlist
- **GET /wishlist**
### Remove from Wishlist
- **DELETE /wishlist/:productId**

---

## 📜 12. Activity Logs (Admin Only)
### View All Logs
- **GET /activity-logs** (Supports query: `?userId=...&action=...&page=1&limit=50`)
### View Log Detail
- **GET /activity-logs/:id**
### Delete Log Entry
- **DELETE /activity-logs/:id**
### Clear All Logs (Clean up)
- **DELETE /activity-logs**

---

## 🛡️ Business Rules (Quick Reference)
1. **Uniqueness:** Categories cannot have duplicate names.
2. **Safety:** Cannot delete categories that still have products.
3. **Stock:** Orders block if `quantity > stock`.
4. **Automation:** Orders auto-create Payment and auto-clear Cart.
5. **Ownership:** Users only manage their **OWN** data.
