from rest_framework_nested import routers
from django.urls import path, include
from .views import PropertyViewSet, PropertyImageViewSet

router = routers.DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

properties_router = routers.NestedDefaultRouter(router, r'properties', lookup='property')
properties_router.register(r'images', PropertyImageViewSet, basename='property-images')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(properties_router.urls)),
]