from rest_framework import permissions


class IsClient(permissions.BasePermission):
    """
    Permission to only allow clients to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "CLIENT"
        )


class IsAgent(permissions.BasePermission):
    """
    Permission to only allow agents to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "AGENT"
        )


class IsClientOrAgent(permissions.BasePermission):
    """
    Permission to allow both clients and agents to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type in ["CLIENT", "AGENT"]
        )
