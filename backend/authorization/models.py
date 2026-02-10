from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class CustomUserManager(BaseUserManager):
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    
    username = None
    email = models.EmailField(_('email address'), unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class UserProfile(models.Model):
    
    class ExperienceLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        JUNIOR = 'junior', 'Junior'
        MID_LEVEL = 'mid-level', 'Mid-Level'
        SENIOR = 'senior', 'Senior'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    # Personal Information
    full_name = models.CharField(max_length=255, blank=True)
    
    # Professional Information
    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER
    )
    
    # Skills and Technologies 
    known_technologies = models.TextField(
        blank=True,
        help_text="Comma-separated list of technologies"
    )
    learning_technologies = models.TextField(
        blank=True,
        help_text="Comma-separated list of technologies to learn"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def get_known_technologies_list(self):
        if self.known_technologies:
            return [tech.strip() for tech in self.known_technologies.split(',') if tech.strip()]
        return []
    
    def get_learning_technologies_list(self):
        if self.learning_technologies:
            return [tech.strip() for tech in self.learning_technologies.split(',') if tech.strip()]
        return []
    
    def set_known_technologies_list(self, tech_list):
        self.known_technologies = ', '.join(tech_list)
    
    def set_learning_technologies_list(self, tech_list):
        self.learning_technologies = ', '.join(tech_list)