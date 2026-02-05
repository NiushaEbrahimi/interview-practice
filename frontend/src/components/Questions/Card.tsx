import { imageMap } from "../../assets/icons/icons"
import { Link } from "react-router-dom";

export default function Card({cardLable, cardCourseName, cardLevel, cardLesson, cardQuestions} 
    : {cardLable : string, cardCourseName: string, cardLevel: string, cardLesson: string, cardQuestions: string}){
    const notShow = false;
    return(
        <Link to={`/courses/${cardLable}`}>
            <div className="rounded bg-blue-50 w-50 h-80 text-center text-gray-500 p-4 shadow cursor-pointer grid grid-rows-4-3-2-1-1">
                <img src={imageMap[cardLable]} className="rounded max-h-40 mb-3"/>
                <span className="flex items-center justify-center"><h3 className="text-gray-700 font-medium min-h-12 mb-2">{cardCourseName}</h3></span>
                <h5>{cardLevel}</h5>
                {notShow ? <span className="flex flex-col justify-between">
                    <span className="flex flex-row justify-between"><p>Questions:</p><p>{cardQuestions}</p></span>
                    <span className="flex flex-row justify-between"><p>Lessons:</p><p>{cardLesson}</p></span>
                </span> : <span></span>}
                {/* TODO: if already started should be continue */}
                <button className="bg-blue-400 py-1 px-3 rounded text-white mt-2">start</button>
            </div>
        </Link>
    )
}