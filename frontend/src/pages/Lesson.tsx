import Header from "../components/Header"
import {useNavigate, useParams } from "react-router-dom"
import { useState } from "react";

type paramsURLType = {
    label? : string,
    level? : string,
    lesson? : string
}

export default function Course(){
    const [score, setScore] = useState<number | null>(null);
    const username = "Niusha";
    const paramsURL = useParams<paramsURLType>();
    const navigate = useNavigate();
    const [answerDisplay, setAnswerDisplay] = useState(false);
    // TODO: get it from api based on the paramsURL
    // TODO: i think it has to be like :
    // if there is no level in paramsURL -> get all lessons of that course
    // if there is level in paramsURL -> get lessons of that course with that level
    
    console.log(paramsURL);

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={username}/>
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col text-gray-900`}>
                <section className="flex items-end">
                    <h3 className="text-5xl">{paramsURL.lesson}</h3>
                    <p className="text-2xl ml-4">{paramsURL.level}</p>
                </section>
                <section className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
                    <span className="flex items-center gap-4">
                        <h6 className="font-medium text-lg">Question:</h6>
                        <p>what is JSX and what does it stand for?</p>
                    </span>
                    <span>
                        <h6 className="font-medium text-lg">Answer:</h6>
                        <p className={answerDisplay ? "m-4" : " m-4 hidden"}>JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like code within your JavaScript code. JSX is commonly used in React to describe the UI structure and appearance of components.</p>
                        <button 
                            className="bg-blue-300 rounded shadow p-2 mt-4"
                            onClick={()=>{
                                if(!answerDisplay){
                                    setAnswerDisplay(true);
                                }
                                else{
                                    setAnswerDisplay(false);
                                }
                            }}
                        >
                            {answerDisplay ? "Hide Answer" : "Reveal Answer"}
                        </button>
                    </span>
                    <span className="flex flex-col gap-3">
                        <p>How close was your answer?</p>

                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value} className="flex items-center gap-1 cursor-pointer">
                                <input
                                type="radio"
                                name="answerScore"
                                value={value}
                                checked={score === value}
                                onChange={() => setScore(value)}
                                />
                                {value}
                            </label>
                            ))}
                        </div>
                    </span>

                </section>
            </main>
            </div>
        </div>
    )
}