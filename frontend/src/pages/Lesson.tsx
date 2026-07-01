import Header from "../components/Header"
import Question from "../components/Lesson/Question";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { paramsURLType, QuestionType } from "../assets/types";
import { CheckSVGIcon } from "../components/Icons/CheckSVGIcon";
import { SquareSVGIcon } from "../components/Icons/SquareSVGIcon.tsx";
import type { Lesson } from "../types/types.ts";
import Skeleton from "../components/Skeleton";

export default function Lesson(){
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const splideRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lessonId, setLessonId] = useState<number | null>(null);
    const [progressId, setProgressId] = useState<number | null>(null);

    const paramsURL = useParams<paramsURLType>();
    const [searchParams] = useSearchParams();

    const [willStudyLater, setWillStudyLater] = useState(false);
    
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const questionsData = await authFetch(`http://127.0.0.1:8000/api/questions/?lesson=${paramsURL.lesson}`);
                setQuestions(questionsData);

                // Get lesson info and existing progress
                const lessons = await authFetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}`);
                const lesson = lessons.find((l: Readonly<Lesson>) => l.name === paramsURL.lesson);
                if (lesson) {
                    setLessonId(lesson.id);
                    
                    // Check if progress record exists
                    const progressList = await authFetch(`http://127.0.0.1:8000/api/progress/?lesson=${lesson.id}`);
                    if (progressList.length > 0) {
                        setProgressId(progressList[0].id);
                        setWillStudyLater(progressList[0].will_study_later);
                    }
                }

                const slideIndex = searchParams.get('q');
                if (slideIndex && splideRef.current) {
                    setTimeout(() => {
                        splideRef.current?.go(parseInt(slideIndex, 10));
                    }, 100);
                }

            }catch(err){
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const toggleStudyLater = async () => {
        try{
            if (!lessonId) return;

            const newValue = !willStudyLater;
            const payload = {
                lesson: lessonId,
                will_study_later: newValue,
            };

            if (progressId) {
                // Update existing record
                await authFetch(`http://127.0.0.1:8000/api/progress/${progressId}/`, {
                    method: "PATCH",
                    body: JSON.stringify({ will_study_later: newValue }),
                });
            } else {
                // Create new record
                const result = await authFetch(`http://127.0.0.1:8000/api/progress/`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                if (result?.id) {
                    setProgressId(result.id);
                }
            }

            setWillStudyLater(newValue);
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={user?.profile.full_name || "User"} />
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col text-gray-900`}>
                <section className="flex justify-between">
                    <div className="flex items-end">
                        <h3 className="text-3xl text-md-5xl">{paramsURL.lesson}</h3>
                        <p className="text-xl text-md-2xl ml-2 ml-md-4">{paramsURL.level}</p>
                    </div>
                    <button 
                        className="bg-blue-200 rounded-2xl flex justify-center h-10 w-auto items-center border-2 border-blue-50 px-3 shadow gap-2"
                        onClick={toggleStudyLater}
                    >
                        <span>Study Later</span>
                        <span className="relative flex items-center justify-center" style={{width: 24, height: 24}}>
                            <span className="absolute"><SquareSVGIcon isVisible={!willStudyLater} /></span>
                            <span className="absolute"><CheckSVGIcon isVisible={willStudyLater} /></span>
                        </span>
                    </button>
                </section>
                {isLoading ? (
                    <Skeleton className="!w-full !h-96" />
                ) : (
                    <Splide ref={splideRef}>
                    {questions && questions.map((question, index) => (
                        <SplideSlide key={index}><Question key={index} id={question.id} question={question.question} answer={question.correct_answer}/></SplideSlide>
                    ))}
                    </Splide>
                )}
            </main>
            </div>
        </div>
    )
}