from django.db import models


class Job(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    location = models.CharField(max_length=150)
    pay_range = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    requirement = models.TextField()

    def __str__(self):
        return self.title


class JobForm(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    email = models.EmailField()
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    year_of_exp = models.PositiveIntegerField()
    degree = models.CharField(max_length=150)
    bio = models.TextField()
    cv = models.FileField(upload_to="job_applications/cv/")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
