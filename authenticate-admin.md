I am building a React frontend using Vite for an e-commerce application.

The backend provides authentication with JWT:

POST /api/v1/auth/login

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "ADMIN" | "USER"
  }
}

Task:

Implement role-based access control (RBAC) for the Admin Dashboard.

Requirements:

Authentication:

- After login, store JWT token in localStorage under key "accessToken"
- Store user info (including role) in localStorage or global state (Context)

Authorization (IMPORTANT):

- Only users with role "ADMIN" can access Admin Dashboard
- Users with role "USER" must NOT see admin UI

UI Behavior:

- If user is ADMIN:
  - Show Admin Dashboard (category management, product management, etc.)

- If user is NOT ADMIN:
  - Hide all admin features
  - Redirect to homepage or show "Access Denied"

Route Protection:

- Protect admin routes (e.g. /admin)
- If user is not logged in → redirect to login page
- If user role is not ADMIN → redirect or show 403 page

Technical requirements:

- React + Vite
- React Router
- Functional components
- Hooks (useState, useEffect, useContext)

Implementation details:

- Create AuthContext to store user and token
- Create ProtectedRoute component
- Create AdminRoute component (checks role === "ADMIN")

Example logic:

- If (!token) → redirect to /login
- If (user.role !== "ADMIN") → redirect to /

UI components:

- LoginPage
- AdminDashboard
- AccessDeniedPage

Additional requirements:

- Persist login state on refresh
- Handle token expiration (optional)
- Show loading state while checking auth

Output:

- Folder structure
- Full React code for:
  - AuthContext
  - ProtectedRoute
  - AdminRoute
- Example usage in routing
- Explanation of auth flow (login → store → check → render)