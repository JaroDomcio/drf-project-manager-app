from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        MANAGER = 'MANAGER','Manager', # pierwszy to string to klucz w bazie danych a drugi to etykieta
        WORKER = 'WORKER','Worker'


    role = models.CharField(max_length=50, choices=Role.choices, default=Role.WORKER)

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='member_projects')

    def __str__(self):
        return self.title

class Task(models.Model):

    class Status(models.TextChoices):
        TO_DO = 'TO_DO', 'to_do',
        DONE = 'DONE', 'done',
        IN_PROGRESS = 'IN_PROGRESS', 'in_progress',

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TO_DO)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
