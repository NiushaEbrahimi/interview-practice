import Header from "../components/Header"
import {useNavigate, useParams } from "react-router-dom"
import Dropdown from "../components/Courses/Dropdown";
import BackIcon from "../components/Courses/BackIcon";

// type ContentType = {
//     label : string
// }

export default function Course(){
    const username = "Niusha";
    const paramsURL = useParams();
    const navigate = useNavigate();
    // TODO: get it from api based on the paramsURL
    const lessons = [
        { lessonName : "closures" , level : "Hard" , percent : 50 },
        { lessonName : "closures" , level : "Hard" , percent : 50 }, 
        { lessonName : "closures" , level : "Hard" , percent : 50 },
    ]
    console.log(paramsURL);

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={username}/>
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col`}>
                <section className="flex flex-row text-gray-700 justify-start items-center max-h-10 gap-2">
                    <button 
                        onClick={()=> navigate(-1)}
                        className="cursor-pointer"
                    >
                        <BackIcon/>
                    </button>
                    <h1 className="ms-2 text-2xl font-medium">{paramsURL.label}</h1>
                    <Dropdown></Dropdown>
                    <div className="flex w-100 rounded-2xl overflow-hidden shadow ms-8">
                        <span><input type="search" placeholder="Lesson (e.g. closure )..." name="" id="" className="w-90 rounded-tl-2xl rounded-bl-2xl text-gray-500 bg-white px-4 py-2" /></span>
                        <span><input type="button" value="" className="w-10 bg-blue-300 cursor-pointer px-4 py-2" /></span>
                    </div>
                </section>
                <section className="flex gap-2">
                    {lessons.map((e , index)=>(
                        <div className="text-gray-700 bg-red-300 flex" key={index}>
                            <h1>{e.lessonName}</h1>
                            <h1>{e.level}</h1>
                            <h1>{e.percent}</h1>
                        </div>
                    ))}
                </section>
            </main>
            </div>
        </div>
    )
}