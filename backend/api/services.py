from datetime import date, timedelta
from .models import UserQuestionAttempt, Question
from django.db.models import Count

def get_user_stats(user):
    attempts = UserQuestionAttempt.objects.filter(user=user)

    total = attempts.count()
    correct = attempts.filter(is_correct=True).count()

    accuracy = (correct / total) if total else 0

    dates = (
        attempts
        .dates('answered_at', 'day', order='DESC')
    )

    streak = 0
    today = date.today()

    for d in dates:
        if d == today - timedelta(days=streak):
            streak += 1
        else:
            break

    return {
        "questions_practiced": total,
        "accuracy_rate": round(accuracy, 2),
        "days_streak": streak
    }


def courses_with_question_count():
    print( Question.objects.annotate(
        total_questions=Count("questions")
    ))
