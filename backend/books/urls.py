from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # ======================== Book APIs ========================
    path('books/', views.books_api, name='books_api'),
    path('books/<int:book_id>/', views.get_book, name='get_book'),
    path('books/add/', views.add_book, name='add_book'),
    path('books/edit/<int:book_id>/', views.edit_book, name='edit_book'),
    path('books/delete/<int:book_id>/', views.delete_book, name='delete_book'),

    # ======================== Auth & JWT ========================
    path('auth/', views.login_signup_api, name='login_signup_api'),
    path('auth/role-login/', views.login_with_role_redirect, name='login_with_role_redirect'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ======================== User Management ========================
    path('users/', views.list_users, name='list_users'),
    path('users/<int:user_id>/', views.get_user, name='get_user'),
    path('users/update/<int:user_id>/', views.update_user, name='update_user'),
    path('users/delete/<int:user_id>/', views.delete_user, name='delete_user'),

    # ======================== Borrowed Book APIs ========================
    path('borrow/', views.borrow_book, name='borrow_book'),
    path('my-borrows/', views.view_borrowed_books, name='view_borrowed_books'),
    path('all-borrows/', views.view_all_borrowed_books, name='view_all_borrowed_books'),
    path('return/', views.return_book, name='return_book'),

    # ======================== Librarian Approval ========================
    path('pending-librarians/', views.list_pending_librarians, name='pending_librarians'),
    path('approve-librarian/<int:user_id>/', views.approve_librarian, name='approve_librarian'),
]
