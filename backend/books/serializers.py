from rest_framework import serializers
from .models import Book, User, BorrowedBook

class BookSerializer(serializers.ModelSerializer):
    # To display the full URL of the book image
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


class UserSerializer(serializers.ModelSerializer):
    # You might want to exclude password when returning user data (only for create/update)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number', 'role', 'date_of_birth',
            'profile_photo', 'password', 'address'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # Make sure password is not exposed
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
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


class BorrowedBookSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display user's username instead of ID
    book = serializers.StringRelatedField()  # Display book's title instead of ID
    borrowed_date = serializers.DateTimeField(read_only=True)  # Adding a read-only borrowed date if needed

    class Meta:
        model = BorrowedBook
        fields = ['id', 'user', 'book', 'borrowed_date']
        read_only_fields = ['user', 'book', 'borrowed_date']  # Read-only, since they should not be edited via this serializer
