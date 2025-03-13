from rest_framework_nested import routers
from django.urls import path, include, register_converter
from .views import (
    PropertyViewSet,
    PropertyImageViewSet,
    PropertyVideoViewSet,
)


# Define a path converter for integer IDs
class IntConverter:
    regex = "[0-9]+"

    def to_python(self, value):
        return int(value)

    def to_url(self, value):
        return str(value)


# Register the converter
register_converter(IntConverter, "int")


router = routers.DefaultRouter()
router.register(r"properties", PropertyViewSet, basename="property")

properties_router = routers.NestedDefaultRouter(
    router, r"properties", lookup="property"
)
properties_router.register(r"images", PropertyImageViewSet, basename="property-images")
properties_router.register(r"videos", PropertyVideoViewSet, basename="property-videos")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(properties_router.urls)),
]
