import { returnImageSrc } from "../../assets/icons/icons"
import { Link } from "react-router-dom"

export default function CourseCard(
    {title, lessons_number, started} : 
    {title: string, lessons_number: number, started: boolean}
    ){
    return(
        <Link to={`/courses/${title}`}>
            <div className="rounded bg-white w-50 h-80 text-center text-gray-500 p-4 shadow cursor-pointer grid grid-rows-4-3-2-1-1">
                <div className="flex justify-center items-center" style={{width : "100%"}}>
                    <img src={returnImageSrc({name: title})} className="rounded max-h-40 min-h-40 mb-3"/>
                </div>
                <span className="flex items-center justify-center"><h3 className="text-gray-700 font-medium min-h-12 mb-2">{title}</h3></span>
                <span className="flex flex-col justify-between">
                    <span className="flex flex-row justify-between"><p>Lessons:</p><p>{lessons_number}</p></span>
                </span>
                {started ? 
                <button className="bg-green-400 py-1 px-3 rounded text-white mt-2">Continue</button>
                : <button className="bg-blue-400 py-1 px-3 rounded text-white mt-2">Start</button>}
            </div>
        </Link>
    )
}