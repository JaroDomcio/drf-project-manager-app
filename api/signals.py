from django.db.models.signals import post_save
from django.dispatch import receiver
from pyexpat.errors import messages

from .models import Task,Notification


@receiver(post_save, sender=Task)
def create_task_notification(sender, instance, created, **kwargs):
    if created:
        message = f"Zostałeś przypisany do nowego zadania {instance.title}"
    else:
        message= f"Zaktualizowano zadanie :{instance.title}"

    Notification.objects.create(user=instance.assignet_to, message=message)