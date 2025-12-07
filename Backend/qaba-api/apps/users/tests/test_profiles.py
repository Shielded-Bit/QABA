import pytest
from rest_framework import status


@pytest.mark.django_db
class TestClientProfileView:
    """Tests for GET/PATCH /api/v1/profile/client/"""

    url = "/api/v1/profile/client/"

    def test_get_client_profile_success(self, auth_client, client_user, client_profile):
        """Test client user can get their profile."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "profile_photo_url" in response.data["data"]
        assert "country" in response.data["data"]

    def test_get_client_profile_creates_if_missing(self, auth_client, client_user):
        """Test profile is created if it doesn't exist."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_update_client_profile_success(self, auth_client, client_user, client_profile):
        """Test client user can update their profile."""
        client = auth_client(client_user)
        response = client.patch(
            self.url,
            {
                "country": "Nigeria",
                "state": "Lagos",
                "city": "Ikeja",
                "address": "123 Test Street",
            },
            format="multipart",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["data"]["country"] == "Nigeria"
        assert response.data["data"]["state"] == "Lagos"
        assert response.data["data"]["city"] == "Ikeja"

    def test_client_profile_wrong_user_type(self, auth_client, agent_user):
        """Test agent user cannot access client profile endpoint."""
        client = auth_client(agent_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_client_profile_unauthenticated(self, api_client):
        """Test unauthenticated user cannot access profile."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestAgentProfileView:
    """Tests for GET/PATCH /api/v1/profile/agent/"""

    url = "/api/v1/profile/agent/"

    def test_get_agent_profile_success(self, auth_client, agent_user, agent_profile):
        """Test agent user can get their profile."""
        client = auth_client(agent_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "profile_photo_url" in response.data["data"]

    def test_get_landlord_profile_success(
        self, auth_client, landlord_user, landlord_profile
    ):
        """Test landlord user can access agent profile endpoint."""
        client = auth_client(landlord_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_update_agent_profile_success(self, auth_client, agent_user, agent_profile):
        """Test agent user can update their profile."""
        client = auth_client(agent_user)
        response = client.patch(
            self.url,
            {
                "country": "Nigeria",
                "state": "Abuja",
                "city": "Garki",
            },
            format="multipart",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["data"]["country"] == "Nigeria"

    def test_agent_profile_wrong_user_type(self, auth_client, client_user):
        """Test client user cannot access agent profile endpoint."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_agent_profile_unauthenticated(self, api_client):
        """Test unauthenticated user cannot access profile."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
