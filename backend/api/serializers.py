from rest_framework import serializers
from .models import Course, Lesson, Question, UserQuestionAttempt, UserLessonProgress


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source="questions.count", read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    course = serializers.CharField(source='course.title', read_only=True)
    started = serializers.SerializerMethodField()  

    class Meta:
        model = Lesson
        fields = [
            'id', 'name', 'level', 'level_display', 
            'questions_count', 'course', 'started'
        ]
    
    def get_started(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        
        if not user or user.is_anonymous:
            return False
        
        return UserQuestionAttempt.objects.filter(
            user=user,
            question__lesson=obj
        ).exists()



class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    started = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = "__all__"
    
    def get_started(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or user.is_anonymous:
            return False
        return UserQuestionAttempt.objects.filter(user=user, question__lesson__course=obj).exists()


class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuestionAttempt
        fields = "__all__"
        read_only_fields = ("user",)


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = "__all__"
        read_only_fields = ("user","progress_percent")
        # read_only_fields = ("user",)    