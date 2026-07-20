# Interview Practice

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20progress-lightgrey" alt="Status">
  <img src="https://img.shields.io/badge/project-not%20complete-orange" alt="Status">
</p>

<p align="center">
  <img src="./frontend/src/assets/demo.gif" alt="Project Demo" width="900">
</p>

A full-stack web app for practicing technical interview questions with AI-powered scoring and feedback.

## Demo

Live demo: [https://interview-practice-demo-iota.vercel.app/](https://interview-practice-demo-iota.vercel.app/)

> The demo runs in **mock mode** — no backend required. All data is simulated locally in your browser.

---

## About

Interview Practice is a full-stack web application designed to simulate technical interview experiences and help users improve their problem-solving skills.

The frontend is built with React, TypeScript, Tailwind CSS, and Vite. The backend is powered by Django REST Framework with JWT authentication. The AI scoring feature uses Ollama for local LLM inference, or any OpenAI-compatible API provider.

---

## Tech Stack

### Frontend
* React 19 + TypeScript
* Tailwind CSS 4
* Vite 7
* React Router 7
* AI SDK UI (`@ai-sdk/react`) for chat-based AI scoring

### Backend
* Django + Django REST Framework
* JWT authentication (`djangorestframework-simplejwt`)
* CORS support (`django-cors-headers`)
* OpenAI-compatible LLM API (Ollama, OpenAI, or any compatible provider)

---

## Requirements

### Frontend

* Node.js 18 or later
* npm (included with Node.js)

### Backend

* Python 3.11 or later
* pip
* Virtual environment support (`venv`)
* One of the following for AI scoring:
  * **Ollama** (free, local) — recommended
  * OpenAI API key
  * Any OpenAI-compatible provider

Verify your installation:

```bash
node -v
npm -v
python --version
pip --version
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/NiushaEbrahimi/interview-practice.git
cd interview-practice
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server starts on `http://localhost:5173`.

### 3. Start the backend

Open a new terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**
```bash
venv\Scripts\activate
```

**macOS / Linux**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv openai
```

Apply migrations:

```bash
python manage.py migrate
```

Start the Django dev server:

```bash
python manage.py runserver
```

The backend API will be available on `http://127.0.0.1:8000`.

### 4. Set up AI scoring

The AI scoring feature requires an LLM provider. You have two options:

#### Option A: Ollama (free, local)

1. Install Ollama from https://ollama.com/download
2. Pull a model:
   ```bash
   ollama pull gemma2:2b
   ```
   This downloads a ~1.7GB model. Other models work too — just update `LLM_MODEL` in `backend/.env`.

3. Make sure Ollama is running:
   ```bash
   ollama serve
   ```
   On Windows, Ollama usually starts automatically in the background.

#### Option B: Your own API key

If you have an OpenAI key or use another OpenAI-compatible provider (Groq, Together AI, etc.), edit `backend/.env`:

```env
# OpenAI
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-your-key-here
LLM_MODEL=gpt-4o-mini

# Or any OpenAI-compatible provider
# LLM_BASE_URL=https://api.groq.com/openai/v1
# LLM_API_KEY=gsk_your-key-here
# LLM_MODEL=llama-3.1-8b-instant
```

The default configuration uses Ollama — if you leave `backend/.env` as-is, it will connect to `localhost:11434`.

---

## Demo Mode

When the backend is not available (e.g. on Vercel), the frontend automatically activates **demo mode** with simulated data including mock AI responses. No configuration needed — just deploy the `frontend/` directory to Vercel:

1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `frontend`
3. Framework: Vite (auto-detected)
4. Deploy

The app will show a "Demo Mode" banner and all features will work with mock data.

---

## Features

* **Course & lesson browsing** — browse courses, lessons, and questions
* **Self-assessment** — rate your confidence on each question (1-5) and mark for review
* **AI scoring** — type your answer and get AI-powered feedback, scoring (1-5), and a suggested better answer
* **Progress tracking** — track which questions you've answered and your confidence over time
* **Stats dashboard** — view your overall performance and weak areas
* **Demo mode** — full app works without a backend using mock data (including AI responses)
* **Responsive** — works on mobile, tablet, and desktop

---

## Roadmap

* [x] mock data for vercel and preview
* [x] deployment
* [x] responsive design
* [x] AI-powered answer scoring with Ollama / OpenAI-compatible providers
* [x] configurable LLM provider via environment variables
* [ ] improving prompt quality for better AI feedback
* [ ] adding more question categories
* [ ] user auth improvements (password reset, email verification)

---

## License

This project is intended for learning and experimentation.
