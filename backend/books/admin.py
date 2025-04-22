from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import User, Book, BorrowedBook

# Custom User Admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'username', 'name', 'email', 'role', 'date_of_birth',
        'phone_number', 'address', 'profile_thumbnail',
        'is_active', 'is_staff', 'is_superuser'
    )
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'name', 'email', 'phone_number', 'address')
    readonly_fields = ('last_login', 'date_joined', 'profile_thumbnail')
    actions = ['approve_users']

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': (
                'name', 'role', 'date_of_birth', 'profile_photo',
                'phone_number', 'address', 'profile_thumbnail'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            )
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    def profile_thumbnail(self, obj):
        if obj.profile_photo:
            return format_html(
                '<img src="{}" style="height:50px;border-radius:4px;" />',
                obj.profile_photo.url
            )
        return "-"
    profile_thumbnail.short_description = "Profile Photo"

    def approve_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} user(s) successfully approved.")
    approve_users.short_description = "Approve selected inactive users"


# Custom form for Book with calendar widget
class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = '__all__'
        widgets = {
            'publication_date': forms.SelectDateWidget(
                years=range(1900, 2101)
            ),
        }


# Book Admin
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    form = BookForm
    list_display = (
        'title', 'author', 'publication_date',
        'is_borrowed', 'borrowed_by_display'
    )
    list_filter = ('is_borrowed', 'publication_date')
    search_fields = ('title', 'author', 'publication_date')

    def borrowed_by_display(self, obj):
        return obj.borrowed_by.username if obj.is_borrowed and obj.borrowed_by else "Not Borrowed"
    borrowed_by_display.short_description = "Borrowed By"


# BorrowedBook Admin
@admin.register(BorrowedBook)
class BorrowedBookAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'borrowed_at', 'returned')
    list_filter = ('returned', 'borrowed_at')
    search_fields = ('book__title', 'user__username')
    readonly_fields = ('borrowed_at',)
    ordering = ('-borrowed_at',)
