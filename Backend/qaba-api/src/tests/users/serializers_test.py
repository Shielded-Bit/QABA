import pytest
from rest_framework.test import APIRequestFactory
from apps.users.serializers import (
    UserSerializer,
    LoginSerializer,
    ClientRegistrationSerializer,
    AgentRegistrationSerializer,
    ClientProfileSerializer,
    AgentProfileSerializer,
    PasswordChangeSerializer,
)
from apps.users.models import User, ClientProfile, AgentProfile

pytestmark = pytest.mark.django_db


@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
    }


@pytest.fixture
def client_profile_data():
    return {
        "phone_number": "+1234567890",
        "bio": "Test bio",
        "address": "Test address",
        "preferred_location": "Test location",
        "budget_range": "100000-200000",
    }


@pytest.fixture
def agent_profile_data():
    return {
        "phone_number": "+1234567890",
        "bio": "Test agent bio",
        "address": "Test address",
        "license_number": "ABC123",
        "company_name": "Test Company",
        "years_of_experience": 5,
        "specializations": ["Residential", "Commercial"],
    }


class TestUserSerializer:
    def test_serialize_user(self, user_data):
        user = User.objects.create_user(**user_data)
        serializer = UserSerializer(user)

        assert serializer.data["username"] == user_data["username"]
        assert serializer.data["email"] == user_data["email"]
        assert "password" not in serializer.data


class TestLoginSerializer:
    def test_valid_login(self, user_data):
        User.objects.create_user(**user_data)
        serializer = LoginSerializer(
            data={"email": user_data["email"], "password": user_data["password"]}
        )

        assert serializer.is_valid()
        user = serializer.validated_data
        assert isinstance(user, User)

    def test_invalid_login(self):
        serializer = LoginSerializer(
            data={"username": "wronguser", "password": "wrongpass"}
        )
        assert not serializer.is_valid()


class TestClientRegistrationSerializer:
    def test_create_client(self, user_data):
        serializer = ClientRegistrationSerializer(data=user_data)
        assert serializer.is_valid()
        user = serializer.save()

        assert user.user_type == User.UserType.CLIENT
        assert user.email == user_data["email"]
        assert not user.is_active  # Should be inactive until email verified


class TestAgentRegistrationSerializer:
    def test_create_agent(self, user_data):
        serializer = AgentRegistrationSerializer(data=user_data)
        assert serializer.is_valid()
        user = serializer.save()

        assert user.user_type == User.UserType.AGENT
        assert user.email == user_data["email"]
        assert not user.is_active

class TestClientProfileSerializer:
    def test_serialize_client_profile(self, client_profile_data, user_data):
        user = User.objects.create_user(**user_data, user_type=User.UserType.CLIENT)
        profile = ClientProfile.objects.create(user=user, **client_profile_data)

        serializer = ClientProfileSerializer(profile)
        assert serializer.data["phone_number"] == client_profile_data["phone_number"]
        assert serializer.data["bio"] == client_profile_data["bio"]


class TestAgentProfileSerializer:
    def test_serialize_agent_profile(self, agent_profile_data, user_data):
        user = User.objects.create_user(**user_data, user_type=User.UserType.AGENT)
        profile = AgentProfile.objects.create(user=user, **agent_profile_data)

        serializer = AgentProfileSerializer(profile)
        assert serializer.data["license_number"] == agent_profile_data["license_number"]
        assert serializer.data["company_name"] == agent_profile_data["company_name"]


class TestPasswordChangeSerializer:
    @pytest.fixture
    def authenticated_user(self, user_data):
        user = User.objects.create_user(**user_data)
        factory = APIRequestFactory()
        request = factory.get("/")
        request.user = user
        return request

    def test_valid_password_change(self, authenticated_user, user_data):
        serializer = PasswordChangeSerializer(
            data={"old_password": user_data["password"], "new_password": "newpass123"},
            context={"request": authenticated_user},
        )
        assert serializer.is_valid()

    def test_invalid_old_password(self, authenticated_user):
        serializer = PasswordChangeSerializer(
            data={"old_password": "wrongpass", "new_password": "newpass123"},
            context={"request": authenticated_user},
        )
        assert not serializer.is_valid()
