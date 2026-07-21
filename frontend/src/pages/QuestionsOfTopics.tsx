import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Header from "../components/Header";
import LessonCard from "../components/Questions/LessonCard";
import CourseCard from "../components/Questions/CourseCard";
import type { CourseType, LessonType } from "../assets/types";
import Skeleton from "../components/Skeleton";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Questions() {
  usePageTitle("Courses");
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [showCourses, setShowCourses] = useState(true);
  const [showLessons, setShowLessons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const lessonsData = await authFetch('http://127.0.0.1:8000/api/lessons/');
        const coursesData = await authFetch('http://127.0.0.1:8000/api/courses/');

        setLessons(lessonsData);
        setCourses(coursesData);

      } catch (err) {
        console.error('Error fetching ', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally{
        setLoading(false)
      }
    };

    fetchData();
  }, [authFetch]);

  const toggleFilter = (filter: 'course' | 'lesson') => {
    if (filter === 'course') {
      if (showCourses && !showLessons) {
        return;
      }
      setShowCourses((current) => {
        const next = !current;
        if (!next && !showLessons) {
          return current;
        }
        return next;
      });
    } else {
      if (showLessons && !showCourses) {
        return;
      }
      setShowLessons((current) => {
        const next = !current;
        if (!next && !showCourses) {
          return current;
        }
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex py-0 px-0 sm:py-6 sm:px-6 lg:px-15 ">
            <div className="flex-1 flex flex-col bg-gray-200 dark:bg-gray-800 rounded-0 sm:rounded-2xl overflow-hidden">
        <Header username={user?.profile.full_name || "User"} />

        <main className="flex-1 py-4 sm:py-6 px-4 sm:px-8 lg:px-10 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <h1 className="text-gray-700 dark:text-gray-100 text-xl sm:text-2xl font-medium p-3">Recent Searches</h1>
              <div className="flex gap-2 bg-gray-300 dark:bg-gray-600 p-1 rounded-xl">
              <button
                onClick={() => toggleFilter("course")}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  flex items-center gap-2
                  ${showCourses
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${showCourses ? "bg-blue-500" : "bg-gray-400"}
                  `}
                />
                Courses
              </button>

              <button
                onClick={() => toggleFilter("lesson")}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  flex items-center gap-2
                  ${showLessons
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${showLessons ? "bg-green-500" : "bg-gray-400"}
                  `}
                />
                Lessons
              </button>
            </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-80"/>
            ))
            : <>
              { showCourses && courses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  lessons_number={course.lessons.length}
                  started={course.started}
                />
              ))}
              {showLessons && lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  cardLable={lesson.course}
                  cardCourseName={lesson.name}
                  cardLevel={lesson.level_display}
                  cardLesson={lesson.name}
                  cardQuestionsTotal={lesson.questions_count}
                  cardQuestionsAnswered={lesson.questions_answered}
                  started={lesson.started}
                  width="w-full"
                  height=""
                />
              ))}
            </>
            }
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
