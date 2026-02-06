import { useEffect, useState } from "react";
import Header from "../components/Header";
import LessonCard from "../components/Questions/LessonCard"
import CourseCard from "../components/Questions/CourseCard";

// this needs to be fetched from the api 
// const cards = [
//     {lable : "JavaScript" , courseName: "JavaScript Scoping and Promises" , level : "Hard" , lessons : "22" , Questions : "167"},
//     {lable : "React" , courseName : "React Hooks" ,  level : "medium" , lessons : "12" , Questions : "87"},
// ]

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
            <div className="flex w-100 rounded-2xl overflow-hidden shadow">
                <span><input type="search" placeholder="Search your Course of Choice..." name="" id="" className="w-90 rounded-tl-2xl rounded-bl-2xl text-gray-500 bg-white px-4 py-2" /></span>
                <span><input type="button" value="" className="w-10 bg-blue-300 cursor-pointer px-4 py-2" /></span>
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

