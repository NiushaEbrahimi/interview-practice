import Header from "../components/Header"
import Question from "../components/Lesson/Question";

import css from "../assets/css/svgTransitions.module.css"

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";

import { Splide, SplideSlide } from '@splidejs/react-splide';

type paramsURLType = {
    label? : string,
    level? : string,
    lesson? : string
}

type QuestionType = {
    id: number,
    question: string,
    correct_answer: string,
    lesson: number
}

const CheckSVGIcon = ({zoomIn} : {zoomIn: boolean}) => {
    return (
        <svg
            className={`ms-2 ${!zoomIn ? css.zoomIn : "" }`}
            xmlns="http://www.w3.org/2000/svg" 
            width="26" 
            height="40" 
            fill="currentColor" 
            viewBox="0 0 16 16"
        >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
        </svg>
    )
}

const SquareSVGIcon = ({zoomIn} : {zoomIn: boolean}) => {
    return (
        <svg 
            className={`ms-2 ${zoomIn ? css.zoomIn : "" }`}
            xmlns="http://www.w3.org/2000/svg" 
            width="15" 
            height="20" 
            fill="currentColor" 
            viewBox="0 0 16 16"
        >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        </svg>
    )
}

export default function Course(){
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const paramsURL = useParams<paramsURLType>();

    const [zoomIn , setZoomIn ] = useState(false);
    const [square, setSquare] = useState(true);
    
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                console.log(paramsURL)
                const questionsData = await authFetch(`http://127.0.0.1:8000/api/questions/?lesson=${paramsURL.lesson}`);
                setQuestions(questionsData);

                const responseStudyLater = await authFetch(`http://127.0.0.1:8000/api/progress/`, {
                    method: "POST",
                    body: JSON.stringify({
                        // user: user?.id,
                        lesson: paramsURL.lesson,
                        will_study_later: !square,
                        
                    })
                });
                console.log(responseStudyLater);

            }catch(err){
                console.log(err);
            }
        };
        fetchData();
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