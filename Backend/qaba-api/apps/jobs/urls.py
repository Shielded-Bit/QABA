from django.urls import path

from .views import JobApplicationCreateView

urlpatterns = [
    path(
        "jobs/<int:job_id>/applications/",
        JobApplicationCreateView.as_view(),
        name="job-application-create",
    ),
]
