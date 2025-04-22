from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import Q
from .models import Book, BorrowedBook
from .serializers import BookSerializer, UserSerializer, BorrowedBookSerializer
from django.http import JsonResponse

User = get_user_model()

# ========================= API HOME =========================

def api_home(request):
    return JsonResponse({"message": "BookHub API is running"})

# ========================= BOOK VIEWS =========================

@api_view(['GET'])
def books_api(request):
    query = request.query_params.get('q', '')
    books = Book.objects.filter(Q(title__icontains=query) | Q(author__icontains=query)) if query else Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"message": f"Book with ID {book_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_book(request):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Only admin or librarian can add books."}, status=status.HTTP_403_FORBIDDEN)
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_book(request, book_id):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Only admin or librarian can edit books."}, status=status.HTTP_403_FORBIDDEN)
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"message": f"Book with ID {book_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_book(request, book_id):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Only admin or librarian can delete books."}, status=status.HTTP_403_FORBIDDEN)
    try:
        book = Book.objects.get(id=book_id)
        book.delete()
        return Response({"message": f"Book with ID {book_id} deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Book.DoesNotExist:
        return Response({"message": f"Book with ID {book_id} not found."}, status=status.HTTP_404_NOT_FOUND)

# ========================= AUTH & JWT =========================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_signup_api(request):
    action = request.data.get('action')
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if action == "signup":
        if User.objects.filter(username=username).exists():
            return Response({"message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"message": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        role = request.data.get('role', 'client')
        is_active = False if role in ['patron', 'client'] else True
        user = User.objects.create_user(username=username, password=password, role=role, is_active=is_active)
        msg = "User created successfully! Awaiting approval." if not is_active else "User created successfully!"
        return Response({"message": msg}, status=status.HTTP_201_CREATED)

    elif action == "login":
        user = authenticate(username=username, password=password)
        if user:
            if not user.is_active:
                return Response({"message": "Your account is not approved yet."}, status=status.HTTP_403_FORBIDDEN)
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful!",
                "role": user.role,
                "username": user.username,
                "user_id": user.id,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
        return Response({"message": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_with_role_redirect(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        if not user.is_active:
            return Response({"message": "Your account is not approved yet."}, status=status.HTTP_403_FORBIDDEN)
        refresh = RefreshToken.for_user(user)
        redirect_url = f"/{user.role}/dashboard"
        return Response({
            "message": "Login successful!",
            "role": user.role,
            "username": user.username,
            "user_id": user.id,
            "redirect_url": redirect_url,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_200_OK)
    return Response({"message": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

# ========================= USER MANAGEMENT =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"message": f"User with ID {user_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"message": f"User with ID {user_id} not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"message": f"User with ID {user_id} not found."}, status=status.HTTP_404_NOT_FOUND)

# ========================= PENDING USERS APPROVAL =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_pending_users(request):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
    pending = User.objects.filter(role__in=['client', 'patron'], is_active=False)
    serializer = UserSerializer(pending, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_user(request, user_id):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(id=user_id, role__in=['client', 'patron'])
        if user.is_active:
            return Response({"message": "User is already approved."})
        user.is_active = True
        user.save()
        return Response({"message": "User approved successfully."})
    except User.DoesNotExist:
        return Response({"message": f"User with ID {user_id} not found or not eligible for approval."}, status=status.HTTP_404_NOT_FOUND)

# ========================= BORROWED BOOKS =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request):
    user = request.user
    book_id = request.data.get('book_id')
    try:
        book = Book.objects.get(id=book_id)
        if BorrowedBook.objects.filter(user=user, book=book).exists():
            return Response({"message": "You already borrowed this book."}, status=status.HTTP_400_BAD_REQUEST)
        BorrowedBook.objects.create(user=user, book=book)
        return Response({"message": "Book borrowed successfully."}, status=status.HTTP_201_CREATED)
    except Book.DoesNotExist:
        return Response({"message": f"Book with ID {book_id} not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_book(request):
    user = request.user
    book_id = request.data.get('book_id')
    try:
        borrowed = BorrowedBook.objects.get(user=user, book__id=book_id)
        borrowed.delete()
        return Response({"message": "Book returned successfully."})
    except BorrowedBook.DoesNotExist:
        return Response({"message": "You haven't borrowed this book."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_borrowed_books(request):
    borrowed_books = BorrowedBook.objects.filter(user=request.user)
    serializer = BorrowedBookSerializer(borrowed_books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_borrowed_books(request):
    if request.user.role not in ['admin', 'librarian']:
        return Response({"message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
    borrowed_books = BorrowedBook.objects.all()
    serializer = BorrowedBookSerializer(borrowed_books, many=True)
    return Response(serializer.data)

# ========================= PENDING LIBRARIANS =========================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_pending_librarians(request):
    pending = User.objects.filter(role='librarian', is_active=False)
    serializer = UserSerializer(pending, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_librarian(request, user_id):
    try:
        librarian = User.objects.get(id=user_id, role='librarian')
        if librarian.is_active:
            return Response({"message": "Librarian already approved."})
        librarian.is_active = True
        librarian.save()
        return Response({"message": "Librarian approved successfully."})
    except User.DoesNotExist:
        return Response({"message": f"Librarian with ID {user_id} not found."}, status=status.HTTP_404_NOT_FOUND)
