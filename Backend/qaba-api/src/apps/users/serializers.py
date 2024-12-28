from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, ClientProfile, AgentProfile


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        print(user)
        if user:
            return user
        raise serializers.ValidationError("Incorrect credentials")


class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = [
            "phone_number",
            "profile_photo",
            "bio",
            "address",
            "preferred_location",
            "budget_range",
        ]


class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            "phone_number",
            "profile_photo",
            "bio",
            "address",
            "license_number",
            "company_name",
            "years_of_experience",
            "specializations",
        ]


class UserSerializer(serializers.ModelSerializer):
    client_profile = ClientProfileSerializer(read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "client_profile",
            "agent_profile",
        ]


class BaseUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user


class ClientRegistrationSerializer(BaseUserRegistrationSerializer):
    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.CLIENT
        return super().create(validated_data)


class AgentRegistrationSerializer(BaseUserRegistrationSerializer):
    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.AGENT
        return super().create(validated_data)


class AdminRegistrationSerializer(BaseUserRegistrationSerializer):
    def create(self, validated_data):
        validated_data["user_type"] = User.UserType.ADMIN
        return super().create(validated_data)


class ClientProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = [
            "phone_number",
            "profile_photo",
            "bio",
            "address",
            "preferred_location",
            "budget_range",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        return ClientProfile.objects.create(user=user, **validated_data)


class AgentProfileCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            "phone_number",
            "profile_photo",
            "bio",
            "address",
            "license_number",
            "company_name",
            "years_of_experience",
            "specializations",
        ]

    def create(self, validated_data):
        user = self.context["request"].user
        return AgentProfile.objects.create(user=user, **validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
