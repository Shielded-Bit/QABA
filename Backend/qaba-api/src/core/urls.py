from django.urls import path, include

urlpatterns = [
    path('users/', include('apps.users.urls')),
    path('properties/', include('apps.properties.urls')),
]