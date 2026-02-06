from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    pass


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    class Level(models.IntegerChoices):
        EASY = 1, "Easy"
        MEDIUM = 2, "Medium"
        HARD = 3, "Hard"

    course = models.ForeignKey(Course, related_name="lessons", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    level = models.IntegerField(choices=Level.choices, default=Level.EASY)
    total_questions = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.get_level_display()})"


class Question(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        related_name="questions",
        on_delete=models.CASCADE
    )
    question = models.TextField()
    correct_answer = models.TextField()

    def __str__(self):
        return f"Q-{self.id}"


class UserLessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    progress_percent = models.FloatField(default=0)
    will_study_later = models.BooleanField(default=False)

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')


class UserQuestionAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField()

    confidence_rate = models.IntegerField(default=3)
    come_back_again = models.BooleanField(default=False)

    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['answered_at']),
        ]
