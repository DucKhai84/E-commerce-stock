I am building a React frontend using Vite for an e-commerce application.

Currently, the product review section UI is very basic:
- A simple textarea
- A submit button
- No display of previous reviews

Task:

Redesign and improve the Product Review UI to make it modern, user-friendly, and feature-rich.

Backend API:

GET /api/v1/products/:productId/reviews

Response:
[
  {
    "id": "string",
    "rating": number,
    "comment": "string",
    "createdAt": "date-time",
    "user": {
      "fullName": "string"
    }
  }
]

POST /api/v1/products/:productId/reviews

Request:
{
  "rating": number (1-5),
  "comment": "string"
}

---

Functional requirements:

1. Review Input Section:

- Replace basic textarea with a styled comment box
- Add:
  - User avatar placeholder
  - Star rating selector (1–5 stars)
  - Mention support using "@" (optional)
- Submit button styled clearly

2. Review List Section:

- Display list of previous reviews
- Each review item should include:
  - User name (fullName)
  - Rating (stars UI)
  - Comment content
  - Created date (formatted nicely, e.g. "2 hours ago")

- Show reviews in a vertical list (like Facebook comments)

3. UI/UX improvements:

- Clean modern design (similar to Facebook / Shopee reviews)
- Card-based or separated comment items
- Scrollable review list if too many items
- Highlight newest reviews on top

4. States:

- Loading state when fetching reviews
- Empty state:
  - "No reviews yet. Be the first to review!"
- Error state if API fails

5. Behavior:

- After submitting a review:
  - Call POST API
  - Clear input fields
  - Refresh review list
  - Show toast: "Review submitted successfully"

---

Technical requirements:

- React + Vite
- Functional components
- Hooks (useState, useEffect)
- Axios or fetch

Component structure:

- ReviewSection (main container)
- ReviewForm
- ReviewList
- ReviewItem
- StarRating

---

UI layout suggestion:

- Top: "Customer Reviews" title
- Below: ReviewForm (input area)
- Divider
- Below: ReviewList (previous comments)

---

Additional requirements:

- Format date using a readable format (e.g. "3 minutes ago")
- Prevent empty comment submission
- Disable submit button while loading

---

Output:

- Improved UI design description
- Full React component code
- CSS or Tailwind styling
- API integration
- Explanation of data flow (fetch → render → submit → refresh)