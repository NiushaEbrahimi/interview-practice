from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Course, Lesson, Question,  UserQuestionAttempt, UserLessonProgress
from .serializers import CourseSerializer, LessonSerializer, QuestionSerializer, AttemptSerializer, LessonProgressSerializer
from .services import get_user_stats

from django.db.models import Count

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

        print("this is lesson : " , lesson)
        print("lesson_id:", lesson_id)

        if lesson_id:
            qs = qs.filter(lesson=lesson_id)
            
        print("qs : \n",qs)
        return qs


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = UserQuestionAttempt.objects.all()
    serializer_class = AttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserQuestionAttempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset = UserLessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserLessonProgress.objects.filter(user=self.request.user)


class StatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        stats = get_user_stats(request.user)
        return Response(stats)
