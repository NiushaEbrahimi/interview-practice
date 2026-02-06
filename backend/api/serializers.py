from rest_framework import serializers
from .models import Course, Lesson, Question, UserQuestionAttempt, UserLessonProgress


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(
        source="questions.count",
        read_only=True
    )

    class Meta:
        model = Lesson
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = "__all__"




class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuestionAttempt
        fields = "__all__"
        read_only_fields = ("user",)


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = "__all__"
        read_only_fields = ("user",)
