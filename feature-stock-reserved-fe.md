I am building a React frontend using Vite for an e-commerce application.

The backend supports a reservation system (hold stock for 10 minutes).

When a user clicks "Place Order", the system should create a reservation instead of immediately completing the order.

Backend API:

POST /api/v1/orders

Request:
{
  "paymentMethod": "COD",
  "orderItems": [
    {
      "productId": "string",
      "quantity": number,
      "price": number
    }
  ]
}

Behavior:
- The backend will:
  - Reserve stock (status: RESERVED)
  - Hold items for 10 minutes
  - Clear the cart

Task:

Implement the frontend behavior when user clicks "Place Order".

Functional requirements:

- When clicking "Place Order":
  - Call POST /api/v1/orders
  - Send correct orderItems from cart

- On success:
  - Show success toast:
    "Order placed successfully. Items are reserved for 10 minutes."
  - Clear cart state on frontend
  - Navigate user to Home page ("/")

- On failure:
  - Show error toast:
    "Failed to place order. Please try again."

UI/UX requirements:

- Disable "Place Order" button while loading
- Show loading indicator during API call
- Prevent duplicate submissions

Technical requirements:

- React + Vite
- React Router (for navigation)
- Use toast system (custom or library)
- Use JWT token from localStorage ("accessToken")
- Axios or fetch for API calls

State management:

- Get cart data from state or context
- After success:
  - Reset cart state
  - Optionally refetch cart

Component context:

- CheckoutPage
- OrderSummary component with "Place Order" button

Additional requirements:

- Handle API errors (401, 500)
- Redirect to login if unauthorized
- Ensure correct mapping of orderItems

Output:

- Full React code for handling "Place Order"
- Example function handlePlaceOrder()
- Integration with toast system
- Navigation logic using React Router
- Explanation of data flow (click → API → toast → redirect)