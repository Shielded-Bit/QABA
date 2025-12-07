import pytest
from rest_framework import status

from apps.users.models import Referral


@pytest.mark.django_db
class TestReferralView:
    """Tests for GET/POST /api/v1/referral/"""

    url = "/api/v1/referral/"

    def test_create_referral_success(self, auth_client, client_user):
        """Test user can create a referral."""
        client = auth_client(client_user)
        response = client.post(self.url, {"source": "LINKEDIN"}, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True
        assert response.data["data"]["source"] == "LINKEDIN"
        assert response.data["data"]["source_display"] == "LinkedIn"

    def test_create_referral_with_custom_source(self, auth_client, client_user):
        """Test user can create referral with 'Others' and custom source."""
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {"source": "OTHERS", "custom_source": "Friend recommendation"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["data"]["source"] == "OTHERS"
        assert response.data["data"]["custom_source"] == "Friend recommendation"

    def test_create_referral_others_without_custom_source_fails(
        self, auth_client, client_user
    ):
        """Test creating referral with 'Others' but no custom_source fails."""
        client = auth_client(client_user)
        response = client.post(self.url, {"source": "OTHERS"}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_referral_success(self, auth_client, client_user, create_referral):
        """Test user can get their referral."""
        create_referral(client_user, source="FACEBOOK")
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["data"]["source"] == "FACEBOOK"

    def test_get_referral_not_found(self, auth_client, client_user):
        """Test getting referral when none exists returns 404."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_referral_success(self, auth_client, client_user, create_referral):
        """Test user can update their existing referral."""
        create_referral(client_user, source="X")
        client = auth_client(client_user)
        response = client.post(self.url, {"source": "INSTAGRAM"}, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["data"]["source"] == "INSTAGRAM"

        # Verify only one referral exists
        assert Referral.objects.filter(user=client_user).count() == 1

    def test_referral_clears_custom_source_for_non_others(
        self, auth_client, client_user, create_referral
    ):
        """Test custom_source is cleared when changing from 'Others' to another source."""
        create_referral(client_user, source="OTHERS", custom_source="Some source")
        client = auth_client(client_user)
        response = client.post(self.url, {"source": "GOOGLE_SEARCH"}, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["data"]["source"] == "GOOGLE_SEARCH"
        assert response.data["data"]["custom_source"] is None

    def test_referral_unauthenticated(self, api_client):
        """Test unauthenticated user cannot access referral."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        response = api_client.post(self.url, {"source": "LINKEDIN"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_referral_all_source_choices(self, auth_client, create_user):
        """Test all valid source choices work."""
        valid_sources = ["X", "LINKEDIN", "FACEBOOK", "INSTAGRAM", "GOOGLE_SEARCH"]

        for i, source in enumerate(valid_sources):
            user = create_user(f"user{i}@test.com")
            client = auth_client(user)
            response = client.post(self.url, {"source": source}, format="json")
            assert response.status_code == status.HTTP_201_CREATED
            assert response.data["data"]["source"] == source
