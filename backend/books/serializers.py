from rest_framework import serializers
from .models import Book, User, BorrowedBook

# ==================== BOOK SERIALIZER ====================

class BookSerializer(serializers.ModelSerializer):
    book_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'publication_date', 'category', 'isbn',
            'binding', 'publisher', 'edition', 'number_of_pages', 'language',
            'book_image', 'book_image_url', 'is_borrowed', 'borrowed_by'
        ]

    def get_book_image_url(self, obj):
        request = self.context.get('request')
        if obj.book_image and request:
            return request.build_absolute_uri(obj.book_image.url)
        return None


# ==================== USER SERIALIZER ====================

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number', 'role',
            'date_of_birth', 'profile_photo', 'password', 'address',
            'is_active'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        # Make newly created users inactive by default (if necessary)
        if user.role in ['client', 'patron', 'librarian']:
            user.is_active = False
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# ==================== BORROWED BOOK SERIALIZER ====================

class BorrowedBookSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    borrowed_at = serializers.DateTimeField(read_only=True)
    returned_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = BorrowedBook
        fields = ['id', 'user', 'book', 'borrowed_at', 'returned', 'returned_at']
        read_only_fields = ['user', 'book', 'borrowed_at', 'returned_at']
