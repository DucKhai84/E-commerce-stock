I am building a React frontend using Vite for an e-commerce application.

Problem:

After adding products to the cart, the cart UI does NOT display the items.

Backend API:

POST /api/v1/cart
Request:
{
  "productId": "string",
  "quantity": number
}

GET /api/v1/cart

Response:
{
  "id": "string",
  "userId": "string",
  "createdAt": "date-time",
  "cartItems": [
    {
      "id": "string",
      "productId": "string",
      "quantity": number,
      "product": {
        "name": "string",
        "price": number
      }
    }
  ]
}

Task:

Debug and fix the cart functionality so that added products are displayed correctly.

Requirements:

- After clicking "Add to Cart":
  - Call POST /api/v1/cart
  - Then refresh cart data using GET /api/v1/cart

- Display cart items:
  - Product name
  - Price
  - Quantity
  - Total per item (price × quantity)

- Ensure correct data mapping:
  - cartItems[].product.name
  - cartItems[].product.price

UI requirements:

- Show cart list properly
- Show empty state if cart is empty
- Show loading state while fetching cart

State management:

- Store cart data in state (useState or context)
- Update UI immediately after adding item

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Axios or fetch
- Use JWT token from localStorage ("accessToken")

Common issues to check:

- API response not mapped correctly
- cartItems is undefined or empty
- Missing re-fetch after POST
- Wrong property names (product.name vs name)
- Component not re-rendering

Component structure:

- CartPage
- CartItem
- CartList

Additional requirements:

- Handle API errors (401, 500)
- Show toast:
  - "Added to cart successfully"
  - "Failed to load cart"

Output:

- Identify possible causes of the bug
- Provide fixed React code
- Provide cartService.js
- Explain why the bug happened
- Show correct data flow (Add → Fetch → Render)