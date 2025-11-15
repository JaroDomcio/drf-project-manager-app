from django.db import models
from project.models import Project
from user.models import User

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
