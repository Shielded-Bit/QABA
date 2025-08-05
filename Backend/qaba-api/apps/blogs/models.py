import uuid

from cloudinary.models import CloudinaryField
from django.db import models
from django.utils.text import slugify


class Tag(models.Model):
    """Tag model for categorizing blog posts"""

    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Blog(models.Model):
    """Blog post model with all required fields"""

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    writers_name = models.CharField(max_length=100)

    summary = models.TextField(
        max_length=500, blank=True, help_text="Brief summary of the blog post"
    )
    content = models.TextField()

    writers_social_media = models.JSONField(
        default=dict,
        blank=True,
        help_text="Social media handles in JSON format, e.g. {'twitter': '@handle', 'instagram': '@handle'}",
    )

    cover_image = CloudinaryField("image", blank=True, null=True)

    tags = models.ManyToManyField(Tag, related_name="blog_posts", blank=True)

    is_featured = models.BooleanField(default=False)

    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.DRAFT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

            if Blog.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{str(uuid.uuid4())[:8]}"

        super().save(*args, **kwargs)

    @property
    def reading_time(self):
        """Estimate reading time in minutes based on content length"""
        words_per_minute = 200
        word_count = len(self.content.split())
        minutes = word_count / words_per_minute
        return max(1, round(minutes))
