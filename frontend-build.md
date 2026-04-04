I am building a React frontend using Vite.

I have an e-commerce backend with JWT authentication.

Authentication:
- POST /api/v1/auth/login → returns JWT token

User API (for mention feature):
GET /api/v1/users/search?q=keyword
Headers:
Authorization: Bearer <token>

Response:
[
  {
    "id": "string",
    "fullName": "string",
    "avatarUrl": "string"
  }
]

Task:

Using the "beautifulMention" library, design and implement a comment input UI with mention functionality.

Functional requirements:

- Users can type "@" to trigger mention
- When typing "@", call the API with query keyword (async search)
- Display dropdown suggestion list
- Each item shows:
  - avatar
  - fullName
- Support keyboard navigation (↑ ↓ Enter)
- Highlight selected item
- Insert selected user into input as a styled mention tag
- Mentions must be stored as structured data:
  {
    id: string,
    display: string
  }

UI requirements:

- Responsive design
- Facebook-style comment box
- Dropdown appears under caret position
- Smooth UX (loading state, empty state)

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Debounce API calls
- Use fetch or axios
- Store JWT token (localStorage or context)

Component structure:

- MentionInput (main component)
- MentionList (dropdown container)
- MentionItem (single user item)

Additional requirements:

- Show loading indicator when fetching users
- Handle API errors gracefully
- Provide mock API fallback if backend is unavailable

Output:

- Folder structure
- Full working React code
- Example API service (userService.js)
- Explanation of data flow (input → API → dropdown → select → render)