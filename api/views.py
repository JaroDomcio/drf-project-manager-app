from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Project, Task, Comment
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer, CommentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"

    @action(detail=False, methods=['GET'], url_path='unassigned')
    def unassigned(self, request):
        users = User.objects.filter(task__isnull=True)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET']) # Nie jest nam potrzebny url_path jak wyżej ponieważ django samemu generuje url na podstawie nazwy metody
    def tasks(self,request, id):
        user = User.objects.get(id=id)
        tasks = user.tasks.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def projects(self, request, id):
        user = User.objects.get(id=id)
        projects = user.member_projects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"

    @action(detail=True, methods=['GET'])
    def tasks(self,request,id):
        project = Project.objects.get(id=id)
        tasks = project.tasks.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def members(self,request,id):
        project = Project.objects.get(id=id)
        members = project.members.all()
        serializer = ProjectSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'], url_path='tasks-status')
    def tasks_status(self,request,id):
        project = Project.objects.get(id=id)
        tasks_to_do = project.get_number_of_todo_tasks()
        done_tasks = project.get_number_of_done_tasks()
        tasks_in_progress = project.get_number_of_tasks_in_progress()
        total_number_of_tasks = tasks_to_do + done_tasks + tasks_in_progress
        return Response({'tasks_todo':tasks_to_do, 'done_tasks': done_tasks, 'tasks_in_progress': tasks_in_progress, 'total_number_of_tasks': total_number_of_tasks})

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = "id"


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = "id"

#Widok rejestracji
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # każdy ma dostęp do tego endpointu/nie wymaga tokena