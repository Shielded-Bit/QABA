from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    ClientRegistrationView,
    AgentRegistrationView,
    UserList,
    UserDetail,
    ClientProfileView,
    AgentProfileView,
    PasswordChangeView,
    AdminRegistrationView,
)


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/client/", ClientRegistrationView.as_view(), name="register-client"),
    path("register/agent/", AgentRegistrationView.as_view(), name="register-agent"),
    path('register/admin/', AdminRegistrationView.as_view(), name='register-admin'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("users/", UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetail.as_view(), name="user-detail"),
    path("profile/client/", ClientProfileView.as_view(), name="client-profile"),
    path("profile/agent/", AgentProfileView.as_view(), name="agent-profile"),
    path("password/change/", PasswordChangeView.as_view(), name="password-change"),
]
