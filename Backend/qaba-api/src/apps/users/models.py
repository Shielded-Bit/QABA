from cloudinary.models import CloudinaryField
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager that requires email, first_name, last_name, and password"""

    def create_user(self, email, password, first_name, last_name, **extra_fields):
        """Create and save a User with the given email, password and required fields."""
        if not email:
            raise ValueError(_("Email must be set"))
        if not first_name:
            raise ValueError(_("First name must be set"))
        if not last_name:
            raise ValueError(_("Last name must be set"))

        email = self.normalize_email(email)
        user = self.model(
            email=email, first_name=first_name, last_name=last_name, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, last_name, **extra_fields):
        """Create and save a SuperUser with the given email, password and required fields."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("user_type", "ADMIN")

        return self.create_user(email, password, first_name, last_name, **extra_fields)


class User(AbstractUser):
    class UserType(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CLIENT = "CLIENT", "Client"
        AGENT = "AGENT", "Agent"
        LANDLORD = "LANDLORD", "Landlord"

    # Make email required and unique
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(_("first name"), max_length=150)
    last_name = models.CharField(_("last name"), max_length=150)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    username = None

    user_type = models.CharField(
        max_length=10, choices=UserType.choices, default=UserType.CLIENT
    )
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True)
    password_reset_token = models.CharField(max_length=100, blank=True)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_user_type_display()})"

    @property
    def is_admin(self):
        return self.user_type == self.UserType.ADMIN

    @property
    def is_client(self):
        return self.user_type == self.UserType.CLIENT

    @property
    def is_agent(self):
        return self.user_type == self.UserType.AGENT

    @property
    def is_landlord(self):
        return self.user_type == self.UserType.LANDLORD

    @property
    def is_agent_or_landlord(self):
        """Helper property to check if user is agent or landlord"""
        return self.user_type in [self.UserType.AGENT, self.UserType.LANDLORD]


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_photo = CloudinaryField(
        "image",
        folder=settings.CLOUDINARY_FOLDERS.get("user_profiles"),
        transformation={
            "quality": "auto:good",
            "crop": "fill",
            "width": 400,
            "height": 400,
            "gravity": "face",
        },
        format="webp",
        resource_type="image",
        blank=True,
        null=True,
        help_text=_("Upload a profile photo"),
    )
    country = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True


class ClientProfile(Profile):
    pass


class AgentProfile(Profile):
    pass


class LandlordProfile(Profile):
    pass


class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    title = models.CharField(max_length=255, default="Notification")
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default="general")
    is_read = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.user.email}: {self.message[:30]}..."
