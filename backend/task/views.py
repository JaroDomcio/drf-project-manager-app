from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, filters
from .models import Task
from .serializers import TaskSerializer
from rest_framework.decorators import action
from user.permissions import IsManager
from task.permissions import IsTaskOwner

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

