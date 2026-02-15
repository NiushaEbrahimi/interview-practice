import { returnImageSrc } from "../../assets/icons/icons"
import { Link } from "react-router-dom";

export default function LessonCard({cardLable, cardCourseName, cardLevel, cardLesson, cardQuestions, started} 
    : {cardLable : string, cardCourseName: string, cardLevel: string, cardLesson: string, cardQuestions: number, started: boolean}){
    const notShow = false;
    return(
        <Link to={`/courses/${cardLable}/${cardLevel}/${cardLesson}`}>
            <div className="rounded bg-white w-50 h-80 text-center text-gray-500 p-4 shadow cursor-pointer grid grid-rows-4-2-1-1">
                <div className="flex justify-center items-center" style={{width : "100%"}}>
                    <img src={returnImageSrc({name: cardLable})} className="rounded max-h-40 mb-3"/>
                </div>
                <span className="flex items-center justify-center"><h3 className="text-gray-700 font-medium min-h-12 mb-2">{cardCourseName}</h3></span>
                <div className="flex justify-between">
                    <h5>{cardLevel}</h5>
                    <p>Questions: {cardQuestions}</p>
                </div>
                {started ? 
                <button className="bg-green-400 py-1 px-3 rounded text-white mt-2">Continue</button>
                : <button className="bg-blue-400 py-1 px-3 rounded text-white mt-2">Start</button>}
            </div>
        </Link>
    )
}