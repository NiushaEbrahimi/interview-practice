import { useState } from "react";

export default function Question({id, question, answer} : {id: number, question: string, answer: string}){

    const [score, setScore] = useState<number | null>(null);
    const [answerDisplay, setAnswerDisplay] = useState(false);
    const [comeBack, setComeBack] = useState(false);

    const handleRate = (value : number) => {
        setScore(value);
        
        fetch("http://127.0.0.1:8000/api/attempts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: id,
                confidence_rate: value,
                come_back_again: comeBack
            })
        })
        .then(response => {
            if (response.ok) {
                console.log("Confidence rate saved successfully");
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || "Failed to save");
                });
            }
        })
        .then(data => console.log("Response:", data))
        .catch(error => {
            console.error("Error:", error);
        });
    }

    const handleComeBack = (checked: boolean) => {
        setComeBack(checked);
        
        fetch("http://127.0.0.1:8000/api/attempts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: id,
                confidence_rate: score || 3,
                come_back_again: checked
            })
        })
        .then(response => {
            if (response.ok) {
                console.log("Come back flag saved successfully");
            } else {
                console.error("Failed to save come back flag");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    return(
        <section className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h6 className="font-medium text-lg">Question:</h6>
                <p>{question}</p>
            </div>
            <div>
                <h6 className="font-medium text-lg">Answer:</h6>
                <p className={answerDisplay ? "m-4" : " m-4 hidden"}>{answer}</p>
                <button 
                    className="bg-blue-300 rounded shadow p-2 mt-4"
                    onClick={() => setAnswerDisplay(!answerDisplay)}
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
                        onChange={() => handleRate(value)}
                        />
                        {value}
                    </label>
                    ))}
                </div>
            </div>
            <div className="flex">
                <div className="border-gray-400 border-1-css rounded-md p-2 shadow">
                    <label className="flex items-center text-sm">
                        <input 
                            type="checkbox" 
                            name="come-back-again" 
                            className="mr-2 mt-1" 
                            checked={comeBack}
                            onChange={(e) => handleComeBack(e.target.checked)} 
                        />
                        come back again
                    </label>
                </div>
            </div>
        </section>
    )
}