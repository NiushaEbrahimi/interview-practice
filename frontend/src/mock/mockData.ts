export const DEMO_USER = {
  id: 1,
  email: "demo@example.com",
  is_verified: true,
  is_active: true,
  created_at: "2025-01-15T10:00:00Z",
  profile: {
    full_name: "Demo User",
    experience_level: "mid-level",
    known_technologies: "React, JavaScript, Python",
    learning_technologies: "TypeScript, Next.js, Django",
    known_technologies_list: ["React", "JavaScript", "Python"],
    learning_technologies_list: ["TypeScript", "Next.js", "Django"],
  },
};

export const DEMO_TOKEN = "demo-access-token";
export const DEMO_REFRESH_TOKEN = "demo-refresh-token";

export const DEMO_COURSES = [
  {
    id: 1,
    title: "React",
    started: true,
    lessons: [
      { id: 1, name: "React Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 2, course: "React", started: true },
      { id: 2, name: "Memoizaion", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 1, course: "React", started: true },
      { id: 3, name: "Hooks", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "React", started: false },
      { id: 4, name: "react-router-dom", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "React", started: false },
    ],
  },
  {
    id: 2,
    title: "JavaScript",
    started: true,
    lessons: [
      { id: 5, name: "JavaScript Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 2, course: "JavaScript", started: true },
      { id: 6, name: "Closure", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 1, course: "JavaScript", started: true },
      { id: 7, name: "this", level: 3, level_display: "Hard", questions_count: 2, questions_answered: 0, course: "JavaScript", started: false },
      { id: 8, name: "Prototype", level: 3, level_display: "Hard", questions_count: 2, questions_answered: 0, course: "JavaScript", started: false },
    ],
  },
  {
    id: 3,
    title: "Python",
    started: false,
    lessons: [
      { id: 9, name: "Python Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "Python", started: false },
      { id: 10, name: "VirtualEnv", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "Python", started: false },
    ],
  },
  {
    id: 4,
    title: "HTML",
    started: false,
    lessons: [
      { id: 11, name: "HTML Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "HTML", started: false },
      { id: 12, name: "Accessibility", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "HTML", started: false },
    ],
  },
  {
    id: 5,
    title: "CSS",
    started: true,
    lessons: [
      { id: 13, name: "CSS Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 2, course: "CSS", started: true },
      { id: 14, name: "css animations", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "CSS", started: false },
      { id: 15, name: "Selectors", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "CSS", started: false },
    ],
  },
  {
    id: 6,
    title: "TypeScript",
    started: false,
    lessons: [
      { id: 16, name: "TypeScript Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "TypeScript", started: false },
      { id: 17, name: "interface vs type", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "TypeScript", started: false },
    ],
  },
  {
    id: 7,
    title: "Next.js",
    started: false,
    lessons: [
      { id: 18, name: "Next.js Introduction", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "Next.js", started: false },
      { id: 19, name: "Routes and folder structure", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "Next.js", started: false },
    ],
  },
  {
    id: 8,
    title: "Django",
    started: false,
    lessons: [
      { id: 20, name: "Django Introductions", level: 1, level_display: "Easy", questions_count: 2, questions_answered: 0, course: "Django", started: false },
      { id: 21, name: "views", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "Django", started: false },
      { id: 22, name: "models", level: 2, level_display: "Medium", questions_count: 2, questions_answered: 0, course: "Django", started: false },
    ],
  },
];

export const DEMO_LESSONS = DEMO_COURSES.flatMap((c) => c.lessons);

export const DEMO_QUESTIONS: Record<string, { id: number; question: string; correct_answer: string; lesson: number }[]> = {
  "React Introduction": [
    { id: 1, question: "What is React mainly used for?", correct_answer: "Building user interfaces", lesson: 1 },
    { id: 2, question: "What problem does React solve?", correct_answer: "Efficient UI rendering and state management", lesson: 1 },
  ],
  "Memoizaion": [
    { id: 3, question: "What is memoization in React?", correct_answer: "Caching expensive function results to avoid recalculation", lesson: 2 },
    { id: 4, question: "When should you use memoization?", correct_answer: "When a computation is expensive and repeats often", lesson: 2 },
  ],
  "Hooks": [
    { id: 5, question: "What is a React Hook?", correct_answer: "A function that lets you use state and lifecycle features", lesson: 3 },
    { id: 6, question: "Can hooks be used inside loops?", correct_answer: "No, hooks must be called at the top level", lesson: 3 },
  ],
  "react-router-dom": [
    { id: 7, question: "What is react-router-dom used for?", correct_answer: "Client-side routing in React applications", lesson: 4 },
    { id: 8, question: "What does the Link component do?", correct_answer: "Navigates without page reload", lesson: 4 },
  ],
  "JavaScript Introduction": [
    { id: 9, question: "What is JavaScript?", correct_answer: "A programming language for the web", lesson: 5 },
    { id: 10, question: "Is JavaScript synchronous?", correct_answer: "Yes, but supports asynchronous behavior", lesson: 5 },
  ],
  "Closure": [
    { id: 11, question: "What is a closure?", correct_answer: "Function that remembers its outer scope", lesson: 6 },
    { id: 12, question: "Why are closures useful?", correct_answer: "They allow data encapsulation", lesson: 6 },
  ],
  "this": [
    { id: 13, question: "What does 'this' refer to in JavaScript?", correct_answer: "The execution context object", lesson: 7 },
    { id: 14, question: "Does 'this' behave the same in arrow functions?", correct_answer: "No, arrow functions don't bind 'this'", lesson: 7 },
  ],
  "Prototype": [
    { id: 15, question: "What is a prototype in JavaScript?", correct_answer: "An object from which other objects inherit", lesson: 8 },
    { id: 16, question: "What is prototype chain?", correct_answer: "Chain used for property lookup", lesson: 8 },
  ],
  "Python Introduction": [
    { id: 17, question: "What is Python?", correct_answer: "A high-level programming language", lesson: 9 },
    { id: 18, question: "Is Python compiled or interpreted?", correct_answer: "Interpreted", lesson: 9 },
  ],
  "VirtualEnv": [
    { id: 19, question: "What is a virtual environment?", correct_answer: "An isolated Python environment", lesson: 10 },
    { id: 20, question: "Why use virtualenv?", correct_answer: "To avoid dependency conflicts", lesson: 10 },
  ],
  "HTML Introduction": [
    { id: 21, question: "What is HTML?", correct_answer: "Markup language for structuring web pages", lesson: 11 },
    { id: 22, question: "What does HTML stand for?", correct_answer: "HyperText Markup Language", lesson: 11 },
  ],
  "Accessibility": [
    { id: 23, question: "What is web accessibility?", correct_answer: "Making websites usable for everyone including disabled users", lesson: 12 },
    { id: 24, question: "Why is alt text important?", correct_answer: "It helps screen readers describe images", lesson: 12 },
  ],
  "CSS Introduction": [
    { id: 25, question: "What is CSS?", correct_answer: "Style sheet language for designing web pages", lesson: 13 },
    { id: 26, question: "What does CSS control?", correct_answer: "Layout, colors, spacing, and design", lesson: 13 },
  ],
  "css animations": [
    { id: 27, question: "What are CSS animations used for?", correct_answer: "Creating motion effects on web elements", lesson: 14 },
    { id: 28, question: "What property defines animation duration?", correct_answer: "animation-duration", lesson: 14 },
  ],
  "Selectors": [
    { id: 29, question: "What is a CSS selector?", correct_answer: "Pattern used to select HTML elements", lesson: 15 },
    { id: 30, question: "What is the difference between class and id selectors?", correct_answer: "Class is reusable, id is unique", lesson: 15 },
  ],
  "TypeScript Introduction": [
    { id: 31, question: "What is TypeScript?", correct_answer: "A typed superset of JavaScript", lesson: 16 },
    { id: 32, question: "Why use TypeScript?", correct_answer: "To catch errors during development", lesson: 16 },
  ],
  "interface vs type": [
    { id: 33, question: "What is an interface in TypeScript?", correct_answer: "Defines object structure", lesson: 17 },
    { id: 34, question: "Difference between type and interface?", correct_answer: "Interfaces are extendable, types are more flexible", lesson: 17 },
  ],
  "Next.js Introduction": [
    { id: 35, question: "What is Next.js?", correct_answer: "A React framework for production apps", lesson: 18 },
    { id: 36, question: "What feature does Next.js provide?", correct_answer: "SSR and routing", lesson: 18 },
  ],
  "Routes and folder structure": [
    { id: 37, question: "How does routing work in Next.js?", correct_answer: "File-based routing system", lesson: 19 },
    { id: 38, question: "What is the purpose of the pages/app folder?", correct_answer: "Defines routes automatically", lesson: 19 },
  ],
  "Django Introductions": [
    { id: 39, question: "What is Django?", correct_answer: "A Python web framework", lesson: 20 },
    { id: 40, question: "What is Django used for?", correct_answer: "Building backend web applications", lesson: 20 },
  ],
  "views": [
    { id: 41, question: "What is a Django view?", correct_answer: "A function or class that handles requests", lesson: 21 },
    { id: 42, question: "What does a view return?", correct_answer: "HTTP response", lesson: 21 },
  ],
  "models": [
    { id: 43, question: "What is a Django model?", correct_answer: "A representation of database tables", lesson: 22 },
    { id: 44, question: "What does ORM mean in Django?", correct_answer: "Object Relational Mapping", lesson: 22 },
  ],
};

export const DEMO_PROGRESS = [
  { id: 1, user: 1, lesson: 1, lesson_name: "React Introduction", lesson_level_display: "Easy", course_title: "React", progress_percent: 100, will_study_later: false, started_at: "2025-06-20T10:00:00Z", completed_at: "2025-06-20T10:30:00Z" },
  { id: 2, user: 1, lesson: 2, lesson_name: "Memoizaion", lesson_level_display: "Medium", course_title: "React", progress_percent: 50, will_study_later: true, started_at: "2025-06-22T14:00:00Z", completed_at: null },
  { id: 3, user: 1, lesson: 5, lesson_name: "JavaScript Introduction", lesson_level_display: "Easy", course_title: "JavaScript", progress_percent: 100, will_study_later: false, started_at: "2025-06-18T09:00:00Z", completed_at: "2025-06-18T09:20:00Z" },
  { id: 4, user: 1, lesson: 6, lesson_name: "Closure", lesson_level_display: "Medium", course_title: "JavaScript", progress_percent: 50, will_study_later: false, started_at: "2025-06-25T11:00:00Z", completed_at: null },
  { id: 5, user: 1, lesson: 13, lesson_name: "CSS Introduction", lesson_level_display: "Easy", course_title: "CSS", progress_percent: 100, will_study_later: false, started_at: "2025-06-15T08:00:00Z", completed_at: "2025-06-15T08:25:00Z" },
];

export const DEMO_ATTEMPTS = [
  { id: 1, user: 1, question: 1, confidence_rate: 5, come_back_again: false, answered_at: "2025-06-20T10:05:00Z" },
  { id: 2, user: 1, question: 2, confidence_rate: 4, come_back_again: false, answered_at: "2025-06-20T10:10:00Z" },
  { id: 3, user: 1, question: 3, confidence_rate: 3, come_back_again: true, answered_at: "2025-06-22T14:05:00Z" },
  { id: 4, user: 1, question: 9, confidence_rate: 5, come_back_again: false, answered_at: "2025-06-18T09:05:00Z" },
  { id: 5, user: 1, question: 10, confidence_rate: 4, come_back_again: false, answered_at: "2025-06-18T09:10:00Z" },
  { id: 6, user: 1, question: 11, confidence_rate: 2, come_back_again: true, answered_at: "2025-06-25T11:05:00Z" },
  { id: 7, user: 1, question: 25, confidence_rate: 5, come_back_again: false, answered_at: "2025-06-15T08:05:00Z" },
  { id: 8, user: 1, question: 26, confidence_rate: 4, come_back_again: false, answered_at: "2025-06-15T08:10:00Z" },
];

export const DEMO_STATS = {
  questions_practiced: 8,
  accuracy_rate: 4.0,
  days_streak: 3,
  courses: 3,
  levels: [
    { level: 1, level_display: "Easy", answered: 6, total: 16, percent: 38 },
    { level: 2, level_display: "Medium", answered: 2, total: 20, percent: 10 },
    { level: 3, level_display: "Hard", answered: 0, total: 8, percent: 0 },
  ],
  topics: [
    { topic: "JavaScript", answered: 3, total: 8, percent: 38 },
    { topic: "React", answered: 3, total: 8, percent: 38 },
    { topic: "CSS", answered: 2, total: 6, percent: 33 },
    { topic: "Python", answered: 0, total: 4, percent: 0 },
    { topic: "HTML", answered: 0, total: 4, percent: 0 },
    { topic: "TypeScript", answered: 0, total: 4, percent: 0 },
    { topic: "Next.js", answered: 0, total: 4, percent: 0 },
    { topic: "Django", answered: 0, total: 6, percent: 0 },
  ],
  study_later_lessons: [
    { id: 2, name: "Memoizaion", level: 2, level_display: "Medium", course: "React", progress_percent: 50 },
  ],
  come_back_questions: [
    { id: 3, question: "What is memoization in React?", correct_answer: "Caching expensive function results to avoid recalculation", lesson: "Memoizaion", level_display: "Medium", course: "React" },
    { id: 11, question: "What is a closure?", correct_answer: "Function that remembers its outer scope", lesson: "Closure", level_display: "Medium", course: "JavaScript" },
  ],
};
