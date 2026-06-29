import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Header from "../components/Header";
import LessonCard from "../components/Questions/LessonCard";
import CourseCard from "../components/Questions/CourseCard";
import type { CourseType, LessonType } from "../assets/types";


export default function Questions() {
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [showCourses, setShowCourses] = useState(true);
  const [showLessons, setShowLessons] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
        <Header username={user?.profile.full_name || "User"} />
        
        <main className="flex-1 py-6 px-10 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <section>
            <div className="flex justify-between">
              <h1 className="text-gray-700 text-2xl font-medium p-3">Recent Searches</h1>
              <div className="flex gap-2 bg-gray-300 p-1 rounded-xl">
              <button
                onClick={() => toggleFilter("course")}
                className={`
                  px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  flex items-center gap-2
                  ${showCourses
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
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
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-600 hover:text-gray-900"
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
            <div className="flex flex-wrap justify-center gap-8 p-2">
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
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}