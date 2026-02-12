import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useParams } from "react-router-dom";

type responseType = {
    answered_at: string;
    come_back_again: boolean;
    confidence_rate: number;
    id: number;
    question: number;
    user : number;
}

export default function Question({id, question, answer} : {id: number, question: string, answer: string}){
    const paramsURL = useParams()
    const authFetch = useAuthFetch();

    const [score, setScore] = useState<number | null>(null);
    const [answerDisplay, setAnswerDisplay] = useState(false);
    const [comeBack, setComeBack] = useState(false);
    const [allResponses,setAllResponses] = useState<responseType[]>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authFetch(
                    `http://127.0.0.1:8000/api/attempts/?lesson=${paramsURL.lesson}&question=${id}`
                );

                setAllResponses(response);

                const last = response?.[0];
                setScore(last?.confidence_rate ?? null);
                setComeBack(last?.come_back_again ?? false);

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleRate = async (value : number) => {
        setScore(value);
        try{
            const response = authFetch("http://127.0.0.1:8000/api/attempts/", {
                method: "POST",
                body: JSON.stringify({
                    question: id,
                    confidence_rate: value,
                    come_back_again: comeBack
                })
            })
            console.log(response)
        }catch(err){
            console.log(`The error is ${err}`)
        }
    }

    const handleComeBack = async (checked: boolean) => {
        setComeBack(checked);
        try{
            const response =authFetch("http://127.0.0.1:8000/api/attempts/", {
                method: "POST",
                body: JSON.stringify({
                    question: id,
                    confidence_rate: score || 3,
                    come_back_again: checked
                })
            })
            console.log(response)
        } catch(err){
            console.log(`The error is ${err}`)
        }
    }

    return(
        <section className="bg-white px-20 p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h6 className="font-medium text-lg">Question:</h6>
                <p>{question}</p>
            </div>
            <div>
                <h6 className="font-medium text-lg">Answer:</h6>
                <p className={answerDisplay ? "m-4" : " m-4 hidden"}>{answer}</p>
                <button 
                    className="rounded shadow p-2 mt-4"
                    style={{backgroundColor:"#00bfff",color:"white"}}
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
                        name={`answerScore-${id}`}
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
                            name={`comeBack-${id}`}
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