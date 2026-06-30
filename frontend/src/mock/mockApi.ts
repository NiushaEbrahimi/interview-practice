import {
  DEMO_USER,
  DEMO_TOKEN,
  DEMO_REFRESH_TOKEN,
  DEMO_COURSES,
  DEMO_LESSONS,
  DEMO_QUESTIONS,
  DEMO_PROGRESS,
  DEMO_ATTEMPTS,
  DEMO_STATS,
} from "./mockData";

const API_BASE = "http://127.0.0.1:8000";

let isDemoMode = false;

export function isDemo(): boolean {
  return isDemoMode;
}

export function activateDemo(): void {
  if (isDemoMode) return;
  isDemoMode = true;

  localStorage.setItem("authToken", DEMO_TOKEN);
  localStorage.setItem("refreshToken", DEMO_REFRESH_TOKEN);
  localStorage.setItem("user", JSON.stringify(DEMO_USER));

  patchFetch();
  patchAxios();
}

export async function checkBackend(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE}/api/courses/`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function matchUrl(url: string, pattern: string): boolean {
  const clean = url.replace(API_BASE, "");
  return clean.startsWith(pattern);
}

function getParam(url: string, key: string): string | null {
  try {
    const u = new URL(url, API_BASE);
    return u.searchParams.get(key);
  } catch {
    return null;
  }
}

function handleMockFetch(url: string, options: RequestInit = {}): Response | null {
  const method = (options.method || "GET").toUpperCase();
  const cleanUrl = url.replace(API_BASE, "");

  // Auth endpoints
  if (matchUrl(url, "/api/auth/login/") && method === "POST") {
    return jsonResponse({ access: DEMO_TOKEN, refresh: DEMO_REFRESH_TOKEN, user: DEMO_USER });
  }
  if (matchUrl(url, "/api/auth/register/") && method === "POST") {
    return jsonResponse({ id: 1, email: DEMO_USER.email });
  }
  if (matchUrl(url, "/api/auth/check-email/") && method === "POST") {
    return jsonResponse({ available: true });
  }
  if (matchUrl(url, "/api/auth/token/refresh/") && method === "POST") {
    return jsonResponse({ access: DEMO_TOKEN, user: DEMO_USER });
  }
  if (matchUrl(url, "/api/auth/profile/") && method === "GET") {
    return jsonResponse(DEMO_USER);
  }

  // Stats
  if (matchUrl(url, "/api/stats/me/")) {
    return jsonResponse(DEMO_STATS);
  }

  // Courses
  if (matchUrl(url, "/api/courses/") && method === "GET") {
    if (/\/api\/courses\/\d+\/$/.test(cleanUrl)) {
      const id = parseInt(cleanUrl.match(/\/api\/courses\/(\d+)\//)?.[1] || "0");
      const course = DEMO_COURSES.find((c) => c.id === id);
      return course ? jsonResponse(course) : jsonResponse({ detail: "Not found" }, 404);
    }
    return jsonResponse(DEMO_COURSES);
  }

  // Lessons
  if (matchUrl(url, "/api/lessons/") && method === "GET") {
    const course = getParam(url, "course");
    const level = getParam(url, "level");
    let filtered = [...DEMO_LESSONS];
    if (course) filtered = filtered.filter((l) => l.course.toLowerCase() === course.toLowerCase());
    if (level) filtered = filtered.filter((l) => l.level === parseInt(level));
    return jsonResponse(filtered);
  }

  // Questions
  if (matchUrl(url, "/api/questions/") && method === "GET") {
    const lesson = getParam(url, "lesson");
    if (lesson) {
      const questions = DEMO_QUESTIONS[lesson] || [];
      return jsonResponse(questions);
    }
    return jsonResponse(Object.values(DEMO_QUESTIONS).flat());
  }

  // Progress
  if (matchUrl(url, "/api/progress/") && method === "GET") {
    const lessonId = getParam(url, "lesson");
    if (lessonId) {
      const items = DEMO_PROGRESS.filter((p) => p.lesson === parseInt(lessonId));
      return jsonResponse(items);
    }
    return jsonResponse(DEMO_PROGRESS);
  }
  if (matchUrl(url, "/api/progress/") && method === "POST") {
    const body = JSON.parse(options.body as string);
    const newItem = {
      id: DEMO_PROGRESS.length + 1,
      user: 1,
      lesson: body.lesson,
      lesson_name: DEMO_LESSONS.find((l) => l.id === body.lesson)?.name || "",
      lesson_level_display: DEMO_LESSONS.find((l) => l.id === body.lesson)?.level_display || "Easy",
      course_title: DEMO_LESSONS.find((l) => l.id === body.lesson)?.course || "",
      progress_percent: 0,
      will_study_later: body.will_study_later ?? false,
      started_at: new Date().toISOString(),
      completed_at: null,
    };
    DEMO_PROGRESS.push(newItem);
    return jsonResponse(newItem, 201);
  }
  if (/\/api\/progress\/\d+\/$/.test(cleanUrl) && method === "PATCH") {
    const id = parseInt(cleanUrl.match(/\/api\/progress\/(\d+)\//)?.[1] || "0");
    const item = DEMO_PROGRESS.find((p) => p.id === id);
    if (item) {
      const body = JSON.parse(options.body as string);
      Object.assign(item, body);
      return jsonResponse(item);
    }
    return jsonResponse({ detail: "Not found" }, 404);
  }

  // Attempts
  if (matchUrl(url, "/api/attempts/") && method === "GET") {
    const questionId = getParam(url, "question");
    const lesson = getParam(url, "lesson");
    let filtered = [...DEMO_ATTEMPTS];
    if (questionId) filtered = filtered.filter((a) => a.question === parseInt(questionId));
    if (lesson) {
      const lessonObj = DEMO_LESSONS.find((l) => l.name === lesson);
      if (lessonObj) {
        const qIds = (DEMO_QUESTIONS[lesson] || []).map((q) => q.id);
        filtered = filtered.filter((a) => qIds.includes(a.question));
      }
    }
    return jsonResponse(filtered);
  }
  if (matchUrl(url, "/api/attempts/") && method === "POST") {
    const body = JSON.parse(options.body as string);
    const newAttempt = {
      id: DEMO_ATTEMPTS.length + 1,
      user: 1,
      question: body.question,
      confidence_rate: body.confidence_rate ?? 3,
      come_back_again: body.come_back_again ?? false,
      answered_at: new Date().toISOString(),
    };
    DEMO_ATTEMPTS.push(newAttempt);
    return jsonResponse(newAttempt, 201);
  }

  return null;
}

function patchFetch(): void {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.startsWith(API_BASE)) {
      const mockResponse = handleMockFetch(url, init);
      if (mockResponse) return mockResponse;
    }

    return originalFetch(input, init);
  };
}

function patchAxios(): void {
  const XHR = XMLHttpRequest.prototype;
  const open = XHR.open;
  const send = XHR.send;

  XHR.open = function (this: XMLHttpRequest, method: string, url: string | URL) {
    (this as unknown as Record<string, unknown>)._mockMethod = method;
    (this as unknown as Record<string, unknown>)._mockUrl =
      typeof url === "string" ? url : url.toString();
    return open.apply(this, arguments as unknown as Parameters<typeof open>);
  };

  XHR.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const url = ((this as unknown as Record<string, unknown>)._mockUrl as string) || "";

    if (url.startsWith(API_BASE)) {
      const mockResponse = handleMockFetch(url, {
        method: ((this as unknown as Record<string, unknown>)._mockMethod as string) || "GET",
        body: typeof body === "string" ? body : undefined,
      });
      if (mockResponse) {
        const xhr = this;
        mockResponse.json().then((data) => {
          Object.defineProperty(xhr, "responseText", { value: JSON.stringify(data) });
          Object.defineProperty(xhr, "response", { value: JSON.stringify(data) });
          Object.defineProperty(xhr, "status", { value: mockResponse.status });
          Object.defineProperty(xhr, "readyState", { value: 4 });
          xhr.dispatchEvent(new Event("readystatechange"));
          xhr.dispatchEvent(new Event("load"));
          xhr.dispatchEvent(new Event("loadend"));
        });
        return;
      }
    }

    return send.apply(this, arguments as unknown as Parameters<typeof send>);
  };
}
