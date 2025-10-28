from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser

from core.utils.response import APIResponse

from .models import Job
from .serializers import JobFormSerializer, JobSerializer


@extend_schema(tags=["Jobs"])
class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Job.objects.filter(status=Job.Status.ACTIVE)


@extend_schema(tags=["Jobs"])
class JobApplicationCreateView(generics.CreateAPIView):
    serializer_class = JobFormSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_job(self):
        return get_object_or_404(Job, pk=self.kwargs.get("job_id"))

    def create(self, request, *args, **kwargs):
        job = self.get_job()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job_form = serializer.save(job=job)

        return APIResponse.success(
            data=JobFormSerializer(job_form).data,
            message="Job application submitted successfully",
            status_code=status.HTTP_201_CREATED,
        )
