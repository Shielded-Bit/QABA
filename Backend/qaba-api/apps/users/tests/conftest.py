import pytest
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


# --- API Client Fixture ---


@pytest.fixture
def api_client():
    """Return a DRF API client instance."""
    return APIClient()


# --- User Creation Fixtures ---


@pytest.fixture
def create_user(db):
    """Factory fixture to create users with custom attributes."""
    from django.contrib.auth import get_user_model

    User = get_user_model()

    def _create_user(
        email, password="testpass123", user_type="CLIENT", **kwargs
    ):
        defaults = {
            "first_name": "Test",
            "last_name": "User",
            "is_active": True,
            "is_email_verified": True,
        }
        defaults.update(kwargs)
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=defaults.pop("first_name"),
            last_name=defaults.pop("last_name"),
            user_type=user_type,
            **defaults,
        )
        return user

    return _create_user


@pytest.fixture
def client_user(create_user):
    """Create a CLIENT type user."""
    return create_user("client@test.com", user_type="CLIENT")


@pytest.fixture
def agent_user(create_user):
    """Create an AGENT type user."""
    return create_user("agent@test.com", user_type="AGENT")


@pytest.fixture
def landlord_user(create_user):
    """Create a LANDLORD type user."""
    return create_user("landlord@test.com", user_type="LANDLORD")


@pytest.fixture
def admin_user(create_user):
    """Create an ADMIN type user with staff and superuser privileges."""
    user = create_user("admin@test.com", user_type="ADMIN")
    user.is_staff = True
    user.is_superuser = True
    user.save()
    return user


@pytest.fixture
def unverified_user(create_user):
    """Create an unverified and inactive user."""
    return create_user(
        "unverified@test.com",
        is_active=False,
        is_email_verified=False,
    )


# --- Authentication Fixtures ---


@pytest.fixture
def get_tokens():
    """Factory fixture to generate JWT tokens for a user."""

    def _get_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

    return _get_tokens


@pytest.fixture
def auth_client(api_client, get_tokens):
    """Factory fixture to return an authenticated API client."""

    def _auth_client(user):
        tokens = get_tokens(user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        return api_client

    return _auth_client


# --- OTP Fixtures ---


@pytest.fixture
def create_otp(db):
    """Factory fixture to create OTP for a user."""
    from apps.users.models import OTP

    def _create_otp(user, otp_code="123456", expired=False):
        if expired:
            expires_at = timezone.now() - timezone.timedelta(minutes=1)
        else:
            expires_at = timezone.now() + timezone.timedelta(minutes=10)

        return OTP.objects.create(
            user=user,
            otp=otp_code,
            expires_at=expires_at,
        )

    return _create_otp


# --- Profile Fixtures ---


@pytest.fixture
def client_profile(client_user):
    """Get or create a client profile for the client user."""
    from apps.users.models import ClientProfile

    profile, _ = ClientProfile.objects.get_or_create(user=client_user)
    return profile


@pytest.fixture
def agent_profile(agent_user):
    """Get or create an agent profile for the agent user."""
    from apps.users.models import AgentProfile

    profile, _ = AgentProfile.objects.get_or_create(user=agent_user)
    return profile


@pytest.fixture
def landlord_profile(landlord_user):
    """Get or create a landlord profile for the landlord user."""
    from apps.users.models import LandlordProfile

    profile, _ = LandlordProfile.objects.get_or_create(user=landlord_user)
    return profile


# --- Notification Fixtures ---


@pytest.fixture
def create_notification(db):
    """Factory fixture to create notifications."""
    from apps.users.models import Notification

    def _create_notification(user, **kwargs):
        defaults = {
            "title": "Test Notification",
            "message": "Test message content",
            "notification_type": "general",
            "is_read": False,
        }
        defaults.update(kwargs)
        return Notification.objects.create(user=user, **defaults)

    return _create_notification


# --- Referral Fixtures ---


@pytest.fixture
def create_referral(db):
    """Factory fixture to create referrals."""
    from apps.users.models import Referral

    def _create_referral(user, source="LINKEDIN", custom_source=None):
        return Referral.objects.create(
            user=user,
            source=source,
            custom_source=custom_source,
        )

    return _create_referral


# --- Email Mocking Fixtures ---


@pytest.fixture
def mock_send_verification_email(mocker):
    """Mock the send_verification_email function."""
    return mocker.patch(
        "apps.users.views.send_verification_email",
        return_value={"success": True},
    )


@pytest.fixture
def mock_send_password_reset_email(mocker):
    """Mock the send_password_reset_email function."""
    return mocker.patch(
        "apps.users.views.send_password_reset_email",
        return_value={"success": True},
    )


@pytest.fixture
def mock_send_contact_form_email(mocker):
    """Mock the send_contact_form_email function."""
    return mocker.patch(
        "core.utils.send_email.send_contact_form_email",
        return_value={"success": True},
    )


@pytest.fixture
def mock_send_survey_meeting_notification(mocker):
    """Mock the send_survey_meeting_notification function."""
    return mocker.patch(
        "apps.users.views.send_survey_meeting_notification",
        return_value={"success": True},
    )
