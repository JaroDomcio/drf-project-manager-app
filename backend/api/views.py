from rest_framework import viewsets, permissions, generics, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Project, Task, Comment, Notification
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer, CommentSerializer, NotificationSerializer
from .permissions import *

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

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['owner', 'members']
    search_fields = ['title', 'description']
    ordering_fields = ['title']

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy', 'partial_update','users_without_tasks']:
            permission_classes = [IsManager]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['GET'])
    def members(self, request, id):
        project = Project.objects.get(id=id)
        members = project.members.all()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'], url_path='tasks-status')
    def tasks_status(self, request, id):
        project = Project.objects.get(id=id)
        tasks_to_do = project.get_number_of_todo_tasks()
        done_tasks = project.get_number_of_done_tasks()
        tasks_in_progress = project.get_number_of_in_progress_tasks()
        total_number_of_tasks = tasks_to_do + done_tasks + tasks_in_progress
        return Response({'tasks_todo':tasks_to_do, 'done_tasks': done_tasks, 'tasks_in_progress': tasks_in_progress, 'total_number_of_tasks': total_number_of_tasks})

    @action(detail=True, methods=['GET'], url_path='without-tasks')
    def users_without_tasks(self, request,id):
        project = Project.objects.get(id=id)
        users = project.get_members_without_tasks()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = "id"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'assigned_to', 'project']
    search_fields = ['title', 'description']
    ordering_fields = ['deadline', 'status', 'title']

    def get_permissions(self):
        if self.action in ['create','destroy']:
            permission_classes = [IsManager]
        elif self.action in ['mark_task_done','mark_task_in_progress']:
            permission_classes = [IsTaskOwner]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['PATCH'], url_path='task-in-progress')
    def mark_task_in_progress(self, request, id):
        task = Task.objects.get(id=id)
        task.status = 'IN_PROGRESS'
        task.save()
        return Response({'message': 'Task marked as in progress'}, status=status.HTTP_200_OK)


    @action(detail=True, methods=['PATCH'], url_path='task-done')
    def mark_task_done(self, request, id):
        task = Task.objects.get(id=id)
        task.status = 'DONE'
        task.save()
        return Response({'message': 'Task marked as done'}, status=status.HTTP_200_OK)


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

#Widok rejestracji
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] 


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    filter_backends = [filters.OrderingFilter]
    filterset_fields = ['is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['PATCH'], url_path='mark-read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})

    @action(detail=False, methods=['POST'], url_path='mark-all-read')
    def mark_all_as_read(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'message': f'{count} notifications marked as read'})

