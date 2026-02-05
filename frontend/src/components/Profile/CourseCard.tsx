import { Link } from "react-router-dom"
import { imageMap } from "../../assets/icons/icons"

export default function CourseCard(
    {label,courseName,level,percent}: {label : string , courseName: string , level : string , percent : number}
){
    return(
        <Link to={`/courses/${label}`}>
            <div className="rounded-2xl bg-blue-50 w-50 h-60 text-center text-gray-500 px-4 py-2 shadow cursor-pointer grid grid-rows-4-3-2-1-1">
                <div className="flex justify-center"><img src={imageMap[label]} className="rounded max-h-30 mb-3"/></div>
                <span className="flex items-center justify-center"><h3 className="text-gray-700 font-medium mb-2">{courseName}</h3></span>
                <h5>{level} , {percent}% </h5>
                <button className="bg-blue-400 py-1 px-3 rounded text-white mt-2">start</button>
            </div>
        </Link>
    )
}



