from .models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    is_manager = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id' ,'username' ,'first_name', 'last_name', 'email','password', 'role', 'is_manager']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
            'email': {'required': True, 'allow_blank': False},
            'role': {'read_only': True}  
        }


    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],            
            password = validated_data['password']
        )
        return user
    
    def get_is_manager(self,obj):
        return getattr(obj, 'role') == 'MANAGER'