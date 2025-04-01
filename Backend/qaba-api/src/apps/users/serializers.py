from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import AgentProfile, ClientProfile, Notification, User


class ClientProfilePatchSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = ClientProfile
        fields = [
            "profile_photo",
            "country",
            "state",
            "city",
            "address",
        ]

    def validate(self, attrs):
        # Add any specific validation for PATCH operations
        return attrs


class AgentProfilePatchSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = AgentProfile
        fields = [
            "profile_photo",
            "country",
            "state",
            "city",
            "address",
        ]

    def validate(self, attrs):
        # Add any specific validation for PATCH operations
        return attrs


class ClientProfileSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField(
        read_only=True,
    )

    class Meta:
        model = ClientProfile
        fields = [
            "id",
            "profile_photo_url",
            "country",
            "state",
            "city",
            "address",
        ]

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None


class AgentProfileSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AgentProfile
        fields = [
            "id",
            "profile_photo_url",
            "country",
            "state",
            "city",
            "address",
        ]

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None


class BaseUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        # Validate password match
        if attrs.get("password") != attrs.get("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

    def create(self, validated_data):
        # Remove password_confirm field
        validated_data.pop("password_confirm", None)

        # Create user with manager method to ensure required fields validation
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            user_type=validated_data.get("user_type", User.UserType.CLIENT),
            is_active=False,  # Inactive until email verified
        )

        return user


class SendEmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value


class UserSerializer(serializers.ModelSerializer):
    client_profile = ClientProfileSerializer(read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
            "client_profile",
            "agent_profile",
            "is_email_verified",
        ]
        read_only_fields = ["is_email_verified"]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone_number"]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "phone_number": {"required": False},
        }


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        user = authenticate(email=data.get("email"), password=data.get("password"))
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("Account is not activated")
        return user


# Update registration serializers to inherit correctly
class ClientRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        pass

    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.CLIENT
        return super().create(validated_data)


class AgentRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        pass

    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.AGENT
        return super().create(validated_data)


class AdminRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        pass

    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.ADMIN
        return super().create(validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "is_read", "created_at"]
