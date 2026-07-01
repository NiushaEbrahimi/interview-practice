import Header from "../components/Header"
import { useParams } from "react-router-dom"
import Dropdown from "../components/Courses/Dropdown";
import BackIcon from "../components/Icons/BackIcon";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type { LessonType, paramsURLType } from "../assets/types";
import Skeleton from "../components/Skeleton";
import LessonCard from "../components/Questions/LessonCard";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Course(){
    const { user } = useAuth();
    const authFetch = useAuthFetch();
    
    const [lessons, setLessons] = useState<LessonType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const paramsURL = useParams<paramsURLType>();
    const navigate = useNavigate();

    usePageTitle(paramsURL.label ?? "Course");

    useEffect(() => {
        const fetchData = async ()=> {
            try{
                if(paramsURL.level){
                    const level = paramsURL.level === "Easy" ? 1 : paramsURL.level === "Medium" ? 2 : 3;
                    const lessonsData = await authFetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}&level=${level}`)
                    setLessons(lessonsData)
                }else{
                    const lessonsData = await authFetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}`)
                    setLessons(lessonsData)
                }
            }catch(err){
                console.log(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[paramsURL])


    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={user?.profile.full_name || "User"} />
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col`}>
                <section className="flex flex-row text-gray-700 justify-start items-center max-h-10 gap-2">
                    <button 
                        onClick={()=> navigate(-1)}
                        className="cursor-pointer"
                    >
                        <BackIcon/>
                    </button>
                    <h1 className="ms-2 text-2xl font-medium">{paramsURL.label}</h1>
                    <Dropdown label={paramsURL.label || "undefined"}/>
                    <div className="flex w-100 rounded-2xl overflow-hidden shadow ms-8">
                        <span><input type="search" placeholder="Lesson (e.g. closure )..." name="" id="" className="w-90 rounded-tl-2xl rounded-bl-2xl text-gray-500 bg-white px-4 py-2" /></span>
                        <span><input type="button" value="" className="w-10 bg-blue-300 cursor-pointer px-4 py-2" /></span>
                    </div>
                </section>
                <section className="grid gap-7 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="!w-full !h-60" />
                        ))
                    ) : lessons && lessons.map((e) => (
                        <LessonCard
                            key={e.id}
                            cardLable={paramsURL.label || ""}
                            cardCourseName={e.name}
                            cardLevel={e.level_display}
                            cardLesson={e.name}
                            cardQuestionsTotal={e.questions_count}
                            cardQuestionsAnswered={e.questions_answered}
                            started={e.started}
                            width="w-full"
                            height=""
                        />
                    ))}
                </section>
            </main>
            </div>
        </div>
    )
}