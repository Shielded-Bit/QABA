from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Blog
from .serializers import BlogDetailSerializer, BlogListSerializer


@extend_schema(tags=["Blogs"])
class BlogListView(ListAPIView):
    """List all published blog posts"""

    serializer_class = BlogListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Blog.objects.filter(status=Blog.Status.PUBLISHED).order_by("-created_at")


@extend_schema(tags=["Blogs"])
class BlogDetailView(RetrieveAPIView):
    """Retrieve a specific blog post with related posts"""

    serializer_class = BlogDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Blog.objects.filter(status=Blog.Status.PUBLISHED)


@extend_schema(tags=["Blogs"])
class FeaturedBlogsView(ListAPIView):
    """List all featured blog posts"""

    serializer_class = BlogListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Blog.objects.filter(
            status=Blog.Status.PUBLISHED, is_featured=True
        ).order_by("-created_at")
