from rest_framework import serializers

from .models import Blog, Tag


class TagSerializer(serializers.ModelSerializer):
    """Serializer for the Tag model"""

    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class BlogListSerializer(serializers.ModelSerializer):
    """Serializer for listing blog posts"""

    tags = TagSerializer(many=True, read_only=True)
    reading_time = serializers.ReadOnlyField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "writers_name",
            "summary",
            "cover_image",
            "tags",
            "is_featured",
            "status",
            "created_at",
            "published_at",
            "reading_time",
        ]


class BlogDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed blog view with related posts"""

    tags = TagSerializer(many=True, read_only=True)
    reading_time = serializers.ReadOnlyField()
    related_posts = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "writers_name",
            "summary",
            "content",
            "writers_social_media",
            "cover_image",
            "tags",
            "is_featured",
            "status",
            "created_at",
            "updated_at",
            "published_at",
            "reading_time",
            "related_posts",
        ]

    def get_related_posts(self, obj):
        """Get 3 related posts based on shared tags"""
        tags = obj.tags.all()

        related_posts = (
            Blog.objects.filter(tags__in=tags, status=Blog.Status.PUBLISHED)
            .exclude(id=obj.id)
            .distinct()[:3]
        )

        return BlogListSerializer(related_posts, many=True, context=self.context).data
