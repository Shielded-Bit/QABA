from rest_framework import permissions


class IsAgentOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ["AGENT", "LANDLORD", "ADMIN"]
            or request.user.is_staff
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.listed_by == request.user or request.user.is_staff


class IsAgentLandlordOrAdmin(permissions.BasePermission):
    """New permission class specifically for agent/landlord operations"""

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ["AGENT", "LANDLORD", "ADMIN"]
            or request.user.is_staff
        )


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


class IsLandlord(permissions.BasePermission):
    """
    Permission to only allow landlords to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type == "LANDLORD"
        )


class IsAgentOrLandlord(permissions.BasePermission):
    """
    Permission to allow both agents and landlords to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type in ["AGENT", "LANDLORD"]
        )


class IsClientOrAgent(permissions.BasePermission):
    """
    Permission to allow both clients and agents to access the view.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type
            in ["CLIENT", "AGENT", "LANDLORD"]
        )


class CanReviewProperty(permissions.BasePermission):
    """
    Permission to allow only agents and clients to review properties.
    Users cannot review their own properties.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.user_type in ["CLIENT", "AGENT", "LANDLORD"]
        )

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "property"):
            return obj.property.listed_by != request.user
        return True
