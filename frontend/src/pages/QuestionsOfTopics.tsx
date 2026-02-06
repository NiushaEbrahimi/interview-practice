import { useEffect, useState } from "react";
import Header from "../components/Header";
import LessonCard from "../components/Questions/LessonCard"
import CourseCard from "../components/Questions/CourseCard";
import path from "path/win32";

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
  title:string;
  started: boolean;
}

export default function Questions() {
  const username = "Niush";
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [lessons, setLessons] = useState<CardType[]>([]);

  useEffect(() => {

    fetch('http://127.0.0.1:8000/api/lessons/', { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Fetched lessons:", data);
        setLessons(data);
      })
      .catch((error) => {
        console.error('Error fetching lessons:', error);
      });

    fetch('http://127.0.0.1:8000/api/courses/', { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched courses:", data);
        setCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      

      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">

        <Header username={username}/>
        
        <main className="flex-1 py-6 px-10 space-y-2">

          <section className="vw-100 flex justify-center align-middle">
            <div className="flex w-100 rounded-2xl overflow-hidden shadow border-gray-400 border-2">
                <span><input type="search" placeholder="Search your Course of Choice..." name="" id="" className="w-90 rounded-tl-2xl rounded-bl-2xl text-gray-500 bg-white px-4 py-2" /></span>
                <span>
                  <button className="w-10 bg-white cursor-pointer p-2 ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/>
                    </svg>
                  </button>
                </span>
            </div>
          </section>

          <section className="flex flex-wrap flex-row gap-10 px-20 justify-center">
            <button className="bg-blue-300 px-4 py-2 rounded cursor-pointer active:bg-blue-500 focus:bg-blue-500 hover:bg-blue-500">course</button>
            <button className="bg-purple-300 px-4 py-2 rounded cursor-pointer active:bg-purple-500 focus:bg-purple-500 hover:bg-purple-500">lesson</button>
            <button className="bg-red-300 px-4 py-2 rounded cursor-pointer active:bg-red-500 focus:bg-red-500 hover:bg-red-500">hard</button>
            <button className="bg-yellow-300 px-4 py-2 rounded cursor-pointer active:bg-yellow-500 focus:bg-yellow-500 hover:bg-yellow-500">medium</button>
            <button className="bg-green-300 px-4 py-2 rounded cursor-pointer active:bg-green-500 focus:bg-green-500 hover:bg-green-500">easy</button>
          </section>

          <section>
            <h1 className="text-gray-700 text-2xl font-medium p-3">Recent Searches</h1>
            <div className="overflow-y-scroll overflow-x-hidden h-100 flex flex-wrap justify-center gap-8 p-2">
                {courses && courses.map((course)=>(
                  <CourseCard key={course.id} title={course.title} lessons_number={course.lessons.length} started={course.started}/>
                ))}
                {lessons && lessons.map((lesson)=>(
                  <LessonCard key={lesson.id} cardLable={lesson.course} cardCourseName={lesson.name} cardLevel={lesson.level_display} cardLesson={lesson.name} cardQuestions={lesson.questions_count}/>
                ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

