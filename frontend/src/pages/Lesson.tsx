import Header from "../components/Header"
import Question from "../components/Lesson/Question";
import { useParams } from "react-router-dom";

type paramsURLType = {
    label? : string,
    level? : string,
    lesson? : string
}

export default function Course(){
    
    const username = "Niusha";
    const paramsURL = useParams<paramsURLType>();
    
    // TODO: get it from api based on the paramsURL
    // TODO: i think it has to be like :
    // if there is no level in paramsURL -> get all lessons of that course
    // if there is level in paramsURL -> get lessons of that course with that level
    
    console.log(paramsURL);

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={username}/>
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col text-gray-900`}>
                <section className="flex items-end">
                    <h3 className="text-5xl">{paramsURL.lesson}</h3>
                    <p className="text-2xl ml-4">{paramsURL.level}</p>
                </section>
                
            </main>
            </div>
        </div>
    )
}