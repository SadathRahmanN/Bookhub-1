from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import UserCreateView  # Import UserCreateView

urlpatterns = [
    # Home
    path('', views.api_home),

    # Book APIs
    path('books/', views.books_api),
    path('books/<int:book_id>/', views.get_book),
    path('books/add/', views.add_book),
    path('books/edit/<int:book_id>/', views.edit_book),
    path('books/delete/<int:book_id>/', views.delete_book),

    # Auth & JWT
    path('auth/', views.login_signup_api),
    path('auth/role-login/', views.login_with_role_redirect),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User management
    path('users/', views.list_users),  # List all users
    path('users/<int:user_id>/', views.get_user),  # Get specific user
    path('users/update/<int:user_id>/', views.update_user),  # Update specific user
    path('users/delete/<int:user_id>/', views.delete_user),  # Delete specific user
    path('users/create/', UserCreateView.as_view(), name='user-create'),  # Create a new user

    # Pending users
    path('users/pending/', views.list_pending_users),
    path('users/approve/<int:user_id>/', views.approve_user),

    # Borrowed books
    path('borrow/', views.borrow_book),
    path('return/', views.return_book),
    path('borrowed/', views.view_borrowed_books),           # Patron view
    path('borrowed/all/', views.view_all_borrowed_books),   # Admin/Librarian view

    # Librarian approval
    path('librarians/pending/', views.list_pending_librarians),
    path('librarians/approve/<int:user_id>/', views.approve_librarian),
]
