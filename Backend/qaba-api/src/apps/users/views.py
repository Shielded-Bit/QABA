from core.utils.response import APIResponse
from core.utils.token import email_verification_token_generator
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import AgentProfile, ClientProfile, User
from .serializers import (
    AdminRegistrationSerializer,
    AgentProfileCreateSerializer,
    AgentRegistrationSerializer,
    ClientProfileCreateSerializer,
    ClientRegistrationSerializer,
    EmailVerificationSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    SendEmailVerificationSerializer,
    UserSerializer,
)


@extend_schema(tags=["Authentication"])
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        request=LoginSerializer,
        responses={201: LoginSerializer},
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            }
            return APIResponse.success(data=data, message="Login successful")
        APIResponse.unauthorized(message=serializer.errors)


@extend_schema(tags=["Authentication"])
class ClientRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ClientRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return APIResponse.success(
            data={"user": UserSerializer(user).data},
            message="Registration successful. Please check your email to verify your account.",
            status_code=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Authentication"])
class AgentRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AgentRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return APIResponse.success(
            data={"user": UserSerializer(user).data},
            message="Registration successful. Please check your email to verify your account.",
            status_code=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Authentication"])
class AdminRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = AdminRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return APIResponse.success(
            data={"user": UserSerializer(user).data},
            message="Registration successful.",
            status_code=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Profiles"])
class ClientProfileCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ClientProfileCreateSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_client:
            return APIResponse.forbidden("Only clients can create client profiles")
        serializer.save()
        return APIResponse.success(
            data=serializer.data,
            message="Profile created",
            status_code=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Profiles"])
class AgentProfileCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AgentProfileCreateSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_agent:
            return APIResponse.forbidden("Only agents can create agent profiles")
        serializer.save()
        return APIResponse.success(
            data=serializer.data,
            message="Profile created",
            status_code=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Profiles"])
class ClientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ClientProfileCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        if not self.request.user.is_client:
            APIResponse.forbidden("Only clients can view client profiles")

        # check if the user has a client profile
        if not hasattr(self.request.user, "clientprofile"):
            APIResponse.not_found("Client profile not found")

        return APIResponse.success(
            data=ClientProfile.objects.get(user=self.request.user),
            message="Profile retrieved",
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return APIResponse.success(
            data=serializer.data, message="Client profile retrieved"
        )


@extend_schema(tags=["Profiles"])
class AgentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = AgentProfileCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        if not self.request.user.is_agent:
            APIResponse.forbidden("Only agents can view agent profiles")
        # check if the user has an agent profile
        if not hasattr(self.request.user, "agentprofile"):
            APIResponse.not_found("Agent profile not found")

        return AgentProfile.objects.get(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return APIResponse.success(
            data=serializer.data, message="Agent profile retrieved"
        )


@extend_schema(tags=["Users"])
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)


@extend_schema(tags=["Users"])
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        if self.request.user.is_admin:
            return super().get_object()
        return self.request.user  # Return user instance, not a response

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return APIResponse.success(data=serializer.data, message="User retrieved")


@extend_schema(tags=["Authentication"])
class PasswordChangeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()
            return APIResponse.success(message="Password changed successfully")
        APIResponse.bad_request(message=serializer.errors)


@extend_schema(tags=["Authentication"])
class RefreshTokenView(TokenRefreshView):
    pass


@extend_schema(tags=["Authentication"])
class EmailVerificationView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = EmailVerificationSerializer

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["token"]
            try:
                user = User.objects.get(email_verification_token=token)

                # Check if token is valid and not expired
                if not email_verification_token_generator.check_token(user, token):
                    return APIResponse.bad_request("Invalid or expired token")

                # Verify and invalidate token
                user.is_email_verified = True
                user.email_verification_token = ""  # Invalidate token
                user.is_active = True
                user.save()

                return APIResponse.success(message="Email verified successfully")
            except User.DoesNotExist:
                return APIResponse.bad_request("Invalid token")


@extend_schema(tags=["Authentication"])
class SendEmailVerificationView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SendEmailVerificationSerializer

    def post(self, request):
        serializer = SendEmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                User.objects.get(email=email)
                serializer.send_verification_email(email)
                return APIResponse.success(
                    message="Email verification email sent to your email"
                )
            except User.DoesNotExist:
                return APIResponse.not_found("User not found")


@extend_schema(tags=["Authentication"])
class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=email)
                token = email_verification_token_generator.make_token(user)
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
                send_mail(
                    "Reset your password",
                    render_to_string(
                        "email/password_reset.html", {"reset_url": reset_url}
                    ),
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    html_message=True,
                )
                return APIResponse.success(
                    message="a password reset email has been sent"
                )
            except User.DoesNotExist:
                APIResponse.not_found("User not found")

        APIResponse.bad_request(message=serializer.errors)


@extend_schema(tags=["Authentication"])
class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["token"]
            try:
                user = User.objects.get(password_reset_token=token)
                user.set_password(serializer.validated_data["new_password"])
                user.password_reset_token = ""
                user.save()
                return APIResponse.success(message="Password reset successful")
            except User.DoesNotExist:
                APIResponse.not_found("User not found")
        APIResponse.bad_request(message=serializer.errors)
