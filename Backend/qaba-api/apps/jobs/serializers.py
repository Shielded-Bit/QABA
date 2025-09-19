from rest_framework import serializers

from .models import Job, JobForm


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "location",
            "pay_range",
            "description",
            "requirement",
            "status",
        ]
        read_only_fields = fields


class JobFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobForm
        fields = [
            "id",
            "job",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "year_of_exp",
            "degree",
            "linkedin_url",
            "location",
            "referral",
            "bio",
            "cv",
        ]
        read_only_fields = ["id", "job"]
