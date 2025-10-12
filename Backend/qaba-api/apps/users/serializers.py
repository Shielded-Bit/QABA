from datetime import datetime, time, timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers

from .models import (
    AgentProfile,
    ClientProfile,
    LandlordProfile,
    Notification,
    PropertySurveyMeeting,
    User,
)


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


class LandlordProfileSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LandlordProfile
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
        validated_data.pop("password_confirm", None)

        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            user_type=validated_data.get("user_type", User.UserType.CLIENT),
            is_active=False,
        )

        return user


class RegistrationSerializer(BaseUserRegistrationSerializer):
    allowed_user_types = (
        (User.UserType.CLIENT, "Client"),
        (User.UserType.AGENT, "Agent"),
        (User.UserType.LANDLORD, "Landlord"),
    )

    user_type = serializers.ChoiceField(choices=allowed_user_types, required=True)

    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = BaseUserRegistrationSerializer.Meta.fields + ["user_type"]


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()
    user_type = serializers.ChoiceField(
        choices=RegistrationSerializer.allowed_user_types, required=False
    )

    def validate(self, attrs):
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            raise serializers.ValidationError(
                {"non_field_errors": ["Google authentication is not configured."]}
            )

        try:
            payload = verify_google_id_token(attrs["id_token"], audience=client_id)
        except ImportError as exc:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        "Google authentication dependencies are not installed."
                    ]
                }
            ) from exc
        except ValueError as exc:
            raise serializers.ValidationError(
                {"id_token": ["Invalid Google ID token."]}
            ) from exc

        email = payload.get("email")
        email_verified = payload.get("email_verified")

        if not email:
            raise serializers.ValidationError(
                {"id_token": ["Google ID token does not include an email."]}
            )

        if email_verified not in (True, "true", "True", "1"):
            raise serializers.ValidationError(
                {"id_token": ["Google email is not verified."]}
            )

        attrs["payload"] = payload
        return attrs


class SendEmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
            "is_email_verified",
            "profile",
        ]
        read_only_fields = ["is_email_verified"]

    def get_profile(self, obj):
        if obj.user_type == User.UserType.CLIENT:
            try:
                return ClientProfileSerializer(obj.clientprofile).data
            except ClientProfile.DoesNotExist:
                profile = ClientProfile.objects.create(user=obj)
                return ClientProfileSerializer(profile).data
        elif obj.user_type == User.UserType.AGENT:
            try:
                return AgentProfileSerializer(obj.agentprofile).data
            except AgentProfile.DoesNotExist:
                profile = AgentProfile.objects.create(user=obj)
                return AgentProfileSerializer(profile).data
        elif obj.user_type == User.UserType.LANDLORD:
            try:
                return LandlordProfileSerializer(obj.landlordprofile).data
            except LandlordProfile.DoesNotExist:
                profile = LandlordProfile.objects.create(user=obj)
                return LandlordProfileSerializer(profile).data


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


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "is_read", "created_at"]
        read_only_fields = ["message", "is_read", "created_at"]


