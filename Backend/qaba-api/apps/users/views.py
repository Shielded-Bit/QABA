from apps.users.models import Notification
from apps.users.permissions import IsAgentOrLandlord, IsClient
from core.utils.response import APIResponse
from core.utils.send_email import (
    send_password_reset_email,
    send_survey_meeting_notification,
    send_verification_email,
)
from core.utils.token import email_verification_token_generator
from django.db import transaction
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import AgentProfile, ClientProfile, LandlordProfile, User
from .serializers import (
    AgentProfilePatchSerializer,
    AgentProfileSerializer,
    ClientProfilePatchSerializer,
    ClientProfileSerializer,
    ContactFormSerializer,
    LandlordProfileSerializer,
    RegistrationSerializer,
    LoginSerializer,
    NotificationSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    PropertySurveyMeetingCreateSerializer,
    PropertySurveyMeetingSerializer,
    SendEmailVerificationSerializer,
    UserSerializer,
    UserUpdateSerializer,
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


@extend_schema(
    tags=["Authentication"],
    request={"application/json": {"properties": {"refresh_token": {"type": "string"}}}},
)
class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return APIResponse.success(message="Logout successful")
        except Exception as e:
            return APIResponse.bad_request(message=str(e))


@extend_schema(tags=["Authentication"])
class RegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        send_verification_email(user)

        return APIResponse.success(
            data={"user": UserSerializer(user).data},
            message="Registration successful. Please check your email to verify your account.",
            status_code=status.HTTP_201_CREATED,
        )

@extend_schema(tags=["Profiles"])
class ClientProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsClient)
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(responses={200: ClientProfileSerializer})
    def get(self, request):
        """Retrieve client profile for current authenticated user"""

        if not hasattr(request.user, "clientprofile"):
            profile = ClientProfile.objects.create(user=request.user)
            Notification.objects.create(
                user=request.user,
                message="Your profile has been created. Please update your details in the profile section.",
            )
        else:
            profile = request.user.clientprofile

        serializer = ClientProfileSerializer(profile)
        return APIResponse.success(
            data=serializer.data, message="Client profile retrieved"
        )

    @extend_schema(
        request=ClientProfilePatchSerializer, responses={200: ClientProfileSerializer}
    )
    def patch(self, request):
        """Update client profile for current authenticated user"""

        if not hasattr(request.user, "clientprofile"):
            profile = ClientProfile.objects.create(user=request.user)
            Notification.objects.create(
                user=request.user,
                message="Your profile has been created. Please update your details in the profile section.",
            )
        else:
            profile = request.user.clientprofile

        serializer = ClientProfilePatchSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            updated_profile = ClientProfileSerializer(profile)
            return APIResponse.success(
                data=updated_profile.data, message="Client profile updated successfully"
            )

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Profiles"])
class AgentProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsAgentOrLandlord)
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(responses={200: AgentProfileSerializer})
    def get(self, request):
        """Retrieve agent or landlord profile for current authenticated user"""
        if request.user.is_agent:
            try:
                profile = request.user.agentprofile
            except AgentProfile.DoesNotExist:
                profile = AgentProfile.objects.create(user=request.user)

            serializer = AgentProfileSerializer(profile)
            return APIResponse.success(
                data=serializer.data, message="Agent profile retrieved"
            )
        else:
            try:
                profile = request.user.landlordprofile
            except LandlordProfile.DoesNotExist:
                profile = LandlordProfile.objects.create(user=request.user)
            serializer = LandlordProfileSerializer(profile)
            return APIResponse.success(
                data=serializer.data, message="Agent profile retrieved"
            )

    @extend_schema(
        request=AgentProfilePatchSerializer, responses={200: AgentProfileSerializer}
    )
    def patch(self, request):
        """Update agent profile for current authenticated user"""

        if request.user.is_agent:
            profile = request.user.agentprofile

            serializer = AgentProfilePatchSerializer(
                profile, data=request.data, partial=True
            )

            if serializer.is_valid():
                serializer.save()
                updated_profile = AgentProfileSerializer(profile)
                return APIResponse.success(
                    data=updated_profile.data,
                    message="Agent profile updated successfully",
                )
        else:
            profile = request.user.landlordprofile

            serializer = AgentProfilePatchSerializer(
                profile, data=request.data, partial=True
            )

            if serializer.is_valid():
                serializer.save()
                updated_profile = LandlordProfileSerializer(profile)
                return APIResponse.success(
                    data=updated_profile.data,
                    message="Landlord profile updated successfully",
                )

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Users"])
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)


@extend_schema(tags=["Users"])
class CurrentUserView(APIView):
    """
    View for retrieving the current authenticated user
    """

    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        """Get the currently authenticated user's details"""
        user = request.user
        serializer = UserSerializer(user)
        return APIResponse.success(
            data=serializer.data, message="User retrieved successfully"
        )


@extend_schema(tags=["Users"])
class UpdateUserView(APIView):
    """
    View for updating the current authenticated user
    """

    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(request=UserUpdateSerializer, responses={200: UserSerializer})
    def patch(self, request):
        """Update the currently authenticated user's details"""
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            updated_serializer = UserSerializer(user)
            return APIResponse.success(
                data=updated_serializer.data, message="User updated successfully"
            )

        return APIResponse.bad_request(serializer.errors)


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


