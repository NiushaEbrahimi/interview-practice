import Header from "../components/Header"
import Question from "../components/Lesson/Question";
import css from "../assets/css/svgTransitions.module.css"
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { paramsURLType, QuestionType } from "../assets/types";
import { CheckSVGIcon } from "../components/Icons/CheckSVGIcon";
import { SquareSVGIcon } from "../components/Icons/SquareSVGIcon.tsx";
import type { Lesson } from "../types/types.ts";

export default function Lesson(){
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const splideRef = useRef<any>(null);

    const paramsURL = useParams<paramsURLType>();
    const [searchParams] = useSearchParams();

    const [zoomIn , setZoomIn ] = useState(false);
    const [willStudyLater, setWillStudyLater] = useState(false);
    
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const questionsData = await authFetch(`http://127.0.0.1:8000/api/questions/?lesson=${paramsURL.lesson}`);
                setQuestions(questionsData);

                const slideIndex = searchParams.get('q');
                if (slideIndex && splideRef.current) {
                    setTimeout(() => {
                        splideRef.current?.go(parseInt(slideIndex, 10));
                    }, 100);
                }

            }catch(err){
                console.log(err);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const toggleStudyLater = async () => {
        try{
            setZoomIn((z) => !z);
            // find lesson id by name (limit request to lessons list and find match)
            const lessons = await authFetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}`);
            const lesson = lessons.find((l: Readonly<Lesson>) => l.name === paramsURL.lesson);
            if (!lesson) return;
            const lessonId = lesson.id;

            const payload = {
                lesson: lessonId,
                will_study_later: !willStudyLater,
            };

            await authFetch(`http://127.0.0.1:8000/api/progress/`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setWillStudyLater((s) => !s);
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
                        className={`bg-blue-200 rounded-2xl flex justify-center items-center border-2 border-blue-50 px-3 shadow ${css.svgParent}`}
                        onClick={toggleStudyLater}
                    >
                        <span className="mr-2">Study Later</span>
                        <span>
                            {!willStudyLater ? <SquareSVGIcon zoomIn={zoomIn} /> : <CheckSVGIcon zoomIn={zoomIn}/>} 
                        </span>
                    </button>
                </section>
                <Splide ref={splideRef}>
                {questions && questions.map((question, index) => (
                    <SplideSlide key={index}><Question key={index} id={question.id} question={question.question} answer={question.correct_answer}/></SplideSlide>
                ))}
                </Splide>
            </main>
            </div>
        </div>
    )
}