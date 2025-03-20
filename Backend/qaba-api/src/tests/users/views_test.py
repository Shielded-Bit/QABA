import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User
from core.utils.token import email_verification_token_generator
from unittest.mock import patch


pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_base_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
    }


@pytest.fixture
def create_user_with_token(user_base_data):
    user = User.objects.create_user(**user_base_data)
    user.is_active = False
    token = email_verification_token_generator.make_token(user)
    user.email_verification_token = token
    user.save()
    return user, token


@pytest.fixture
def client_user_data(user_base_data):
    return {**user_base_data, "user_type": "CLIENT"}


@pytest.fixture
def agent_user_data(user_base_data):
    return {**user_base_data, "user_type": "AGENT", "license_number": "ABC123"}


@pytest.fixture
def admin_user_data(user_base_data):
    return {**user_base_data, "user_type": "ADMIN"}


class TestLoginView:
    def test_successful_login(self, api_client, user_base_data):
        # Create user first
        User.objects.create_user(**user_base_data)

        url = reverse("login")
        response = api_client.post(
            url,
            {
                "email": user_base_data["email"],
                "password": user_base_data["password"],
            },
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["message"] == "Login successful"
        assert "access" in response.data["data"]
        assert "refresh" in response.data["data"]
        assert "user" in response.data["data"]
        assert response.data["errors"] is None

    def test_invalid_credentials(self, api_client):
        url = reverse("login")
        response = api_client.post(
            url, {"username": "wronguser", "password": "wrongpass"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data["success"] is False
        assert response.data["data"] is None


class TestClientRegistrationView:
    def test_successful_registration(self, api_client, client_user_data):
        url = reverse("register-client")
        response = api_client.post(url, client_user_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True
        assert "Registration successful" in response.data["message"]
        assert response.data["data"]["user"]["user_type"] == "CLIENT"


class TestAgentRegistrationView:
    def test_successful_registration(self, api_client, agent_user_data):
        url = reverse("register-agent")
        response = api_client.post(url, agent_user_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["data"]["user"]["user_type"] == "AGENT"
        assert response.data["success"] is True
        assert "Registration successful" in response.data["message"]


class TestProfileViews:
    @pytest.fixture
    def authenticated_client(self, api_client, user_base_data):
        user = User.objects.create_user(**user_base_data, user_type="CLIENT")
        api_client.force_authenticate(user=user)
        return api_client

    def test_create_client_profile(self, authenticated_client):
        url = reverse("create-client-profile")
        profile_data = {
            "phone_number": "+1234567890",
            "bio": "Test bio",
            "address": "Test address",
        }
        response = authenticated_client.post(url, profile_data)
        assert response.status_code == status.HTTP_201_CREATED


class TestPasswordManagement:
    @pytest.fixture
    def authenticated_client(self, api_client, user_base_data):
        user = User.objects.create_user(**user_base_data)
        api_client.force_authenticate(user=user)
        return api_client

    def test_password_change(self, authenticated_client, user_base_data):
        url = reverse("password-change")
        response = authenticated_client.post(
            url,
            {"old_password": user_base_data["password"], "new_password": "newpass123"},
        )
        assert response.status_code == status.HTTP_200_OK


class TestEmailVerification:
    @patch("django.core.mail.send_mail")
    def test_successful_verification(
        self, mock_send_mail, api_client, create_user_with_token
    ):
        user, token = create_user_with_token
        url = reverse("verify-email")

        response = api_client.post(url, {"token": token})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["message"] == "Email verified successfully"
        assert response.data["errors"] is None

        # Verify user is now active
        user.refresh_from_db()
        assert user.is_active is True
        assert user.is_email_verified is True

    # def test_invalid_token(self, api_client):
    #     url = reverse("verify-email")
    #     response = api_client.post(url, {"token": "invalid-token"})

    #     assert response.status_code == status.HTTP_400_BAD_REQUEST
    #     assert response.data["success"] is False
    #     assert "Invalid token" in response.data["message"]
    #     assert response.data["data"] is None

    # def test_already_verified(self, api_client, create_user_with_token):
    #     user, token = create_user_with_token
    #     user.is_active = True
    #     user.is_email_verified = True
    #     user.save()

    #     url = reverse("verify-email")
    #     response = api_client.post(url, {"token": token})

    #     assert response.status_code == status.HTTP_400_BAD_REQUEST
    #     assert response.data["success"] is False
    #     assert "already verified" in response.data["message"].lower()
    #     assert response.data["data"] is None
