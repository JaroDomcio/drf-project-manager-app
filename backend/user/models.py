from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        MANAGER = 'MANAGER','Manager', # pierwszy to string to klucz w bazie danych a drugi to etykieta
        WORKER = 'WORKER','Worker'


    role = models.CharField(max_length=50, choices=Role.choices, default=Role.WORKER)

    @classmethod
    def get_users_without_projects(cls):
        return cls.objects.filter(project_member__isnull=True).distinct()

    def get_total_tasks(self):
        return self.tasks.count()

    def get_completed_tasks(self):
        return self.tasks.filter(status="DONE").count()

    def get_pending_tasks(self):
        return self.tasks.filter(status="TO_DO").count()

    def get_in_progress_tasks(self):
        return self.tasks.filter(status="IN_PROGRESS").count()

    def get_projects_count(self):
        return self.project_member.count()

    def get_owned_projects(self):
        return self.owned_projects.count() if hasattr(self, 'owned_projects') else 0
