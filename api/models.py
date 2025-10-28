from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        MANAGER = 'MANAGER','Manager', # pierwszy to string to klucz w bazie danych a drugi to etykieta
        WORKER = 'WORKER','Worker'


    role = models.CharField(max_length=50, choices=Role.choices, default=Role.WORKER)

    @classmethod
    def get_users_without_projects(cls):
        return cls.objects.filter(member_projects__isnull=True).distinct()

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='member_projects')

    def __str__(self):
        return self.title

    def get_number_of_todo_tasks(self):
        number_of_tasks = self.tasks_for_project.filter(status='TO_DO').count()
        return number_of_tasks

    def get_number_of_done_tasks(self):
        number_of_tasks = self.tasks_for_project.filter(status='DONE').count()
        return number_of_tasks

    def get_number_of_in_progress_tasks(self):
        number_of_tasks = self.tasks_for_project.filter(status='IN_PROGRESS').count()
        return number_of_tasks

    def get_members_without_tasks(self):
        members_without_tasks = self.members.exclude(tasks__project=self)
        return members_without_tasks

class Task(models.Model):

    class Status(models.TextChoices):
        TO_DO = 'TO_DO', 'to_do',
        DONE = 'DONE', 'done',
        IN_PROGRESS = 'IN_PROGRESS', 'in_progress',

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks_for_project')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TO_DO)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


    def get_project_manager(self):
        return self.project.owner

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user}: {self.message}"