# books/tests.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Book, BorrowedBook

User = get_user_model()

class BookAPITests(APITestCase):
    def setUp(self):
        # Create admin and client users
        self.admin_user = User.objects.create_user(username="admin", password="password123", role="admin")
        self.client_user = User.objects.create_user(username="client", password="password123", role="client")

        # Obtain JWT tokens
        auth_url = '/api/auth/'
        resp = self.client.post(auth_url, {"action": "login", "username": "admin", "password": "password123"}, format='json')
        self.admin_token = resp.json()['access']
        resp = self.client.post(auth_url, {"action": "login", "username": "client", "password": "password123"}, format='json')
        self.client_token = resp.json()['access']

        # Sample book data
        self.book_data = {
            "title": "Test Book",
            "author": "Test Author",
            "publication_date": "2023-01-01",
            "category": "Fiction",
            "isbn": "1234567890",
            "binding": "Paperback",
            "publisher": "Test Publisher",
            "edition": "1st",
            "number_of_pages": 300,
            "language": "English",
        }
        # Create one book in DB
        self.book = Book.objects.create(**self.book_data)

    def test_books_list(self):
        url = '/api/books/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.client_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)

    def test_get_book(self):
        url = f'/api/books/{self.book.id}/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.client_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['title'], self.book.title)

    def test_add_book_as_admin(self):
        url = '/api/books/add/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.post(url, self.book_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data['title'], self.book_data['title'])

    def test_add_book_as_client(self):
        url = '/api/books/add/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.client_token}')
        response = self.client.post(url, self.book_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_edit_book_as_admin(self):
        url = f'/api/books/edit/{self.book.id}/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.put(url, {"title": "Updated Title"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['title'], "Updated Title")

    def test_delete_book_as_admin(self):
        url = f'/api/books/delete/{self.book.id}/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class UserAPITests(APITestCase):
    def setUp(self):
        self.user_url = '/api/auth/'
        User.objects.create_user(username="existing", password="password123", role="client")

    def test_signup(self):
        data = {"action": "signup", "username": "newuser", "password": "password123", "role": "client"}
        response = self.client.post(self.user_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['message'], "User created successfully!")

    def test_login_valid(self):
        data = {"action": "login", "username": "existing", "password": "password123"}
        response = self.client.post(self.user_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.json())

    def test_login_invalid(self):
        data = {"action": "login", "username": "existing", "password": "wrong"}
        response = self.client.post(self.user_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], "Invalid username or password.")


class BorrowedBookAPITests(APITestCase):
    def setUp(self):
        # Create and login client user
        User.objects.create_user(username="client", password="password123", role="client")
        resp = self.client.post(
            '/api/auth/', {"action": "login", "username": "client", "password": "password123"}, format='json'
        )
        self.token = resp.json()['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        # Create a book to borrow
        self.book = Book.objects.create(title="Borrow Test", author="Author", publication_date="2025-01-01")

    def test_borrow_book(self):
        response = self.client.post('/api/borrow/', {"book_id": self.book.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['message'], "Book borrowed successfully.")

    def test_view_borrowed_books(self):
        self.client.post('/api/borrow/', {"book_id": self.book.id}, format='json')
        response = self.client.get('/api/my-borrows/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)