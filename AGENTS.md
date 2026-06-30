# AGENTS.md

## Project overview

Interview practice platform — React frontend + Django REST backend. Two independent apps in `frontend/` and `backend/`, no monorepo tooling.

## Commands

### Frontend (run from `frontend/`)

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint (flat config, TS/React rules)
```

No test runner configured.

### Backend (run from `backend/`)

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py seed_questions   # populates lessons + questions (destructive: deletes all Questions)
python manage.py runserver        # → http://127.0.0.1:8000
```

No `requirements.txt` exists — install packages from imports manually. Core deps: `django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`.

No tests implemented (`api/tests.py` and `authorization/tests.py` are empty stubs).

## Architecture

### Backend (`backend/`)

- **Django project**: `backend/backend/` — settings, root urls, wsgi/asgi
- **Two apps**:
  - `authorization/` — custom User model (email-based, no username field), JWT auth, profile CRUD
  - `api/` — courses, lessons, questions, attempts, progress, stats
- **Custom User model**: `authorization.User` (set via `AUTH_USER_MODEL`). Uses email as `USERNAME_FIELD`, no `username` field at all. Custom `CustomUserManager`.
- **Auth**: JWT via `rest_framework_simplejwt`. Access token lifetime: 60 min. Refresh: 1 day. `Bearer` header type.
- **Database**: SQLite (`db.sqlite3`), committed to repo
- **CORS**: `CORS_ALLOW_ALL_ORIGINS = True` + explicit `localhost:5173` allowed
- **API prefix**: `/api/` for content, `/api/auth/` for auth endpoints
- **DRF default permissions**: `IsAuthenticated` globally; auth views override with `permission_classes = []`
- **Management command**: `seed_questions` — maps lesson names to question/answer pairs. Requires lessons to exist first (no lesson seeder included).

### Frontend (`frontend/`)

- **Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 (via `@tailwindcss/vite` plugin), React Router 7
- **Entry**: `src/main.tsx` → `src/App.tsx` (BrowserRouter + AuthProvider + Routes)
- **Auth flow**: `AuthContext` stores JWT + user in localStorage. `useAuthFetch` hook adds Bearer token and handles 401/403 redirects.
- **Routing**: All authenticated routes wrapped in `<ProtectedRoute>`. Public: `/login`, `/signup`.
- **API base URL**: Hardcoded `http://127.0.0.1:8000` in components (no env variable or config file).
- **Types**: Two type files — `src/types/types.ts` (Lesson type) and `src/assets/types.ts` (full type definitions). Use `src/assets/types.ts` as the canonical source.
- **UI**: Tailwind utility classes, dark theme default (`bg-gray-100`/`bg-gray-200`), rounded cards (`rounded-3xl`), Splide carousel for some views.

## Gotchas

- **No requirements.txt**: Backend deps must be installed manually from code imports.
- **Hardcoded API URLs**: Frontend fetches use `http://127.0.0.1:8000` directly — no proxy, no env vars. Changing the backend port requires updating all fetch calls.
- **db.sqlite3 is committed**: The SQLite database with seed data is in version control. `seed_questions` is destructive (deletes all questions before re-seeding).
- **Duplicate type files**: `src/types/types.ts` and `src/assets/types.ts` both define Lesson-like types. `src/assets/types.ts` is more complete.
- **settings.py in .gitignore**: The backend `.gitignore` lists `settings.py` but the file is tracked (needed for the project to work). Don't assume it's missing.
- **No lesson seeder**: `seed_questions` expects lessons to already exist in the DB. There's no management command to create courses or lessons.
- **`print()` debug statements**: `api/views.py:93` and `api/services.py:113` have leftover `print()` calls.
