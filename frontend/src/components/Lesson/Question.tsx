import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Question(){
    
    const [score, setScore] = useState<number | null>(null);
    const navigate = useNavigate();
    const [answerDisplay, setAnswerDisplay] = useState(false);

    return(
        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h6 className="font-medium text-lg">Question:</h6>
                <p>what is JSX and what does it stand for?</p>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col gap-3">
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
            </div>
            <div className="flex">
                <div className="border-gray-400 border-1 rounded-md p-2 shadow">
                    <label className="flex items-center text-sm">
                        <input type="checkbox" name="come-back-again" className="mr-2 mt-1"/>
                        come back again
                    </label>
                </div>
            </div>

        </section>
    )
}