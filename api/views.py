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


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"


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