from rest_framework import permissions


class IsAgentOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type in ['AGENT', 'ADMIN'] or request.user.is_staff
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.listed_by == request.user or request.user.is_staff