@extend_schema(
    tags=["Authentication"],
    parameters=[
        OpenApiParameter(
            name="token",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Email verification token",
        )
    ],
    responses={
        302: None,
        400: OpenApiResponse(description="Invalid token"),
    },
)
class EmailVerificationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        token = request.GET.get("token")
        if not token:
            return APIResponse.bad_request("Token is required")

        try:
            user = User.objects.get(email_verification_token=token)

            if not email_verification_token_generator.check_token(user, token):
                return APIResponse.bad_request("Invalid token")

            user.is_email_verified = True
            user.email_verification_token = ""
            user.is_active = True
            user.save()

            self._create_profile_for_user(user)

            return APIResponse.success(data="Email verified")
        except User.DoesNotExist:
            return APIResponse.not_found("User not found")

    def _create_profile_for_user(self, user):
        """Create appropriate profile based on user type"""
        try:
            profile_created = False

            if user.is_client and not hasattr(user, "clientprofile"):
                ClientProfile.objects.create(user=user)
                profile_created = True
            elif user.user_type in ["AGENT", "LANDLORD"] and not hasattr(
                user, "agentprofile"
            ):
                AgentProfile.objects.create(user=user)
                profile_created = True

            if profile_created:
                Notification.objects.create(
                    user=user,
                    message="Your profile has been created. Please update your details in the profile section.",
                )

        except Exception as e:
            print(f"Error creating profile for user {user.email}: {str(e)}")


@extend_schema(tags=["Authentication"])
class SendEmailVerificationView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SendEmailVerificationSerializer

    def post(self, request):
        serializer = SendEmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=email)

                if not user.is_email_verified:
                    email_result = send_verification_email(user)

                    if not email_result.get("success", False):
                        return APIResponse.bad_request(
                            f"Failed to send email: {email_result.get('error', 'Unknown error')}"
                        )

                    return APIResponse.success(
                        message="Email verification sent to your email"
                    )
                else:
                    return APIResponse.bad_request("Email is already verified")

            except User.DoesNotExist:
                return APIResponse.success(
                    message="If a user with this email exists, a verification email has been sent"
                )

        return APIResponse.bad_request(serializer.errors)


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

                email_result = send_password_reset_email(user)

                if not email_result.get("success", False):
                    return APIResponse.bad_request(
                        f"Failed to send email: {email_result.get('error', 'Unknown error')}"
                    )

                return APIResponse.success(
                    message="A password reset email has been sent"
                )

            except User.DoesNotExist:
                return APIResponse.success(
                    message="If a user with this email exists, a password reset email has been sent"
                )

        return APIResponse.bad_request(serializer.errors)


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
                if not email_verification_token_generator.check_token(user, token):
                    return APIResponse.bad_request("Invalid token")

                user.set_password(serializer.validated_data["new_password"])
                user.password_reset_token = ""
                user.save()
                return APIResponse.success(message="Password reset successful")
            except User.DoesNotExist:
                APIResponse.not_found("User not found")
        APIResponse.bad_request(message=serializer.errors)


@extend_schema(tags=["Notifications"])
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@extend_schema(tags=["Notifications"])
class NotificationMarkReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["put"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return APIResponse.success(
            data=NotificationSerializer(notification).data,
            message="Notification marked as read",
        )


@extend_schema(tags=["Contact"])
class ContactFormView(APIView):
    """
    View for handling contact form submissions
    """

    permission_classes = (permissions.AllowAny,)

    @extend_schema(request=ContactFormSerializer, responses={200: None})
    def post(self, request):
        """Handle contact form submissions and send email to admin"""
        serializer = ContactFormSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            if request.user.is_authenticated:
                name = f"{request.user.first_name} {request.user.last_name}"
                email = request.user.email
                user_type = request.user.get_user_type_display()
                phone = request.user.phone_number or "Not provided"
            else:
                name = serializer.validated_data.get("name")
                email = serializer.validated_data.get("email")
                user_type = "Anonymous"
                phone = "Not provided"

            subject = serializer.validated_data["subject"]
            message = serializer.validated_data["message"]

            from core.utils.send_email import send_contact_form_email

            email_result = send_contact_form_email(
                name=name,
                email=email,
                phone=phone,
                user_type=user_type,
                subject=subject,
                message=message,
            )

            if not email_result.get("success", False):
                return APIResponse.bad_request(
                    f"Failed to send your message: {email_result.get('error', 'Unknown error')}"
                )

            if not request.user.is_authenticated:
                from core.utils.send_email import send_contact_confirmation_email

                send_contact_confirmation_email(email=email, name=name)

            return APIResponse.success(
                message="Your message has been sent successfully. We'll get back to you soon!"
            )

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Property Survey Meetings"])
class PropertySurveyMeetingCreateView(generics.CreateAPIView):
    """Create a new property survey meeting for authenticated users."""

    serializer_class = PropertySurveyMeetingCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                meeting = serializer.save(user=request.user)

                email_results = {}
                try:
                    client_email_result = send_survey_meeting_notification(
                        meeting, "client"
                    )
                    email_results["client_notification"] = client_email_result

                    admin_email_result = send_survey_meeting_notification(
                        meeting, "admin"
                    )
                    email_results["admin_notification"] = admin_email_result

                except Exception as e:
                    email_results["error"] = str(e)

                response_serializer = PropertySurveyMeetingSerializer(meeting)
                return APIResponse.success(
                    data=response_serializer.data,
                    message="Property survey meeting scheduled successfully.",
                    status_code=status.HTTP_201_CREATED,
                )

        except Exception:
            return APIResponse.server_error(
                message="An error occurred while scheduling the meeting. Please try again."
            )
