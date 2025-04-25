const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  REDIRECT: '/redirect',

  // Dashboards
  ADMIN_DASHBOARD: '/admin/dashboard',
  PATRON_DASHBOARD: '/patron/dashboard',
  LIBRARIAN_DASHBOARD: '/librarian/dashboard',

  // User management
  USER_FORM: '/user-form',
  USER_LIST: '/user-list',

  // Book management
  BOOK_LIST: '/book-list',
  BOOK_FORM: '/book-form',

  // Borrowing
  BORROW_BOOK: '/borrow-book',
  BORROW_HISTORY: '/borrow-history',
  BORROWED_BOOKS: '/borrowed-books',

  // Approvals & Requests
  APPROVE_LIBRARIAN: '/approve-librarian',
  APPROVE_PATRON: '/approve-patron',
  RETURN_REQUESTS: '/return-requests',
  EXTENSION_REQUESTS: '/extension-requests',

  // Shared
  ISSUED_BOOKS: '/issued-books',
  SEARCH_BOOKS: '/search-books',
  UPDATE_PROFILE: '/update-profile',

  // Additional Routes
  ABOUT_US: '/about-us',
  CONTACT_US: '/contact-us',

  // Book details page (dynamic)
  VIEW_BOOK: '/book/:id',  // Add this route for the BookDetails component
};

export default ROUTES;
