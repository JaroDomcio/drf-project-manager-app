from django.db import models
from task.models import Task
from user.models import User

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
    
    @property
    def author_name(self):
        return self.author.first_name + ' ' + self.author.last_name
