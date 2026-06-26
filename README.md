# Interview Practice
<p align="center">
  <img src="https://img.shields.io/badge/status-in%20progress-lightgrey" alt="Status">
  <img src="https://img.shields.io/badge/project-not%20complete-orange" alt="Status">
</p>

<p align="center">
  <img src="./src/assets/gif/demo.gif" alt="Project Demo" width="900">
</p>


A React project built to explore and practice both frontend and backend, mostly frontend, with the concept of a platforn for practicing questions for interview.

## Demo

Live demo:
👁️ ... coming up

---

## About

Interview Practice is a full-stack web application designed to simulate technical interview experiences and help users improve their problem-solving skills.

The project focuses on building a realistic interview workflow, including question management, practice sessions, and performance tracking. It serves as a practical environment for exploring modern frontend and backend development patterns while providing an interactive learning experience for users.

The frontend is built with React, TypeScript, Tailwind CSS, and Vite, while the backend is powered by Django. The application is currently under active development, with additional features, deployment support, and production-ready improvements planned for future releases.

---

## Tech Stack

* React, (TS)
* tailwind
* Vite
* Django (planned)

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
pip install -r requirements.txt
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

---

## Roadmap

* [ ] mock data for vercel and preview
* [ ] deployment
* [ ] improving responsive

---

## License

This project is intended for learning and experimentation.
