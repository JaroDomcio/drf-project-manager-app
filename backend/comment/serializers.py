from .models import *
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
    # author_name = serializers.ReadOnlyField(source = 'author_name')

    # class Meta:
    #     model = Comment
    #     fields = ['id', 'author_name' ,'task', 'author', 'content', 'created_at']
    class Meta:
        model = Comment
        fields = ['id','task', 'author', 'content', 'created_at']