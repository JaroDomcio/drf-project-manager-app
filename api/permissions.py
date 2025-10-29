from rest_framework import permissions

class IsManager(permissions.BasePermission):
    """
    Allows access only to users with role == 'MANAGER'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'MANAGER')


class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Managers can modify data, others can only read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.role == 'MANAGER')


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    Assumes the model instance has an 'author' or 'owner' attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.author == request.user

class IsOwner(permissions.BasePermission):
    """
    Allows access only to owners of an account
    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user

class IsTaskOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assigned_to == request.user