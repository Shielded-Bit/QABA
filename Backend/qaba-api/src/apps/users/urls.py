from django.urls import path
from .views import (
    LoginView,
    ClientRegistrationView,
    AgentRegistrationView,
    UserList,
    UserDetail,
    ClientProfileView,
    AgentProfileView,
    ClientProfileCreateView,
    AgentProfileCreateView,
    PasswordChangeView,
    AdminRegistrationView,
    RefreshTokenView,
    EmailVerificationView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    SendEmailVerificationView
)


auth_patterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/client/", ClientRegistrationView.as_view(), name="register-client"),
    path("auth/register/agent/", AgentRegistrationView.as_view(), name="register-agent"),
    path("auth/register/admin/", AdminRegistrationView.as_view(), name="register-admin"),
    path("auth/token/refresh/", RefreshTokenView.as_view(), name="refresh-token"),
    path('auth/verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path("auth/password/change/", PasswordChangeView.as_view(), name="password-change"),
    path('auth/send-email-verification/', SendEmailVerificationView.as_view(), name='send-email-verification')
]

urlpatterns = [
    *auth_patterns,
    path("users/", UserList.as_view(), name="user-list"),
    path("users/me/", UserDetail.as_view(), name="user-detail"),
    path("profile/client/", ClientProfileView.as_view(), name="client-profile"),
    path("profile/agent/", AgentProfileView.as_view(), name="agent-profile"),
    path("profile/client/create", ClientProfileCreateView.as_view(), name="create-client-profile"),
    path("profile/agent/create", AgentProfileCreateView.as_view(), name="create-agent-profile"),
]
