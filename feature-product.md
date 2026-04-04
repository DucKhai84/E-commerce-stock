I am building an Admin Dashboard for an e-commerce application using React (Vite).

Currently, the UI for adding a new product has NOT been implemented.

The backend provides the following API:

POST /api/v1/products

Request:
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "categoryId": "string"
}

Task:

Design and implement the "Add Product" UI for admin users.

Functional requirements:

- Provide a button "Add Product" in the Product Management page
- When clicked, open a modal or navigate to a form page

- The form must include:
  - Product name (text input)
  - Description (textarea)
  - Price (number input)
  - Stock (number input)
  - Category (dropdown select)

- Fetch categories from:
  GET /api/v1/categories

- On submit:
  - Call POST /api/v1/products
  - Send correct request payload

UI requirements:

- Clean admin dashboard style
- Responsive design
- Use form layout with labels and validation messages
- Show loading state when submitting
- Disable submit button while loading

Validation:

- Name is required
- Price must be > 0
- Stock must be ≥ 0
- Category must be selected

Feedback:

- Show success toast: "Product created successfully"
- Show error toast if API fails

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Axios or fetch
- Use JWT token from localStorage ("accessToken")

Component structure:

- ProductPage
- AddProductModal (or AddProductPage)
- CategorySelect

Additional requirements:

- Reset form after successful submit
- Handle API errors (401, 500)
- Redirect to product list after success (optional)

Output:

- Folder structure
- Full working React code
- API service (productService.js)
- Example integration with category API
- Explanation of data flow (form → API → update UI)