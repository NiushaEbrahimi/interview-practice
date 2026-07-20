import json

from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Course, Lesson, Question, UserQuestionAttempt, UserLessonProgress
from .serializers import CourseSerializer, LessonSerializer, QuestionSerializer, AttemptSerializer, LessonProgressSerializer
from .services import get_user_stats

from django.db.models import Count, Subquery, OuterRef, Value, Q
from django.db.models.functions import Coalesce

from django.contrib.auth import get_user_model

class CourseViewSet(ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class LessonViewSet(ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        # Total questions per lesson (1 query for all lessons)
        qs = qs.annotate(
            questions_count=Count('questions')
        )
        
        # User's answered count (1 query for all lessons)
        if user.is_authenticated:
            answered_subq = (
                UserQuestionAttempt.objects.filter(
                    user=user,
                    question__lesson=OuterRef('pk')
                )
                .values('question__lesson')
                .annotate(cnt=Count('question', distinct=True))
                .values('cnt')[:1]
            )
            qs = qs.annotate(
                questions_answered=Coalesce(Subquery(answered_subq), Value(0))
            )
            
            # Started flag (has user attempted any question in this lesson?)
            started_subq = (
                UserQuestionAttempt.objects.filter(
                    user=user,
                    question__lesson=OuterRef('pk')
                )
                .values('pk')[:1]
            )
            qs = qs.annotate(
                started=Q(pk__in=Subquery(started_subq.values('question__lesson')))
            )
        else:
            qs = qs.annotate(
                questions_answered=Value(0),
                started=Value(False)
            )

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

        come_back_again = self.request.query_params.get("come_back_again")
        if come_back_again is not None:

            latest_attempt = self.queryset.filter(
                question=OuterRef("pk")
            ).order_by("-answered_at")

            qs = Question.objects.annotate(
                last_come_back=Subquery(
                    latest_attempt.values("come_back_again")[:1]
                )
            ).filter(last_come_back=True)

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


@csrf_exempt
@require_POST
def score_answer(request):
    print("[SCORE] Request received")
    from rest_framework_simplejwt.tokens import AccessToken

    # Manual auth check
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    print(f"[SCORE] Auth header: {auth_header[:20]}..." if len(auth_header) > 20 else f"[SCORE] Auth header: {auth_header}")
    if not auth_header.startswith("Bearer "):
        print("[SCORE] No Bearer token found")
        return JsonResponse({"error": "Authentication credentials were not provided"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        User = get_user_model()
        user = User.objects.get(id=user_id)
        print(f"[SCORE] Authenticated user: {user.email}")
    except Exception as e:
        print(f"[SCORE] Auth failed: {e}")
        return JsonResponse({"error": "Invalid or expired token"}, status=401)

    try:
        data = json.loads(request.body)
        print(f"[SCORE] Request body keys: {list(data.keys())}")
    except json.JSONDecodeError as e:
        print(f"[SCORE] Invalid JSON: {e}")
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # Parse useChat message format
    try:
        messages = data.get("messages", [])
        print(f"[SCORE] Messages count: {len(messages)}")
        last_user_msg = next(
            (m for m in reversed(messages) if m.get("role") == "user"), None
        )
        text_content = last_user_msg["parts"][0]["text"]
        print(f"[SCORE] Text content: {text_content[:100]}...")
        payload = json.loads(text_content)
        question = payload.get("question", "")
        user_answer = payload.get("userAnswer", "")
        print(f"[SCORE] Question: {question[:50]}...")
        print(f"[SCORE] User answer: {user_answer[:50]}...")
    except (StopIteration, IndexError, KeyError, json.JSONDecodeError) as e:
        print(f"[SCORE] Failed to parse messages: {e}")
        question = ""
        user_answer = ""

    if not all([question, user_answer]):
        print("[SCORE] Missing question or userAnswer")
        return JsonResponse(
            {"error": "question and userAnswer are required"},
            status=400,
        )

    from openai import OpenAI
    client = OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama",
    )
    print("[SCORE] Calling Ollama API...")

    def generate():
        def sse(event_type, payload=None):
            data = {"type": event_type}
            if payload:
                data.update(payload)
            return f"data: {json.dumps(data)}\n\n"

        try:
            response = client.chat.completions.create(
                model="gemma2:2b",
                stream=True,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an interview coach. Evaluate the user's answer to an interview question. "
                            "Return ONLY a JSON object with three fields: "
                            '"score" (integer 1-5, where 1=poor, 5=excellent), '
                            '"feedback" (a short paragraph explaining the score, what was good and what could be improved), and '
                            '"answer" (a suggested better answer based on feedback). '
                            "Do not include any other text, markdown, or code fences."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"Question: {question}\n\nUser's Answer: {user_answer}",
                    },
                ],
            )

            yield sse("start")
            yield sse("start-step")
            yield sse("text-start", {"id": "text-1"})

            for chunk in response:
                if chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    yield sse("text-delta", {"id": "text-1", "delta": text})

            yield sse("text-end", {"id": "text-1"})
            yield sse("finish-step")
            yield sse("finish", {"finishReason": "stop"})
            yield "data: [DONE]\n\n"
            print("[SCORE] Stream complete")
        except Exception as e:
            print(f"[SCORE] Ollama error: {e}")
            yield sse("error", {"errorText": str(e)})
            yield sse("finish", {"finishReason": "error"})
            yield "data: [DONE]\n\n"

    return StreamingHttpResponse(generate(), content_type="text/event-stream")