from rest_framework import permissions

class IsTaskOwner(permissions.BasePermission):
    """
    Allows access only to owners of a task
    """
    def has_object_permission(self, request, view, obj):
        return obj.assigned_to == request.user