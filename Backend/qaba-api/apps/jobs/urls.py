from django.urls import path

from .views import JobApplicationCreateView, JobListView

urlpatterns = [
    path("jobs/", JobListView.as_view(), name="job-list"),
    path(
        "jobs/<int:job_id>/applications/",
        JobApplicationCreateView.as_view(),
        name="job-application-create",
    ),
]
