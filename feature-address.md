I am building a React frontend using Vite for an e-commerce application.

The backend provides the following APIs:

Address Management:

POST /addresses
Request:
{
  "addressLine": "string",
  "city": "string",
  "district": "string",
  "ward": "string"
}

GET /addresses

Order API:

POST /orders
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

Note:
- userId is extracted from JWT token
- After placing order:
  - Stock is updated
  - Payment is created (PENDING)
  - Cart is cleared automatically

Task:

Design and implement a Checkout Page where users can:

1. View their cart items
2. Select an existing address
3. Add a new address directly during checkout
4. Place an order

Functional requirements:

Address section:

- Fetch user addresses using GET /addresses
- Display list of addresses (radio selection)
- Provide button "Add New Address"

- When clicking "Add New Address":
  - Open a form (modal or inline)
  - Fields:
    - addressLine
    - city
    - district
    - ward
  - Submit → call POST /addresses
  - After success:
    - Refresh address list
    - Auto select the newly created address

Order section:

- Display cart items (name, quantity, price)
- Show total amount

- Payment method:
  - Select option (default: COD)

- Place order:
  - Call POST /orders
  - Use cart data as orderItems

UI requirements:

- Clean checkout layout (2 columns: Address + Order Summary)
- Responsive design
- Highlight selected address
- Modal or inline form for adding address

UX requirements:

- Show loading state when fetching addresses
- Show loading when submitting address or placing order
- Disable "Place Order" if no address selected
- Show empty state if no address exists

Feedback (Toast):

- "Address added successfully"
- "Order placed successfully"
- Show error toast if API fails

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Axios or fetch
- JWT token from localStorage ("accessToken")

Component structure:

- CheckoutPage
- AddressList
- AddressForm (modal)
- OrderSummary

Additional requirements:

- Validate address form (all fields required)
- Reset form after submit
- Handle API errors (401, 500)
- Redirect to order success page after placing order

Output:

- Folder structure
- Full working React code
- API services (addressService.js, orderService.js)
- Example integration with cart data
- Explanation of data flow (address → selection → order)