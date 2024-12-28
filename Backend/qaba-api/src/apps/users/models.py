from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class UserType(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CLIENT = "CLIENT", "Client"
        AGENT = "AGENT", "Agent"

    user_type = models.CharField(
        max_length=10, choices=UserType.choices, default=UserType.CLIENT
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    @property
    def is_admin(self):
        return self.user_type == self.UserType.ADMIN

    @property
    def is_client(self):
        return self.user_type == self.UserType.CLIENT

    @property
    def is_agent(self):
        return self.user_type == self.UserType.AGENT


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True


class ClientProfile(Profile):
    # Add client-specific fields here
    preferred_location = models.CharField(max_length=255, blank=True, null=True)
    budget_range = models.CharField(max_length=50, blank=True, null=True)


class AgentProfile(Profile):
    license_number = models.CharField(max_length=50, blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    specializations = models.CharField(max_length=255, blank=True, null=True)
