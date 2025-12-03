from .models import *
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author_name' ,'task', 'author', 'content', 'created_at']

        read_only_fields = ['author', 'created_at']