from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from pyexpat.errors import messages
from .models import Notification
from task.models import Task


@receiver(post_save, sender=Task)
def create_task_notification(sender, instance, created, **kwargs):
    if created:
        message = f"Zostałeś przypisany do nowego zadania {instance.title}"
    else:
        message= f"Zaktualizowano zadanie :{instance.title}"

    Notification.objects.create(user=instance.assigned_to, message=message)

@receiver(pre_save, sender=Task)
def store_previous_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._previous_status = Task.objects.get(pk=instance.pk).status
        except Task.DoesNotExist:
            instance._previous_status = None

@receiver(post_save, sender=Task)
def notify_manager_on_done(sender, instance, created, **kwargs):
    if not created and hasattr(instance, '_previous_status'):  #hasattr(object,name) True jeżeli obiekt ma atrybut o nazwie name, False w przeciwnym wypadku
        if instance._previous_status != instance.status and instance.status == 'DONE':
            manager = instance.get_project_manager()
            Notification.objects.create(
                user=manager,
                message=f"Zadanie '{instance.title}' zostało ukończone."
            )

