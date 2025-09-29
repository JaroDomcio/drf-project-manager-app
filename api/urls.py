from django.urls import path
from . import views
urlpatterns = [
    path("users/",views.UserListCreate.as_view(), name = "users"),
    path("users/<int:pk>/",views.UserRetrieveUpdateDestroy.as_view(), name = "user_update_delete"),
]
