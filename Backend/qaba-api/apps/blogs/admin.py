from django.contrib import admin

from .models import Blog, Tag


class BlogAdmin(admin.ModelAdmin):
    list_display = ("title", "writers_name", "status", "is_featured", "created_at")
    list_filter = ("status", "is_featured", "tags")
    search_fields = ("title", "content", "writers_name")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "created_at"
    filter_horizontal = ("tags",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("title", "slug", "writers_name", "summary", "content")}),
        ("Media", {"fields": ("cover_image",)}),
        ("Meta", {"fields": ("tags", "writers_social_media", "is_featured")}),
        ("Status", {"fields": ("status", "published_at", "created_at", "updated_at")}),
    )


class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Blog, BlogAdmin)
admin.site.register(Tag, TagAdmin)
