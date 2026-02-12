from datetime import date, timedelta
from .models import UserQuestionAttempt, Question
from django.db.models import Count
from django.db.models import Avg

def get_user_stats(user):
    attempts = UserQuestionAttempt.objects.filter(user=user)
    total = attempts.values("question").distinct().count()

    avg_confidence = attempts.aggregate(
        avg=Avg("confidence_rate")
    )["avg"] or 0

    accuracy = avg_confidence / 100

    dates = attempts.dates('answered_at', 'day', order='DESC')

    streak = 0
    today = date.today()

    courses_count = attempts.aggregate(
        total=Count("question__lesson__course", distinct=True)
    )["total"]

    for d in dates:
        if d == today - timedelta(days=streak):
            streak += 1
        else:
            break

    return {
        "questions_practiced": total,
        "accuracy_rate": round(accuracy, 2),
        "days_streak": streak,
        "courses": courses_count
    }



def courses_with_question_count():
    print( Question.objects.annotate(
        total_questions=Count("questions")
    ))