class ContactFormSerializer(serializers.Serializer):
    """Serializer for contact form submissions"""

    name = serializers.CharField(max_length=100, required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(max_length=15, required=False)
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField(max_length=2000)

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            if not attrs.get("name"):
                raise serializers.ValidationError(
                    {"name": "Name is required for anonymous users"}
                )
            if not attrs.get("email"):
                raise serializers.ValidationError(
                    {"email": "Email is required for anonymous users"}
                )
        return attrs


class PropertySurveyMeetingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_phone = serializers.CharField(source="user.phone_number", read_only=True)
    property_address = serializers.CharField(read_only=True)
    property_name = serializers.CharField(
        source="property_object.property_name", read_only=True
    )
    property_location = serializers.CharField(
        source="property_object.location", read_only=True
    )
    agent_name = serializers.CharField(
        source="agent_assigned.get_full_name", read_only=True
    )
    agent_email = serializers.CharField(source="agent_assigned.email", read_only=True)
    agent_phone = serializers.CharField(
        source="agent_assigned.phone_number", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    is_past = serializers.BooleanField(read_only=True)

    class Meta:
        model = PropertySurveyMeeting
        fields = [
            "id",
            "property_id",
            "property_address",
            "property_name",
            "property_location",
            "scheduled_date",
            "scheduled_time",
            "message",
            "status",
            "status_display",
            "user_name",
            "user_email",
            "user_phone",
            "agent_name",
            "agent_email",
            "agent_phone",
            "admin_notes",
            "is_upcoming",
            "is_past",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "admin_notes",
            "created_at",
            "updated_at",
        ]


class PropertySurveyMeetingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertySurveyMeeting
        fields = [
            "property_id",
            "scheduled_date",
            "scheduled_time",
            "message",
        ]

    def validate_property_id(self, value):
        """Validate that property exists and is available for survey"""
        try:
            from apps.properties.models import Property

            property_obj = Property.objects.get(id=value)

            if property_obj.listing_status != Property.ListingStatus.APPROVED:
                raise serializers.ValidationError(
                    "Property is not available for survey meetings."
                )

            return value
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property does not exist.")

    def validate_scheduled_date(self, value):
        """Ensure the scheduled date is not in the past and within reasonable future"""
        today = timezone.now().date()
        if value < today:
            raise serializers.ValidationError("Scheduled date cannot be in the past.")

        max_future_date = today + timedelta(days=180)
        if value > max_future_date:
            raise serializers.ValidationError(
                "Cannot schedule more than 6 months in advance."
            )

        return value

    def validate_scheduled_time(self, value):
        """Ensure the scheduled time is within business hours (9 AM - 6 PM)"""
        business_start = time(9, 0)  # 9:00 AM
        business_end = time(18, 0)  # 6:00 PM

        if not (business_start <= value <= business_end):
            raise serializers.ValidationError(
                "Scheduled time must be between 9:00 AM and 6:00 PM."
            )
        return value

    def validate(self, data):
        """Custom validation for the entire object"""
        scheduled_date = data.get("scheduled_date")
        scheduled_time = data.get("scheduled_time")
        property_id = data.get("property_id")

        if scheduled_date and scheduled_time:
            scheduled_datetime = datetime.combine(scheduled_date, scheduled_time)
            if timezone.make_aware(scheduled_datetime) <= timezone.now():
                raise serializers.ValidationError(
                    "Scheduled date and time cannot be in the past."
                )

        if self.context.get("request") and property_id:
            user = self.context["request"].user
            existing_meetings = PropertySurveyMeeting.objects.filter(
                user=user,
                property_id=property_id,
                status__in=[
                    PropertySurveyMeeting.Status.PENDING,
                    PropertySurveyMeeting.Status.CONFIRMED,
                ],
            )

            if self.instance:
                existing_meetings = existing_meetings.exclude(id=self.instance.id)

            if existing_meetings.exists():
                for meeting in existing_meetings:
                    if meeting.is_upcoming:
                        raise serializers.ValidationError(
                            f"You already have an active meeting scheduled for this property on "
                            f"{meeting.scheduled_date.strftime('%B %d, %Y')} at "
                            f"{meeting.scheduled_time.strftime('%I:%M %p')}. "
                            f"Please wait until after that date or cancel the existing meeting."
                        )

        if self.context.get("request") and scheduled_date and scheduled_time:
            user = self.context["request"].user
            conflict_check = PropertySurveyMeeting.objects.filter(
                user=user,
                scheduled_date=scheduled_date,
                scheduled_time=scheduled_time,
                status__in=[
                    PropertySurveyMeeting.Status.PENDING,
                    PropertySurveyMeeting.Status.CONFIRMED,
                ],
            )

            if self.instance:
                conflict_check = conflict_check.exclude(id=self.instance.id)

        if conflict_check.exists():
            raise serializers.ValidationError(
                "You already have a meeting scheduled at this date and time."
            )

        return data


def verify_google_id_token(id_token_value, audience):
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token as google_id_token
    except ImportError as exc:
        raise ImportError(
            "google-auth library is required for Google authentication."
        ) from exc

    auth_request = google_requests.Request()
    return google_id_token.verify_oauth2_token(
        id_token_value, auth_request, audience=audience
    )
