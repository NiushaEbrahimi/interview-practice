from rest_framework import serializers
from django.db.models import Count
from .models import Course, Lesson, Question, UserQuestionAttempt, UserLessonProgress


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source="questions.count", read_only=True)
    # this is easier but it's not scalable and does a lot of queries
    # questions_answered = serializers.SerializerMethodField()
    # this code below is the scalable way to get the number of answered questions:
    questions_answered = serializers.IntegerField(read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    course = serializers.CharField(source='course.title', read_only=True)
    started = serializers.SerializerMethodField()  

    class Meta:
        model = Lesson
        fields = [
            'id', 'name', 'level', 'level_display', 
            'questions_count','questions_answered', 'course', 'started'
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
    lesson_name = serializers.CharField(source='lesson.name', read_only=True)
    lesson_level_display = serializers.CharField(source='lesson.get_level_display', read_only=True)
    course_title = serializers.CharField(source='lesson.course.title', read_only=True)
    progress_percent = serializers.SerializerMethodField()

    class Meta:
        model = UserLessonProgress
        fields = [
            'id',
            'user',
            'lesson',
            'lesson_name',
            'lesson_level_display',
            'course_title',
            'progress_percent',
            'will_study_later',
            'started_at',
            'completed_at',
        ]
        read_only_fields = ("user",)

    def get_progress_percent(self, obj):
        total = obj.lesson.questions.count()
        if total == 0:
            return 0
        answered = UserQuestionAttempt.objects.filter(
            user=obj.user,
            question__lesson=obj.lesson
        ).values('question').distinct().count()
        return round((answered / total) * 100)