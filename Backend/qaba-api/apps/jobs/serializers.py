from rest_framework import serializers

from .models import JobForm


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
            "bio",
            "cv",
        ]
        read_only_fields = ["id", "job"]
