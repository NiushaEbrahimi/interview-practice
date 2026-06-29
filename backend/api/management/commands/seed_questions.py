from django.core.management.base import BaseCommand
from api.models import Lesson, Question


class Command(BaseCommand):
    help = "Seed realistic questions for each lesson"

    def handle(self, *args, **kwargs):
        Question.objects.all().delete()

        questions_map = {
            "React Introduction": [
                ("What is React mainly used for?", "Building user interfaces"),
                ("What problem does React solve?", "Efficient UI rendering and state management"),
            ],

            "Memoizaion": [
                ("What is memoization in React?", "Caching expensive function results to avoid recalculation"),
                ("When should you use memoization?", "When a computation is expensive and repeats often"),
            ],

            "Hooks": [
                ("What is a React Hook?", "A function that lets you use state and lifecycle features"),
                ("Can hooks be used inside loops?", "No, hooks must be called at the top level"),
            ],

            "react-router-dom": [
                ("What is react-router-dom used for?", "Client-side routing in React applications"),
                ("What does the Link component do?", "Navigates without page reload"),
            ],

            "Python Introduction": [
                ("What is Python?", "A high-level programming language"),
                ("Is Python compiled or interpreted?", "Interpreted"),
            ],

            "VirtualEnv": [
                ("What is a virtual environment?", "An isolated Python environment"),
                ("Why use virtualenv?", "To avoid dependency conflicts"),
            ],

            "HTML Introduction": [
                ("What is HTML?", "Markup language for structuring web pages"),
                ("What does HTML stand for?", "HyperText Markup Language"),
            ],

            "Accessibility": [
                ("What is web accessibility?", "Making websites usable for everyone including disabled users"),
                ("Why is alt text important?", "It helps screen readers describe images"),
            ],

            "CSS Introduction": [
                ("What is CSS?", "Style sheet language for designing web pages"),
                ("What does CSS control?", "Layout, colors, spacing, and design"),
            ],

            "css animations": [
                ("What are CSS animations used for?", "Creating motion effects on web elements"),
                ("What property defines animation duration?", "animation-duration"),
            ],

            "Selectors": [
                ("What is a CSS selector?", "Pattern used to select HTML elements"),
                ("What is the difference between class and id selectors?", "Class is reusable, id is unique"),
            ],

            "JavaScript Introduction": [
                ("What is JavaScript?", "A programming language for the web"),
                ("Is JavaScript synchronous?", "Yes, but supports asynchronous behavior"),
            ],

            "Closure": [
                ("What is a closure?", "Function that remembers its outer scope"),
                ("Why are closures useful?", "They allow data encapsulation"),
            ],

            "this": [
                ("What does 'this' refer to in JavaScript?", "The execution context object"),
                ("Does 'this' behave the same in arrow functions?", "No, arrow functions don't bind 'this'"),
            ],

            "Prototype": [
                ("What is a prototype in JavaScript?", "An object from which other objects inherit"),
                ("What is prototype chain?", "Chain used for property lookup"),
            ],

            "Next.js Introduction": [
                ("What is Next.js?", "A React framework for production apps"),
                ("What feature does Next.js provide?", "SSR and routing"),
            ],

            "Routes and folder structure": [
                ("How does routing work in Next.js?", "File-based routing system"),
                ("What is the purpose of the pages/app folder?", "Defines routes automatically"),
            ],

            "TypeScript Introduction": [
                ("What is TypeScript?", "A typed superset of JavaScript"),
                ("Why use TypeScript?", "To catch errors during development"),
            ],

            "interface vs type": [
                ("What is an interface in TypeScript?", "Defines object structure"),
                ("Difference between type and interface?", "Interfaces are extendable, types are more flexible"),
            ],

            "Django Introductions": [
                ("What is Django?", "A Python web framework"),
                ("What is Django used for?", "Building backend web applications"),
            ],

            "views": [
                ("What is a Django view?", "A function or class that handles requests"),
                ("What does a view return?", "HTTP response"),
            ],

            "models": [
                ("What is a Django model?", "A representation of database tables"),
                ("What does ORM mean in Django?", "Object Relational Mapping"),
            ],
        }

        created = 0

        lessons = Lesson.objects.all()

        for lesson in lessons:
            q_list = questions_map.get(lesson.name, [])

            for q, a in q_list:
                Question.objects.create(
                    lesson=lesson,
                    question=q,
                    correct_answer=a
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created {created} questions successfully"
        ))