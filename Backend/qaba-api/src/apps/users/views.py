from rest_framework import generics, status, permissions
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework_simplejwt.views import TokenRefreshView
from .models import User, ClientProfile, AgentProfile
from .serializers import (
    UserSerializer,
    LoginSerializer,
    ClientRegistrationSerializer,
    AgentRegistrationSerializer,
    ClientProfileCreateSerializer,
    AgentProfileCreateSerializer,
    PasswordChangeSerializer,
    AdminRegistrationSerializer,
)


@extend_schema(tags=["Authentication"])
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        request=LoginSerializer,
        responses={201: LoginSerializer},
    )
    def post(self, request):
        print(request.data)
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Authentication"])
class ClientRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ClientRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Authentication"])
class AgentRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AgentRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema_view(post=extend_schema(tags=["Authentication"]))
class AdminRegistrationView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = AdminRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Profiles"])
class ClientProfileCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ClientProfileCreateSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_client:
            raise PermissionError("Only clients can create client profiles")
        serializer.save()


@extend_schema(tags=["Profiles"])
class AgentProfileCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AgentProfileCreateSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_agent:
            raise PermissionError("Only agents can create agent profiles")
        serializer.save()


@extend_schema(tags=["Profiles"])
class ClientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ClientProfileCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return ClientProfile.objects.get(user=self.request.user)


@extend_schema(tags=["Profiles"])
class AgentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = AgentProfileCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return AgentProfile.objects.get(user=self.request.user)


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
        return self.request.user


@extend_schema(tags=["Authentication"])
class PasswordChangeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(
        request=PasswordChangeSerializer,
        responses={200: {"message": "Password changed successfully"}},
    )
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()
            return Response({"message": "Password changed successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Authentication"])
class RefreshTokenView(TokenRefreshView):
    pass
