I am building an e-commerce backend system.

I want to implement a product reservation (stock holding) feature to prevent overselling.

Goal:

When a user adds a product to cart or starts checkout, the system should temporarily reserve (hold) the stock for 10 minutes.

If the user does not complete the order within 10 minutes, the reserved stock is released automatically.

Current system:

- Products have a "stock" field
- Users can add items to cart
- Orders are created via POST /orders

Task:

Design and implement a reservation system with the following requirements:

Core behavior:

- When user adds product to cart:
  - Check available stock
  - Reserve the requested quantity
  - Reduce available stock (but not permanently)

- Reservation duration:
  - 10 minutes (TTL)

- If order is placed within 10 minutes:
  - Reservation is converted into actual order
  - Stock is permanently reduced

- If reservation expires:
  - Automatically release reserved stock
  - Restore product stock

Data model:

- Create a Reservation (or CartItem with expiration):

{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "quantity": number,
  "status": "RESERVED" | "EXPIRED" | "COMPLETED",
  "expiresAt": "date-time"
}

API design:

- POST /cart → create reservation
- GET /cart → return only active (non-expired) reservations
- POST /orders:
  - Validate reservation still valid
  - Convert reservation → order

Concurrency requirements:

- Prevent overselling:
  - Use database transaction or locking
  - Ensure stock is not reserved beyond available quantity

Expiration handling:

Choose one approach (or both):

1. Background job (cron):
   - Run every minute
   - Find expired reservations
   - Release stock

2. Lazy expiration:
   - Check expiresAt on each request
   - Auto-expire if needed

Technical requirements:

- Use transactional logic (important)
- Handle race conditions (multiple users reserving same product)
- Ensure data consistency

Edge cases:

- User adds same product multiple times → merge or update reservation
- Reservation expires during checkout
- Server restart (must not lose reservation data)

Optional improvements:

- Redis for TTL-based reservation
- Queue system for cleanup
- Extend reservation time on user activity

Output:

- Database schema design
- API flow (cart → reservation → order)
- Sample code (service layer / pseudo code)
- Explanation of stock handling logic
- Explanation of concurrency control