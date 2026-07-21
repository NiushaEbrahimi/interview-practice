import { returnImageSrc } from "../../assets/icons/icons"
import { Link } from "react-router-dom";

export default function LessonCard({cardLable, cardCourseName, cardLevel, cardLesson, cardQuestionsTotal, cardQuestionsAnswered, started, width, height}
    : {cardLable : string, cardCourseName: string, cardLevel: string, cardLesson: string, cardQuestionsTotal: number, cardQuestionsAnswered:number, started: boolean, width:string, height: string}){
    
    const progress_percent = (cardQuestionsAnswered/cardQuestionsTotal)*100;

    return(
        <Link to={`/courses/${cardLable}/${cardLevel}/${cardLesson}`}>
            <div className={`rounded bg-white dark:bg-gray-700 ${width} ${height} text-center text-gray-500 dark:text-gray-400 p-4 shadow cursor-pointer flex flex-col justify-between min-h-[300px]`}>
                <div className="flex justify-center items-center">
                    <img src={returnImageSrc({name: cardLable})} className="rounded max-h-40 mb-3 object-contain"/>
                </div>
                <div className="flex-1 flex items-center justify-center px-1">
                    <h3 className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base leading-tight line-clamp-2">{cardCourseName}</h3>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm mt-2">
                    <h5>{cardLevel}</h5>
                    <p>Q: {cardQuestionsTotal}</p>
                </div>
                {started && (
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600 mt-2 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min(Math.max(progress_percent, 0), 100)}%` }}
                        />
                    </div>
                )}
                <div className="flex justify-center items-center mt-2">
                    {started ?
                        <button className="bg-green-400 py-1 px-3 rounded text-white text-sm">Continue</button>
                    :
                        <button className="bg-blue-400 py-1 px-3 rounded text-white text-sm">Start</button>
                    }
                </div>
            </div>
        </Link>
    )
}