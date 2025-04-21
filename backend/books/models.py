from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User Model with roles, phone number, address, and name
class User(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('librarian', 'Librarian'),
        ('patron', 'Patron'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    date_of_birth = models.DateField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.name or self.username} ({self.role})"


# Book model with extra fields
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publication_date = models.DateField()
    category = models.CharField(max_length=255, null=True, blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    binding = models.CharField(max_length=50, null=True, blank=True)
    publisher = models.CharField(max_length=255, null=True, blank=True)
    edition = models.CharField(max_length=20, null=True, blank=True)
    number_of_pages = models.PositiveIntegerField(null=True, blank=True)
    language = models.CharField(max_length=50, null=True, blank=True)
    book_image = models.ImageField(upload_to='book_images/', null=True, blank=True)
    is_borrowed = models.BooleanField(default=False)
    borrowed_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='borrowed_books',
        help_text="Tracks who currently has the book borrowed"
    )

    def __str__(self):
        return f"{self.title} by {self.author}"


# BorrowedBook model
class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrow_history')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrow_history')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} borrowed '{self.book.title}'"
