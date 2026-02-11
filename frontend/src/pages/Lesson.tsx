import { useState, useEffect } from "react";
import Header from "../components/Header"
import Question from "../components/Lesson/Question";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

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

export default function Course(){
    const { user } = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const paramsURL = useParams<paramsURLType>();
    
    useEffect(()=>{
        fetch(`http://127.0.0.1:8000/api/questions/?lesson=${paramsURL.lesson}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setQuestions(data);
            })
        .catch(error => {console.error("Error fetching questions:", error)});
    },[])
    
    console.log(paramsURL);

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={user?.profile.full_name || "User"} />
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col text-gray-900`}>
                <section className="flex items-end">
                    <h3 className="text-5xl">{paramsURL.lesson}</h3>
                    <p className="text-2xl ml-4">{paramsURL.level}</p>
                </section>
                <Splide>
                {questions && questions.map((question, index) => (
                    <SplideSlide><Question key={index} id={question.id} question={question.question} answer={question.correct_answer}/></SplideSlide>
                ))}
                </Splide>
            </main>
            </div>
        </div>
    )
}