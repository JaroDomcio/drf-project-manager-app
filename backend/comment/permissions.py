from rest_framework import permissions

class IsCommentOwner(permissions.BasePermission):
    """
    Allows access only to owners of a comment
    """
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user