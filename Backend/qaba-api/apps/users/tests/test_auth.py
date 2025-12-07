import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestLoginView:
    """Tests for POST /api/v1/auth/login/"""

    url = "/api/v1/auth/login/"

    def test_login_success(self, api_client, client_user):
        """Test successful login with valid credentials."""
        response = api_client.post(
            self.url,
            {"email": "client@test.com", "password": "testpass123"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "access" in response.data["data"]
        assert "refresh" in response.data["data"]
        assert "user" in response.data["data"]

    def test_login_invalid_credentials(self, api_client, client_user):
        """Test login fails with invalid password."""
        response = api_client.post(
            self.url,
            {"email": "client@test.com", "password": "wrongpassword"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, api_client):
        """Test login fails for non-existent user."""
        response = api_client.post(
            self.url,
            {"email": "nonexistent@test.com", "password": "testpass123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_inactive_user(self, api_client, unverified_user):
        """Test login fails for inactive user."""
        response = api_client.post(
            self.url,
            {"email": "unverified@test.com", "password": "testpass123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLogoutView:
    """Tests for POST /api/v1/auth/logout/"""

    url = "/api/v1/auth/logout/"

    def test_logout_success(self, auth_client, client_user, get_tokens, mocker):
        """Test successful logout with valid refresh token."""
        # Mock the blacklist method since token_blacklist app may not be installed
        mocker.patch.object(
            __import__("rest_framework_simplejwt.tokens", fromlist=["RefreshToken"]).RefreshToken,
            "blacklist",
            create=True,
            return_value=None,
        )
        client = auth_client(client_user)
        tokens = get_tokens(client_user)
        response = client.post(self.url, {"refresh_token": tokens["refresh"]}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_logout_unauthenticated(self, api_client):
        """Test logout fails without authentication."""
        response = api_client.post(self.url, {"refresh_token": "invalid"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestRegistrationView:
    """Tests for POST /api/v1/auth/register/"""

    url = "/api/v1/auth/register/"

    def test_registration_success(self, api_client, mock_send_verification_email):
        """Test successful user registration."""
        response = api_client.post(
            self.url,
            {
                "email": "newuser@test.com",
                "password": "securepass123",
                "password_confirm": "securepass123",
                "first_name": "New",
                "last_name": "User",
                "user_type": "CLIENT",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True
        assert User.objects.filter(email="newuser@test.com").exists()

    def test_registration_password_mismatch(self, api_client):
        """Test registration fails with mismatched passwords."""
        response = api_client.post(
            self.url,
            {
                "email": "newuser@test.com",
                "password": "securepass123",
                "password_confirm": "differentpass",
                "first_name": "New",
                "last_name": "User",
                "user_type": "CLIENT",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_registration_duplicate_email(
        self, api_client, client_user, mock_send_verification_email
    ):
        """Test registration fails with existing verified email."""
        response = api_client.post(
            self.url,
            {
                "email": "client@test.com",
                "password": "securepass123",
                "password_confirm": "securepass123",
                "first_name": "New",
                "last_name": "User",
                "user_type": "CLIENT",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_registration_missing_fields(self, api_client):
        """Test registration fails with missing required fields."""
        response = api_client.post(
            self.url,
            {"email": "newuser@test.com"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestTokenRefreshView:
    """Tests for POST /api/v1/auth/token/refresh/"""

    url = "/api/v1/auth/token/refresh/"

    def test_token_refresh_success(self, api_client, client_user, get_tokens):
        """Test successful token refresh."""
        tokens = get_tokens(client_user)
        response = api_client.post(self.url, {"refresh": tokens["refresh"]})
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_token_refresh_invalid_token(self, api_client):
        """Test token refresh fails with invalid token."""
        response = api_client.post(self.url, {"refresh": "invalid_token"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestOTPVerificationView:
    """Tests for POST /api/v1/auth/verify-email/"""

    url = "/api/v1/auth/verify-email/"

    def test_verify_email_success(self, api_client, unverified_user, create_otp):
        """Test successful email verification with valid OTP."""
        create_otp(unverified_user, otp_code="123456")
        response = api_client.post(
            self.url,
            {"email": "unverified@test.com", "otp": "123456"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

        # Verify user is now active and verified
        unverified_user.refresh_from_db()
        assert unverified_user.is_active is True
        assert unverified_user.is_email_verified is True

    def test_verify_email_invalid_otp(self, api_client, unverified_user, create_otp):
        """Test verification fails with invalid OTP."""
        create_otp(unverified_user, otp_code="123456")
        response = api_client.post(
            self.url,
            {"email": "unverified@test.com", "otp": "000000"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["success"] is False

    def test_verify_email_expired_otp(self, api_client, unverified_user, create_otp):
        """Test verification fails with expired OTP."""
        create_otp(unverified_user, otp_code="123456", expired=True)
        response = api_client.post(
            self.url,
            {"email": "unverified@test.com", "otp": "123456"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["success"] is False


@pytest.mark.django_db
class TestSendEmailVerificationView:
    """Tests for POST /api/v1/auth/send-email-verification/"""

    url = "/api/v1/auth/send-email-verification/"

    def test_send_verification_success(
        self, api_client, unverified_user, mock_send_verification_email
    ):
        """Test successfully sending verification email."""
        response = api_client.post(self.url, {"email": "unverified@test.com"})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_send_verification_already_verified(self, api_client, client_user):
        """Test fails for already verified user."""
        response = api_client.post(self.url, {"email": "client@test.com"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_send_verification_nonexistent_email(self, api_client):
        """Test fails for non-existent email."""
        response = api_client.post(self.url, {"email": "nonexistent@test.com"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPasswordResetRequestView:
    """Tests for POST /api/v1/auth/password-reset/"""

    url = "/api/v1/auth/password-reset/"

    def test_password_reset_request_success(
        self, api_client, client_user, mock_send_password_reset_email
    ):
        """Test successfully requesting password reset."""
        response = api_client.post(self.url, {"email": "client@test.com"})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_password_reset_request_nonexistent_email(self, api_client):
        """Test returns success for non-existent email (security)."""
        response = api_client.post(self.url, {"email": "nonexistent@test.com"})
        # Returns success to prevent email enumeration
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestPasswordResetConfirmView:
    """Tests for POST /api/v1/auth/password-reset/confirm/"""

    url = "/api/v1/auth/password-reset/confirm/"

    def test_password_reset_confirm_success(
        self, api_client, client_user, create_otp
    ):
        """Test successful password reset with valid OTP."""
        create_otp(client_user, otp_code="123456")
        response = api_client.post(
            self.url,
            {
                "email": "client@test.com",
                "otp": "123456",
                "new_password": "newpassword123",
            },
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

        # Verify password was changed
        client_user.refresh_from_db()
        assert client_user.check_password("newpassword123")

    def test_password_reset_confirm_invalid_otp(self, api_client, client_user, create_otp):
        """Test password reset fails with invalid OTP."""
        create_otp(client_user, otp_code="123456")
        response = api_client.post(
            self.url,
            {
                "email": "client@test.com",
                "otp": "000000",
                "new_password": "newpassword123",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPasswordChangeView:
    """Tests for POST /api/v1/auth/password/change/"""

    url = "/api/v1/auth/password/change/"

    def test_password_change_success(self, auth_client, client_user):
        """Test successful password change."""
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {"old_password": "testpass123", "new_password": "newpassword123"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

        # Verify password was changed
        client_user.refresh_from_db()
        assert client_user.check_password("newpassword123")

    def test_password_change_wrong_old_password(self, auth_client, client_user):
        """Test password change fails with wrong old password."""
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {"old_password": "wrongpassword", "new_password": "newpassword123"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_password_change_unauthenticated(self, api_client):
        """Test password change fails without authentication."""
        response = api_client.post(
            self.url,
            {"old_password": "testpass123", "new_password": "newpassword123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
