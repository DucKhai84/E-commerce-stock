I am building an Admin Dashboard for an e-commerce application using React (Vite).

The backend provides REST APIs for managing categories:

GET /api/v1/categories
POST /api/v1/categories
PUT /api/v1/categories/:id
DELETE /api/v1/categories/:id

Category model:
{
  "id": "string",
  "name": "string",
  "description": "string"
}

Task:

Design and implement a Category Management UI for admin users.

Functional requirements:

- Display list of categories in a table
- Show columns:
  - Name
  - Description
  - Actions (Edit, Delete)

- Create category:
  - Button "Add Category"
  - Open modal form
  - Fields: name, description
  - Call POST API

- Update category:
  - Click Edit → open modal with pre-filled data
  - Call PUT API

- Delete category:
  - Click Delete → show confirmation dialog
  - Call DELETE API

UI requirements:

- Clean admin dashboard layout
- Responsive design
- Use table with pagination (optional)
- Use modal for create/edit
- Show loading states (table + form)
- Show empty state if no categories

Feedback (Toast integration):

- Show success toast:
  - "Category created successfully"
  - "Category updated successfully"
  - "Category deleted successfully"

- Show error toast if API fails

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Axios or fetch for API calls
- Use JWT token from localStorage ("accessToken")

Component structure:

- CategoryPage
- CategoryTable
- CategoryFormModal
- ConfirmDialog

Additional requirements:

- Validate form (name required)
- Disable submit button when loading
- Handle API errors (401, 500)

Output:

- Folder structure
- Full working React code
- API service (categoryService.js)
- Example integration with toast system
- Explanation of data flow (UI → API → state update)