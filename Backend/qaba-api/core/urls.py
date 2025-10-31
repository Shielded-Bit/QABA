from django.contrib import admin
from django.urls import include, path
from two_factor import urls as two_factor_urls
from two_factor.admin import AdminSiteOTPRequired
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import health_check

admin.site.__class__ = AdminSiteOTPRequired

two_factor_patterns, two_factor_app_name = two_factor_urls.urlpatterns

urlpatterns = [
    path("", include((two_factor_patterns, two_factor_app_name), namespace="two_factor")),
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.users.urls')),
    path('api/v1/', include('apps.properties.urls')),
    path('api/v1/', include('apps.transactions.urls')),
    path('api/v1/', include('apps.blogs.urls')),
    path('api/v1/', include('apps.jobs.urls')),
    path('health/', health_check, name='health'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
