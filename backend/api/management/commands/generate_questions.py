"""
Generate interview questions using Ollama (or any OpenAI-compatible API).

Requires Ollama running locally with a model pulled:
    ollama pull gemma2:2b

Usage:
    python manage.py generate_questions --lesson "React Hooks" --count 10
    python manage.py generate_questions --lesson "Python Decorators" --count 5 --model llama3
    python manage.py generate_questions --lesson "Django ORM" --count 8 --dry-run
    python manage.py generate_questions --lesson "CSS Grid" --count 10 --export hooks_questions.json
"""

import json
import os
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
from api.models import Lesson, Question


class Command(BaseCommand):
    help = "Generate interview questions using Ollama (or OpenAI-compatible API)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--lesson",
            type=str,
            required=True,
            help="Lesson name to generate questions for (must exist in DB)",
        )
        parser.add_argument(
            "--count",
            type=int,
            default=10,
            help="Number of questions to generate (default: 10)",
        )
        parser.add_argument(
            "--model",
            type=str,
            default=None,
            help="Ollama model to use (default: from env LLM_MODEL or gemma2:2b)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print questions without saving to database",
        )
        parser.add_argument(
            "--export",
            type=str,
            default=None,
            help="Export generated questions to a JSON file instead of saving to DB",
        )
        parser.add_argument(
            "--difficulty",
            type=str,
            choices=["easy", "medium", "hard", "mixed"],
            default="mixed",
            help="Difficulty distribution: easy, medium, hard, or mixed (default: mixed)",
        )

    def handle(self, *args, **options):
        lesson_name = options["lesson"]
        count = options["count"]
        dry_run = options["dry_run"]
        export_path = options.get("export")
        difficulty = options["difficulty"]

        # Find the lesson
        try:
            lesson = Lesson.objects.get(name__iexact=lesson_name)
        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f"Lesson '{lesson_name}' not found in database. "
                f"Available lessons: {', '.join(Lesson.objects.values_list('name', flat=True)[:20])}"
            ))
            return

        # Configure LLM
        llm_base_url = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
        llm_api_key = os.getenv("LLM_API_KEY", "ollama")
        llm_model = options.get("model") or os.getenv("LLM_MODEL", "gemma2:2b")

        self.stdout.write(f"Generating {count} questions for '{lesson_name}' using {llm_model}...")

        try:
            from openai import OpenAI
            client = OpenAI(base_url=llm_base_url, api_key=llm_api_key)
        except ImportError:
            self.stdout.write(self.style.ERROR(
                "openai package not installed. Run: pip install openai"
            ))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Cannot connect to LLM at {llm_base_url}: {e}"))
            self.stdout.write(self.style.WARNING(
                "Make sure Ollama is running: ollama serve"
            ))
            return

        # Build the prompt
        difficulty_instruction = ""
        if difficulty == "easy":
            difficulty_instruction = "Focus on beginner-level questions that test basic understanding."
        elif difficulty == "medium":
            difficulty_instruction = "Focus on intermediate questions that test practical knowledge."
        elif difficulty == "hard":
            difficulty_instruction = "Focus on advanced questions that test deep understanding and edge cases."
        else:
            difficulty_instruction = "Mix easy, medium, and hard questions."

        existing_questions = list(
            Question.objects.filter(lesson=lesson).values_list("question", flat=True)
        )
        existing_context = ""
        if existing_questions:
            existing_context = (
                f"\n\nAvoid duplicating these existing questions:\n"
                + "\n".join(f"- {q}" for q in existing_questions[:20])
            )

        prompt = f"""Generate exactly {count} interview questions about "{lesson_name}" for a programming interview practice app.

{difficulty_instruction}

Return ONLY a JSON array of objects with "question" and "correct_answer" fields.
Each question should be practical and test real understanding.
Each answer should be a clear, concise explanation (1-3 sentences).

Example format:
[
  {{"question": "What is X?", "correct_answer": "X is Y because Z."}}
]{existing_context}

Return only the JSON array, no markdown, no explanation."""

        try:
            response = client.chat.completions.create(
                model=llm_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert programming interview question writer. Generate high-quality, practical interview questions. Always return valid JSON.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.7,
            )

            content = response.choices[0].message.content.strip()

            # Try to extract JSON from the response
            # Handle cases where LLM wraps in ```json ... ```
            if content.startswith("```"):
                lines = content.split("\n")
                content = "\n".join(lines[1:-1])

            questions = json.loads(content)

            if not isinstance(questions, list):
                raise ValueError("Response is not a JSON array")

            self.stdout.write(self.style.SUCCESS(f"Generated {len(questions)} questions"))

            if export_path:
                # Export to JSON file
                export_data = {
                    "course": lesson.course.title,
                    "lessons": [
                        {
                            "name": lesson.name,
                            "level": lesson.level,
                            "questions": questions,
                        }
                    ],
                }
                Path(export_path).write_text(
                    json.dumps(export_data, indent=2, ensure_ascii=False),
                    encoding="utf-8",
                )
                self.stdout.write(self.style.SUCCESS(f"Exported to {export_path}"))
            elif dry_run:
                # Print questions
                for i, q in enumerate(questions, 1):
                    self.stdout.write(f"\n--- Question {i} ---")
                    self.stdout.write(f"Q: {q.get('question', 'N/A')}")
                    self.stdout.write(f"A: {q.get('correct_answer', 'N/A')}")
            else:
                # Save to database
                created = 0
                for q in questions:
                    question_text = q.get("question", "").strip()
                    answer_text = q.get("correct_answer", "").strip()
                    if question_text and answer_text:
                        # Skip duplicates
                        if not Question.objects.filter(
                            lesson=lesson, question=question_text
                        ).exists():
                            Question.objects.create(
                                lesson=lesson,
                                question=question_text,
                                correct_answer=answer_text,
                            )
                            created += 1
                self.stdout.write(self.style.SUCCESS(f"Saved {created} new questions to database"))

        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"Failed to parse LLM response as JSON: {e}"))
            self.stdout.write(f"Raw response:\n{content[:500]}")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error generating questions: {e}"))
