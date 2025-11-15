from django.db import models
from user.models import User

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='project_member')

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
