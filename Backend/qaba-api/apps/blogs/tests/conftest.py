import pytest
from django.utils.text import slugify

from apps.blogs.models import Blog, Tag

pytest_plugins = ["apps.users.tests.conftest"]


@pytest.fixture
def stub_cloudinary_upload_blogs(monkeypatch):
    """Avoid external uploads for blog cover images."""

    def _fake_upload(*args, **kwargs):
        return {
            "url": "http://example.com/mock",
            "secure_url": "http://example.com/mock",
            "public_id": "mock-id",
            "version": "1",
        }

    def _fake_pre_save(self, model_instance, add):
        value = getattr(model_instance, self.attname)
        if hasattr(value, "name"):
            return value.name
        return value or "mock-file"

    monkeypatch.setattr("cloudinary.uploader.upload_resource", _fake_upload)
    monkeypatch.setattr("cloudinary.uploader.upload", _fake_upload)
    monkeypatch.setattr("cloudinary.models.CloudinaryField.pre_save", _fake_pre_save, raising=False)
    return _fake_upload


@pytest.fixture
def create_tag(db):
    """Factory to create a tag."""

    def _create(name="Real Estate"):
        return Tag.objects.create(name=name, slug=slugify(name))

    return _create


@pytest.fixture
def create_blog(db, create_tag):
    """Factory to create a blog post with tags."""

    def _create(**kwargs):
        tags = kwargs.pop("tags", [])
        defaults = {
            "title": "Market Trends",
            "writers_name": "Jane Doe",
            "summary": "Latest updates",
            "content": "Content " * 50,
            "status": Blog.Status.PUBLISHED,
            "is_featured": False,
        }
        defaults.update(kwargs)
        blog = Blog.objects.create(**defaults)
        if tags:
            blog.tags.set(tags)
        return blog

    return _create
