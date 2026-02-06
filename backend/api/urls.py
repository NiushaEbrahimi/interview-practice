from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet, QuestionViewSet, AttemptViewSet, LessonProgressViewSet, StatsViewSet

router = DefaultRouter()

router.register("courses", CourseViewSet)
router.register("lessons", LessonViewSet)
router.register("questions", QuestionViewSet)
router.register("attempts", AttemptViewSet)
router.register("progress", LessonProgressViewSet)
router.register("stats", StatsViewSet, basename="stats")

urlpatterns = router.urls
