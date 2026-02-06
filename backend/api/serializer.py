from rest_framework import serializers
from .models import Course, Lesson, Question, UserProgress

class TechSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        # fields = ['id', 'techName', 'svg_icon', 'percent', 'category']


