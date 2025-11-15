from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsCommentOwner

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['task', 'author']
    search_fields = ['content']
    ordering_fields = ['created_at']

    def get_permissions(self):
        if self.action in ['destroy','partial_update']:
            permission_classes = [IsCommentOwner]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
