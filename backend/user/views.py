from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, filters, generics
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import action
from .permissions import IsOwner, IsManager

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role']
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['last_name','email']

    def get_permissions(self):
        if self.action in ['update', 'partial_update','destroy','my_stats']:
            permission_classes = [permissions.IsAuthenticated,IsOwner]
        elif self.action in ['unassigned']:
            permission_classes = [IsManager]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['GET'], url_path='unassigned')
    def unassigned(self, request):
        users = User.get_users_without_projects()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='my-stats')
    def my_stats(self, request):
        user = request.user
        return Response({
            'total_tasks': user.get_total_tasks(),
            'completed_tasks': user.get_completed_tasks(),
            'pending_tasks': user.get_pending_tasks(),
            'in_progress_tasks': user.get_in_progress_tasks(),
            'projects': user.get_projects_count(),
            'owned_projects': user.get_owned_projects(),
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] 