# Interview Practice
<p align="center">
  <img src="https://img.shields.io/badge/status-in%20progress-lightgrey" alt="Status">
  <img src="https://img.shields.io/badge/project-not%20complete-orange" alt="Status">
</p>

<p align="center">
  <img src="./frontend/src/assets/demo.gif" alt="Project Demo" width="900">
</p>


A React project built to explore and practice both frontend and backend, mostly frontend, with the concept of a platforn for practicing questions for interview.

## Demo

Live demo: [https://interview-practice-demo-iota.vercel.app/](https://interview-practice-demo-iota.vercel.app/)

> The demo runs in **mock mode** — no backend required. All data is simulated locally in your browser.

---

## About

Interview Practice is a full-stack web application designed to simulate technical interview experiences and help users improve their problem-solving skills.

The project focuses on building a realistic interview workflow, including question management, practice sessions, and performance tracking. It serves as a practical environment for exploring modern frontend and backend development patterns while providing an interactive learning experience for users.

The frontend is built with React, TypeScript, Tailwind CSS, and Vite, while the backend is powered by Django. The application includes an AI-powered answer scoring feature using Ollama for local LLM inference. The application is currently under active development, with additional features, deployment support, and production-ready improvements planned for future releases.

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
* Ollama (local LLM inference) via OpenAI-compatible API

---

## Requirements

Before running the project locally, ensure the following tools are installed:

### Frontend

* Node.js 18 or later
* npm (included with Node.js)

### Backend

* Python 3.11 or later
* pip
* Virtual environment support (`venv`)
* Ollama (for AI scoring feature)

Verify your installation:

```bash
node -v
npm -v
python --version
pip --version
ollama --version
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

The frontend development server will start on the configured Vite port.

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
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv openai google-generativeai
```

Apply migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available on the configured Django development port.

### 4. Set up Ollama (AI scoring)

Install Ollama from https://ollama.com/download, then pull a small model:

```bash
ollama pull gemma2:2b
```

This downloads a ~1.7GB model. The AI scoring feature sends questions and user answers to this local model for evaluation and feedback.

### 5. Configure environment variables

Create a `backend/.env` file (already in `.gitignore`):

```env
# Optional: Only needed if you want to use cloud AI providers instead of Ollama
GEMINI_API_KEY=your-key-here
```

### Demo Mode

When the backend is not available (e.g. on Vercel), the frontend automatically activates **demo mode** with simulated data. No configuration needed — just deploy the `frontend/` directory to Vercel:

1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `frontend`
3. Framework: Vite (auto-detected)
4. Deploy

The app will show a "Demo Mode" banner and all features will work with mock data.

---

## Features

* **Course & lesson browsing** — browse courses, lessons, and questions
* **Self-assessment** — rate your confidence on each question (1-5) and mark for review
* **AI scoring** — type your answer and get AI-powered feedback and scoring (1-5) using a local LLM via Ollama
* **Progress tracking** — track which questions you've answered and your confidence over time
* **Stats dashboard** — view your overall performance and weak areas
* **Demo mode** — full app works without a backend using mock data

---

## Roadmap

* [x] mock data for vercel and preview
* [x] deployment
* [x] improving responsive
* [x] AI-powered answer scoring with Ollama
* [ ] improving prompt quality for better AI feedback
* [ ] adding more question categories
* [ ] user auth improvements (password reset, email verification)

---

## License

This project is intended for learning and experimentation.
