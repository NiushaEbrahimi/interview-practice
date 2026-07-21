"""
Seed database from JSON files in api/seed_data/.

Usage:
    python manage.py seed_from_json                    # seed all JSON files
    python manage.py seed_from_json --course React     # seed specific course
    python manage.py seed_from_json --incremental      # skip existing lessons/questions
    python manage.py seed_from_json --list             # list available JSON files

JSON format:
{
  "course": "Course Name",
  "description": "Course description",
  "lessons": [
    {
      "name": "Lesson Name",
      "level": 1,  // 1=Easy, 2=Medium, 3=Hard
      "questions": [
        {
          "question": "What is X?",
          "correct_answer": "X is Y"
        }
      ]
    }
  ]
}
"""

import json
import os
from pathlib import Path
from django.core.management.base import BaseCommand
from api.models import Course, Lesson, Question


SEED_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "seed_data"


class Command(BaseCommand):
    help = "Seed database from JSON files in api/seed_data/"

    def add_arguments(self, parser):
        parser.add_argument(
            "--course",
            type=str,
            help="Seed only a specific course (by course name in JSON)",
        )
        parser.add_argument(
            "--incremental",
            action="store_true",
            help="Skip lessons/questions that already exist instead of re-creating",
        )
        parser.add_argument(
            "--list",
            action="store_true",
            help="List available JSON seed files and exit",
        )

    def handle(self, *args, **options):
        if options["list"]:
            self.list_seed_files()
            return

        if not SEED_DATA_DIR.exists():
            self.stdout.write(self.style.ERROR(f"Seed data directory not found: {SEED_DATA_DIR}"))
            return

        json_files = sorted(SEED_DATA_DIR.glob("*.json"))
        if not json_files:
            self.stdout.write(self.style.WARNING(f"No JSON files found in {SEED_DATA_DIR}"))
            return

        target_course = options.get("course")
        incremental = options["incremental"]

        total_courses = 0
        total_lessons = 0
        total_questions = 0

        for json_file in json_files:
            try:
                data = json.loads(json_file.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                self.stdout.write(self.style.ERROR(f"Error reading {json_file.name}: {e}"))
                continue

            course_name = data.get("course", json_file.stem)
            if target_course and course_name.lower() != target_course.lower():
                continue

            course, created = Course.objects.get_or_create(
                title=course_name,
                defaults={"description": data.get("description", "")},
            )
            if created:
                total_courses += 1
                self.stdout.write(f"  Created course: {course_name}")
            else:
                self.stdout.write(f"  Course exists: {course_name}")

            for lesson_data in data.get("lessons", []):
                lesson_name = lesson_data["name"]
                level = lesson_data.get("level", 1)

                if incremental:
                    lesson, created = Lesson.objects.get_or_create(
                        course=course,
                        name=lesson_name,
                        defaults={"level": level},
                    )
                else:
                    lesson, _ = Lesson.objects.update_or_create(
                        course=course,
                        name=lesson_name,
                        defaults={"level": level},
                    )
                    created = True

                if created:
                    total_lessons += 1

                for q_data in lesson_data.get("questions", []):
                    question_text = q_data["question"]
                    answer_text = q_data["correct_answer"]

                    if incremental:
                        exists = Question.objects.filter(
                            lesson=lesson, question=question_text
                        ).exists()
                        if exists:
                            continue

                    Question.objects.create(
                        lesson=lesson,
                        question=question_text,
                        correct_answer=answer_text,
                    )
                    total_questions += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {total_courses} courses, "
            f"{total_lessons} lessons, {total_questions} questions"
        ))

    def list_seed_files(self):
        if not SEED_DATA_DIR.exists():
            self.stdout.write(self.style.ERROR(f"Seed data directory not found: {SEED_DATA_DIR}"))
            return

        json_files = sorted(SEED_DATA_DIR.glob("*.json"))
        if not json_files:
            self.stdout.write(self.style.WARNING("No JSON files found"))
            return

        self.stdout.write(f"\nAvailable seed files in {SEED_DATA_DIR}:\n")
        for json_file in json_files:
            try:
                data = json.loads(json_file.read_text(encoding="utf-8"))
                course = data.get("course", json_file.stem)
                lessons = len(data.get("lessons", []))
                questions = sum(
                    len(l.get("questions", [])) for l in data.get("lessons", [])
                )
                self.stdout.write(
                    f"  {json_file.name:30s}  course={course:15s}  "
                    f"lessons={lessons}  questions={questions}"
                )
            except (json.JSONDecodeError, UnicodeDecodeError):
                self.stdout.write(f"  {json_file.name:30s}  (error reading file)")
