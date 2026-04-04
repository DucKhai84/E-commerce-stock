I am building a React frontend using Vite.

Using the features of the "beautifulMention" library, design a UI for a comment input box with the following requirements:

- Users can type "@" to mention other users
- When typing "@", show a dropdown list of users fetched from an API
- Support async search (call API when user types)
- Display avatar + username in the suggestion list
- When a user is selected, render it as a styled mention tag
- Store mention data in a structured format (id, name)

UI requirements:
- Responsive layout
- Highlight selected item in dropdown

Technical requirements:
- Use React functional components
- Use hooks (useState, useEffect)
- Separate components (MentionInput, MentionList, MentionItem)
- Show example mock API

Output:
- Component structure
- Sample code
- UI behavior explanation

---

### TỔNG HỢP API ENDPOINT (E-COMMERCE BACKEND)

#### 1. Authentication (Xác thực)

**POST /api/v1/auth/register**
```json
Request:
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "string (ObjectId)",
    "fullName": "string",
    "email": "string",
    "role": "USER",
    "createdAt": "date-time"
  }
}
```

**POST /api/v1/auth/login**
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "message": "Login successful",
  "token": "string (JWT)",
  "user": {
    "id": "string (ObjectId)",
    "fullName": "string",
    "email": "string",
    "role": "USER",
    "createdAt": "date-time"
  }
}
```

#### 2. Catalog (Sản phẩm & Danh mục)

**GET /api/v1/categories**
```json
Response:
[
  {
    "id": "string (ObjectId)",
    "name": "string",
    "description": "string"
  }
]
```

**GET /api/v1/products**
```json
Response:
[
  {
    "id": "string (ObjectId)",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "categoryId": "string",
    "createdAt": "date-time"
  }
]
```

#### 3. Cart System (Giỏ hàng)

**POST /api/v1/cart**
```json
Request:
{
  "productId": "string (ObjectId)",
  "quantity": "number"
}

Response:
{
  "id": "string (ObjectId)",
  "cartId": "string (ObjectId)",
  "productId": "string (ObjectId)",
  "quantity": "number"
}
```

**GET /api/v1/cart**
```json
Response:
{
  "id": "string (ObjectId)",
  "userId": "string (ObjectId)",
  "createdAt": "date-time",
  "cartItems": [
    {
      "id": "string (ObjectId)",
      "cartId": "string (ObjectId)",
      "productId": "string (ObjectId)",
      "quantity": "number",
      "product": {
        "name": "string",
        "price": "number"
      }
    }
  ]
}
```

**PUT /api/v1/cart/:cartItemId**
```json
Request:
{
  "quantity": "number"
}

Response:
{
  "id": "string",
  "quantity": "number"
}
```

#### 4. Orders (Đặt hàng)

**POST /api/v1/orders**
```json
Request:
{
  "paymentMethod": "enum (COD, PAYPAL, CREDIT_CARD...)",
  "orderItems": [
    {
      "productId": "string (ObjectId)",
      "quantity": "number",
      "price": "number"
    }
  ]
}

Response:
{
  "id": "string (ObjectId)",
  "userId": "string (ObjectId)",
  "totalAmount": "number",
  "status": "PENDING",
  "createdAt": "date-time"
}
```

#### 5. Addresses (Địa chỉ giao hàng)

**POST /api/v1/addresses**
```json
Request:
{
  "addressLine": "string",
  "city": "string",
  "district": "string",
  "ward": "string"
}

Response:
{
  "id": "string (ObjectId)",
  "userId": "string (ObjectId)",
  "addressLine": "string",
  "city": "string",
  "district": "string",
  "ward": "string"
}
```

**GET /api/v1/addresses**
```json
Response:
[
  {
    "id": "string (ObjectId)",
    "userId": "string (ObjectId)",
    "addressLine": "string",
    "city": "string",
    "district": "string",
    "ward": "string"
  }
]
```

#### 6. Reviews (Đánh giá sản phẩm)

**POST /api/v1/products/:productId/reviews**
```json
Request:
{
  "rating": "number (1-5)",
  "comment": "string"
}

Response:
{
  "id": "string (ObjectId)",
  "userId": "string (ObjectId)",
  "productId": "string (ObjectId)",
  "rating": "number",
  "comment": "string",
  "createdAt": "date-time"
}
```

**GET /api/v1/products/:productId/reviews**
```json
Response:
[
  {
    "id": "string (ObjectId)",
    "userId": "string (ObjectId)",
    "productId": "string (ObjectId)",
    "rating": "number",
    "comment": "string",
    "createdAt": "date-time",
    "user": {
      "fullName": "string"
    }
  }
]
```

#### 7. Users

**GET /api/v1/users**
*(Quyền ADMIN)*
```json
Response:
[
  {
    "id": "string (ObjectId)",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "createdAt": "date-time"
  }
]
```