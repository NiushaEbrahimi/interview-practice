import Header from "../components/Header"
import {useNavigate, useParams } from "react-router-dom"
import Dropdown from "../components/Courses/Dropdown";
import BackIcon from "../components/Courses/BackIcon";
import { useEffect, useState } from "react";

type paramsURLType = {
    label : string,
    level? : string
}

type lessonType = {
    id: number,
    name: string,
    level : number,
    level_display : string,
    questions_count : number,
    course : string
}

export default function Course(){
    const username = "Niusha";

    const [lessons, setLessons] = useState<lessonType[]>([]);

    const paramsURL = useParams<paramsURLType>();
    const navigate = useNavigate();

    useEffect(() => {
        if(paramsURL.level){
            const level = paramsURL.level === "Easy" ? 1 : paramsURL.level === "Medium" ? 2 : 3;
            fetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}&level=${level}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLessons(data);
                }
            )
        }else{
            fetch(`http://127.0.0.1:8000/api/lessons/?course=${paramsURL.label}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLessons(data);
                }
            )
        }
    },[paramsURL])
    // TODO: get it from api based on the paramsURL
    // TODO: i think it has to be like :
    // if there is no level in paramsURL -> get all lessons of that course
    // if there is level in paramsURL -> get lessons of that course with that level


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
                    <Dropdown label={paramsURL.label || "undefined"}/>
                    <div className="flex w-100 rounded-2xl overflow-hidden shadow ms-8">
                        <span><input type="search" placeholder="Lesson (e.g. closure )..." name="" id="" className="w-90 rounded-tl-2xl rounded-bl-2xl text-gray-500 bg-white px-4 py-2" /></span>
                        <span><input type="button" value="" className="w-10 bg-blue-300 cursor-pointer px-4 py-2" /></span>
                    </div>
                </section>
                <section className="grid gap-7 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {lessons && lessons.map((e , index)=>(
                        <div 
                            className="text-gray-700 bg-white grid grid-rows-[3fr_20px] px-2 py-3 rounded-2xl shadow-md gap-3 min-w-45 cursor-pointer" 
                            key={index}
                            onClick={() => navigate(`/courses/${paramsURL.label}/${e.level === 1 ? "Easy" : e.level === 2 ? "Medium" : "Hard"}/${e.name}`)}
                        >
                            <div className="text-center ">
                                <h3 className="text-md font-medium">{e.name}</h3>
                            </div>
                            <div className="flex flex-row text-center ">
                                <p
                                    className={
                                        `text-sm flex-1 
                                        ${e.level_display === "Hard" ? "text-red-600" : ""}
                                        ${e.level_display === "Medium" ? "text-yellow-600" : ""}
                                        ${e.level_display === "Easy" ? "text-green-600" : ""}
                                        `
                                    }
                                >
                                    {e.level_display}
                                </p>
                                <p className="text-sm flex-1">spent: {e.questions_count}%</p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            </div>
        </div>
    )
}