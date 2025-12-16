import pytest
from rest_framework import status

from apps.blogs.models import Blog


@pytest.mark.django_db
def test_blog_list_returns_published_only(api_client, create_blog):
    """List view should include only published blogs ordered by created_at desc."""
    create_blog(title="Published 1")
    create_blog(title="Drafted", status=Blog.Status.DRAFT)
    create_blog(title="Published 2")

    response = api_client.get("/api/v1/blogs/")

    assert response.status_code == status.HTTP_200_OK
    titles = [item["title"] for item in response.data]
    assert titles == ["Published 2", "Published 1"]


@pytest.mark.django_db
def test_blog_detail_includes_related(api_client, create_blog, create_tag):
    """Detail view should return blog and related posts with shared tags."""
    tag_shared = create_tag("Investing")
    main = create_blog(title="Main Post", tags=[tag_shared])
    related = create_blog(title="Related Post", tags=[tag_shared])
    create_blog(title="Unrelated Post")

    response = api_client.get(f"/api/v1/blogs/{main.slug}/")

    assert response.status_code == status.HTTP_200_OK
    data = response.data
    related_titles = {post["title"] for post in data["related_posts"]}

    assert data["title"] == "Main Post"
    assert "Related Post" in related_titles
    assert "Unrelated Post" not in related_titles


@pytest.mark.django_db
def test_blog_detail_not_found_for_draft(api_client, create_blog):
    """Draft blogs should not be retrievable."""
    draft = create_blog(title="Hidden Draft", status=Blog.Status.DRAFT)

    response = api_client.get(f"/api/v1/blogs/{draft.slug}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_featured_blogs_only_featured(api_client, create_blog):
    """Featured endpoint should return only featured published blogs."""
    create_blog(title="Regular", is_featured=False)
    featured = create_blog(title="Featured One", is_featured=True)

    response = api_client.get("/api/v1/blogs/featured/")

    assert response.status_code == status.HTTP_200_OK
    titles = [item["title"] for item in response.data]
    assert titles == ["Featured One"]
