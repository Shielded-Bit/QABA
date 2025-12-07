import pytest
from rest_framework import status


@pytest.mark.django_db
class TestUserListView:
    """Tests for GET /api/v1/users/"""

    url = "/api/v1/users/"

    def test_list_users_admin_success(self, auth_client, admin_user, client_user):
        """Test admin can list all users."""
        client = auth_client(admin_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK

    def test_list_users_non_admin_forbidden(self, auth_client, client_user):
        """Test non-admin user cannot list users."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_users_unauthenticated(self, api_client):
        """Test unauthenticated user cannot list users."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestCurrentUserView:
    """Tests for GET /api/v1/users/me/"""

    url = "/api/v1/users/me/"

    def test_get_current_user_success(self, auth_client, client_user):
        """Test authenticated user can get their own data."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["data"]["email"] == "client@test.com"
        assert response.data["data"]["user_type"] == "CLIENT"

    def test_get_current_user_agent(self, auth_client, agent_user):
        """Test agent user can get their own data."""
        client = auth_client(agent_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["data"]["email"] == "agent@test.com"
        assert response.data["data"]["user_type"] == "AGENT"

    def test_get_current_user_unauthenticated(self, api_client):
        """Test unauthenticated user cannot access endpoint."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUpdateUserView:
    """Tests for PATCH /api/v1/users/update"""

    url = "/api/v1/users/update"

    def test_update_user_success(self, auth_client, client_user):
        """Test authenticated user can update their details."""
        client = auth_client(client_user)
        response = client.patch(
            self.url,
            {
                "first_name": "Updated",
                "last_name": "Name",
                "phone_number": "1234567890",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["data"]["first_name"] == "Updated"
        assert response.data["data"]["last_name"] == "Name"
        assert response.data["data"]["phone_number"] == "1234567890"

    def test_update_user_partial(self, auth_client, client_user):
        """Test user can partially update their details."""
        client = auth_client(client_user)
        response = client.patch(
            self.url,
            {"first_name": "OnlyFirst"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["data"]["first_name"] == "OnlyFirst"

    def test_update_user_unauthenticated(self, api_client):
        """Test unauthenticated user cannot update."""
        response = api_client.patch(
            self.url,
            {"first_name": "Updated"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
