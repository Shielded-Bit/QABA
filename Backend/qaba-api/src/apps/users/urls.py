from django.urls import path

from .views import (
    AdminRegistrationView,
    AgentProfileView,
    AgentRegistrationView,
    ClientProfileView,
    ClientRegistrationView,
    CurrentUserView,
    EmailVerificationView,
    LoginView,
    LogoutView,
    NotificationListView,
    NotificationMarkReadView,
    PasswordChangeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RefreshTokenView,
    SendEmailVerificationView,
    UpdateUserView,
    UserList,
)

auth_patterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path(
        "auth/register/client/",
        ClientRegistrationView.as_view(),
        name="register-client",
    ),
    path(
        "auth/register/agent/", AgentRegistrationView.as_view(), name="register-agent"
    ),
    path(
        "auth/register/admin/", AdminRegistrationView.as_view(), name="register-admin"
    ),
    path("auth/token/refresh/", RefreshTokenView.as_view(), name="refresh-token"),
    path("auth/verify-email/", EmailVerificationView.as_view(), name="verify-email"),
    path(
        "auth/password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset",
    ),
    path(
        "auth/password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path("auth/password/change/", PasswordChangeView.as_view(), name="password-change"),
    path(
        "auth/send-email-verification/",
        SendEmailVerificationView.as_view(),
        name="send-email-verification",
    ),
]

urlpatterns = [
    *auth_patterns,
    path("users/", UserList.as_view(), name="user-list"),
    path("users/me/", CurrentUserView.as_view(), name="current-user"),
    path("users/update", UpdateUserView.as_view(), name="update-user"),
    path("profile/client/", ClientProfileView.as_view(), name="client-profile"),
    path("profile/agent/", AgentProfileView.as_view(), name="agent-profile"),
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path(
        "notifications/<int:pk>/read/",
        NotificationMarkReadView.as_view(),
        name="notification-mark-read",
    ),
]
