import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import Header from "../components/Header";
import LessonCard from "../components/Questions/LessonCard";
import CourseCard from "../components/Questions/CourseCard";

type CardType = {
  id: number;
  name: string;
  course: string;
  level: number;
  level_display: string;
  questions_count: number;
}

type CourseType = {
  id: number;
  lessons: Array<CardType>;
  title: string;
  started: boolean;
}

export default function Questions() {
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [lessons, setLessons] = useState<CardType[]>([]);
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

  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-6">
      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
        <Header username={user?.profile.full_name || "User"} />
        
        <main className="flex-1 py-6 px-10 space-y-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <section>
            <h1 className="text-gray-700 text-2xl font-medium p-3">Recent Searches</h1>
            <div className="flex flex-wrap justify-center gap-8 p-2">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  title={course.title} 
                  lessons_number={course.lessons.length} 
                  started={course.started}
                />
              ))}
              {lessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id} 
                  cardLable={lesson.course} 
                  cardCourseName={lesson.name} 
                  cardLevel={lesson.level_display} 
                  cardLesson={lesson.name} 
                  cardQuestions={lesson.questions_count}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}