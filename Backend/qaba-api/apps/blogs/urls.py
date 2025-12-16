from django.urls import path

from .views import BlogDetailView, BlogListView, FeaturedBlogsView

urlpatterns = [
    path("blogs/featured/", FeaturedBlogsView.as_view(), name="featured-blogs"),
    path("blogs/", BlogListView.as_view(), name="blog-list"),
    path("blogs/<slug:slug>/", BlogDetailView.as_view(), name="blog-detail"),
]
