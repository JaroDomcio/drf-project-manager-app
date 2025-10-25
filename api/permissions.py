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
