from datetime import date, timedelta
from django.db.models import Avg, Count, F, Q
from .models import Lesson, Question, UserQuestionAttempt

def get_user_stats_by_level(user):
    level_map = {
        level_value: {
            "level": level_value,
            "level_display": level_label,
            "answered": 0,
            "total": 0,
            "percent": 0,
        }
        for level_value, level_label in Lesson.Level.choices
    }

    level_stats = (
        Question.objects
        .values(level=F("lesson__level"))
        .annotate(
            total=Count("pk"),
            answered=Count(
                "userquestionattempt__question",
                filter=Q(userquestionattempt__user=user),
                distinct=True,
            ),
        )
    )

    for row in level_stats:
        level_value = row["level"]
        answered = row["answered"]
        total = row["total"]
        percent = round((answered / total) * 100) if total else 0

        if level_value in level_map:
            level_map[level_value].update(
                answered=answered,
                total=total,
                percent=percent,
            )

    return list(level_map.values())


def get_user_stats_by_topic(user):
    topic_map = {}
    topic_stats = (
        Question.objects
        .values(topic=F("lesson__course__title"))
        .annotate(
            total=Count("pk"),
            answered=Count(
                "userquestionattempt__question",
                filter=Q(userquestionattempt__user=user),
                distinct=True,
            ),
        )
    )

    for row in topic_stats:
        topic = row["topic"] or "Uncategorized"
        answered = row["answered"]
        total = row["total"]
        percent = round((answered / total) * 100) if total else 0

        topic_map[topic] = {
            "topic": topic,
            "answered": answered,
            "total": total,
            "percent": percent,
        }

    return sorted(topic_map.values(), key=lambda item: item["percent"], reverse=True)


def get_user_stats(user):
    attempts = UserQuestionAttempt.objects.filter(user=user)
    total = attempts.values("question").distinct().count()

    avg_confidence = attempts.aggregate(
        avg=Avg("confidence_rate")
    )["avg"] or 0

    accuracy = avg_confidence

    dates = attempts.dates('answered_at', 'day', order='DESC')

    streak = 0
    today = date.today()

    for d in dates:
        if d == today - timedelta(days=streak):
            streak += 1
        else:
            break

    courses_count = attempts.aggregate(
        total=Count("question__lesson__course", distinct=True)
    )["total"]

    return {
        "questions_practiced": total,
        "accuracy_rate": round(accuracy, 2),
        "days_streak": streak,
        "courses": courses_count,
        "levels": get_user_stats_by_level(user),
        "topics": get_user_stats_by_topic(user),
    }


def courses_with_question_count():
    print( Question.objects.annotate(
        total_questions=Count("questions")
    ))
