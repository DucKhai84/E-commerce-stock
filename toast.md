I am building a React frontend using Vite.

Design and implement a reusable Toast Notification system for my application.

Context:
- This is an e-commerce application
- Toasts will be used for user feedback (success, error, warning, info)

Functional requirements:

- Show toast notifications for:
  - Success (e.g. "Added to cart")
  - Error (e.g. "Login failed")
  - Warning
  - Info

- Each toast should include:
  - Message
  - Optional title
  - Icon based on type
  - Close (dismiss) button

- Toast behavior:
  - Auto dismiss after 3–5 seconds
  - Pause on hover
  - Allow manual close
  - Support multiple toasts (stacked)
  - New toast appears on top

UI requirements:

- Position: top-right corner
- Responsive design (mobile-friendly)
- Smooth animation:
  - Fade in / slide in
  - Fade out on dismiss

- Visual style:
  - Modern (similar to Facebook / Shopify)
  - Different colors per type:
    - Success: green
    - Error: red
    - Warning: orange
    - Info: blue

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useContext)
- Create a global Toast Provider

Component structure:

- ToastProvider (context)
- ToastContainer (render list)
- ToastItem (single toast)

API design:

- Provide a hook:
  useToast()

- Usage example:
  toast.success("Added to cart")
  toast.error("Something went wrong")

State structure:

{
  id: string,
  type: "success" | "error" | "warning" | "info",
  message: string,
  duration: number
}

Additional requirements:

- Prevent duplicate toasts (optional)
- Limit max number of visible toasts (e.g. 5)
- Handle edge cases (rapid firing)

Output:

- Folder structure
- Full working React code
- Toast context implementation
- Example usage in a component (e.g. Add to Cart button)
- Explanation of data flow