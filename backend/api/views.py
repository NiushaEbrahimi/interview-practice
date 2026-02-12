from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Course, Lesson, Question,  UserQuestionAttempt, UserLessonProgress
from .serializers import CourseSerializer, LessonSerializer, QuestionSerializer, AttemptSerializer, LessonProgressSerializer
from .services import get_user_stats

from django.db.models import Count

from django.contrib.auth import get_user_model

class CourseViewSet(ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class LessonViewSet(ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        course = self.request.query_params.get("course")
        level = self.request.query_params.get("level")

        if course:
            qs = qs.filter(course__title__iexact=course)

        if level:
            qs = qs.filter(level=int(level))

        return qs


class QuestionViewSet(ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    Lesson.objects.annotate(
        total_questions=Count("questions")
    )

    def get_queryset(self):
        qs = Question.objects.all()

        lesson = self.request.query_params.get("lesson")
        lesson_id = Lesson.objects.filter(name=lesson).values_list("id", flat=True).first()

        if lesson_id:
            qs = qs.filter(lesson=lesson_id)
            
        print("qs : \n",qs)
        return qs

class AttemptViewSet(viewsets.ModelViewSet):
    queryset = UserQuestionAttempt.objects.all()
    serializer_class = AttemptSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.order_by("-answered_at")

        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)
        else:
            return qs.none()

        lesson = self.request.query_params.get("lesson")
        if lesson:
            qs = qs.filter(question__lesson__name=lesson)

        question = self.request.query_params.get("question")
        if question:
            qs = qs.filter(question_id=question)

        return qs

    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            User = get_user_model()
            default_user = User.objects.first() 
            serializer.save(user=default_user)


class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset = UserLessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    # permission_classes = [permissions.IsAuthenticated] 
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UserLessonProgress.objects.filter(user=self.request.user)
        return UserLessonProgress.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            User = get_user_model()
            default_user = User.objects.first()
            serializer.save(user=default_user)


class StatsViewSet(viewsets.ViewSet):
    # permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        stats = get_user_stats(request.user)
        return Response(stats)