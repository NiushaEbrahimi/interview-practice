import Header from "../components/Header"
import userProfileIMG from "../assets/user-profile.png"

import positionsCSS from "../assets/css/positionsCSS.module.css"

import CourseCard from "../components/Profile/CourseCard"

function EditIcon(){
    return(
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.125 19.588
            3 21l1.412-4.125L16.862 3.487z"
        />
        </svg>

    )
}

type UserInfos = {
  Email: string;
  Interest: string;
  Techs : string,
};

type Course = {
  label: string;
  courseName: string;
  level: "Easy" | "Medium" | "Hard";
  percent: number;
};


export default function Profile(){

    const username = "Niush"

    // this needs to be fetched from the api:
    const userInfos : UserInfos = {
        Email : "n.ebra@gmail.com",
        Interest : "Frontend Development",
        Techs : "JavaScript HTML CSS"
    }
    
    // this needs to be fetched from the api:
    const courses :  Course[] = [
        {label : "JavaScript", courseName : "JavaScript Closures", level : "Medium" , percent : 50},
        {label : "Django" ,courseName : "SQL Queries", level : "Easy" , percent : 20},
    ]

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
            <Header username={username}/>
    
            <main className={`flex-1 py-6 px-10 space-y-6 flex flex-row gap-4 ${positionsCSS.mainHeight}`}>
                <section className=" flex-1 m-0 justify-center bg-gray-300 rounded-2xl shadow py-2">
                    <div className="flex justify-center items-center flex-col gap-4">
                        <div className="relative">
                            <img src={userProfileIMG} className="rounded-full"/>
                            <button className={`flex items-center gap-2 border-2 px-3 py-1 rounded-2xl text-gray-600 hover:border-transparent hover:bg-gray-600 hover:text-white cursor-pointer active:bg-gray-700 ${positionsCSS.editButton}`}>
                                <EditIcon />edit
                            </button>
                        </div>
                        
                        <div className="flex gap-4 flex-col my-2">
                            <h1 className="text-center text-gray-700 text-3xl font-medium">{username}</h1>
                            {Object.entries(userInfos).map(([key,value])=>(
                                <p className="text-gray-700">{key} : {value}</p>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="flex-2 bg-gray-500 rounded-2xl shadow py-2 px-4 overflow-y-scroll">
                    <h1 className="text-3xl font-medium p-4">Courses</h1>
                    <div className="flex gap-4 px-8">
                        {courses && courses.map((e)=>(
                            <CourseCard label={e.label} courseName={e.courseName} level={e.level} percent={e.percent}/>
                        ))}
                    </div>
                    <h1 className="text-3xl font-medium p-4">Will Study Later</h1>
                    <div className="flex gap-4 px-8">
                        {courses &&courses.map((e)=>(
                            <CourseCard label={e.label} courseName={e.courseName} level={e.level} percent={e.percent}/>
                        ))}
                    </div>
                </section>
            </main>
            </div>
        </div>
    )
}