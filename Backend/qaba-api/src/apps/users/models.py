from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model for the real estate platform."""
    
    # Additional fields can be added here
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_agent = models.BooleanField(default=False)

    def __str__(self):
        return self.username