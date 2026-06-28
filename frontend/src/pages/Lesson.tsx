import Header from "../components/Header"
import Question from "../components/Lesson/Question";
import css from "../assets/css/svgTransitions.module.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { paramsURLType, QuestionType } from "../assets/types";
import { CheckSVGIcon } from "../components/Icons/CheckSVGIcon";
import { SquareSVGIcon } from "../components/Icons/SquareSVGIcon.tsx";

export default function Lesson(){
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const paramsURL = useParams<paramsURLType>();

    const [zoomIn , setZoomIn ] = useState(false);
    const [square, setSquare] = useState(true);
    
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const questionsData = await authFetch(`http://127.0.0.1:8000/api/questions/?lesson=${paramsURL.lesson}`);
                setQuestions(questionsData);
                
                const newRes = await authFetch(`http://127.0.0.1:8000/api/lessons/`)
                console.log(`new REs : ${newRes} params URL : ${paramsURL}`)
                const lessonId = newRes.find((lesson: { name: string | undefined; }) => lesson.name === paramsURL.lesson).id;
                const responseStudyLater = await authFetch(`http://127.0.0.1:8000/api/progress/`, {
                    method: "POST",
                    body: JSON.stringify({
                        lesson: lessonId,
                        will_study_later: !square,
                        
                    })
                });
                console.log(responseStudyLater)
                

            }catch(err){
                console.log(err);
            }
        };
        fetchData();
        console.log(questions);
    },[])

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={user?.profile.full_name || "User"} />
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col text-gray-900`}>
                <section className="flex justify-between">
                    <div className="flex items-end">
                        <h3 className="text-5xl">{paramsURL.lesson}</h3>
                        <p className="text-2xl ml-4">{paramsURL.level}</p>
                    </div>
                    <button 
                        className={`bg-blue-200 rounded-2xl flex justify-center items-center border-2 border-blue-50 px-3 shadow ${css.svgParent}`}
                        onClick={()=>{ 
                            setZoomIn(!zoomIn);
                            setTimeout(() => {
                                setSquare(prev => !prev);
                            }, 300);
                        }}
                    >
                        <span>Study Later</span>
                        <span>
                            {square ? <SquareSVGIcon zoomIn={zoomIn} />
                            : <CheckSVGIcon zoomIn={zoomIn}/>}
                        </span>
                    </button>
                </section>
                <Splide>
                {questions && questions.map((question, index) => (
                    <SplideSlide key={index}><Question key={index} id={question.id} question={question.question} answer={question.correct_answer}/></SplideSlide>
                ))}
                </Splide>
            </main>
            </div>
        </div>
    )
}