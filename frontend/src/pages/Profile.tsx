import Header from "../components/Header"
import userProfileIMG from "../assets/user-profile.png"
import positionsCSS from "../assets/css/positionsCSS.module.css"
import CourseCard from "../components/Profile/CourseCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useAuthFetch } from "../hooks/useAuthFetch"
import type { UserProfile, Course, StudyLater } from "../assets/types"
import { EditIcon } from "../components/Icons/EditIcon"

export default function Profile(){
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [studyLaterQuestions, setStudyLaterQuestions] = useState<StudyLater[]>()

    const authFetch = useAuthFetch()

    useEffect(() => {

        if (!token || !user) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
                // TODO: get this with useAuthFetch in the hooks
                const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUserProfile(response.data);
                
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Fetch profile error:', err);
                
                if (err.response?.status === 401) {
                    logout();
                }
            }
        };

        const fetchStudyLater = async () => {
            try{
                const studyLaterData = await authFetch(`http://127.0.0.1:8000/api/attempts/?come_back_again=true`)
                setStudyLaterQuestions(studyLaterData)
            }catch(err){
                console.log(`error is : ${err}`)
            }
        }
        
        fetchProfile();
        fetchStudyLater();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user, navigate, logout]);
    
    const courses: Course[] = [
        {label: "JavaScript", courseName: "JavaScript Closures", level: "Medium", percent: 50},
        {label: "Django", courseName: "SQL Queries", level: "Easy", percent: 20},
    ]
    
    const username = userProfile?.profile.full_name || user?.profile?.full_name || "User";
    const userExp : string = String(userProfile?.profile.experience_level) || String(user?.profile?.experience_level)
    
    if (!userProfile && (!user || !token)) {
        return <div>Loading...</div>;
    }

    return(
        <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
            <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
                <Header username={username}/>
                <main className={`flex-1 py-6 px-10 space-y-6 flex flex-col lg:flex-row gap-4 ${positionsCSS.mainHeight}`}>
                    <section className=" flex-1 m-0 justify-center bg-gray-300 rounded-2xl shadow py-2">
                        <div className="flex lg:justify-center px-6 lg:px-0 items-center flex-row lg:flex-col gap-10 lg:gap-4">
                            <div className="relative">
                                <img
                                src={userProfileIMG}
                                className="rounded-full object-cover w-40 h-40 lg:w-full lg:h-full"
                                />
                                <button className={`flex items-center gap-2 border-2 px-3 py-1 rounded-2xl text-gray-600 hover:border-transparent hover:bg-gray-600 hover:text-white cursor-pointer active:bg-gray-700 ${positionsCSS.editButton}`}>
                                    <EditIcon />edit
                                </button>
                            </div>
                            <div className="flex gap-4 flex-col my-2">
                                <h1 className="text-gray-700 lg:text-3xl font-medium">{username}</h1>
                                <p className="text-gray-700">Email: {userProfile?.email || user?.email}</p>
                                <p className="text-gray-700">Experience Level:  {userExp.replace(userExp.charAt(0),userExp.charAt(0).toUpperCase()) }</p>
                                <div>
                                <button className="bg-red-500 py-2 px-3 rounded-2xl hover:bg-red-600 cursor-pointer" onClick={()=>{logout()}}>Log Out</button>
                                </div>
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
                            {courses && courses.map((e)=>(
                                <CourseCard label={e.label} courseName={e.courseName} level={e.level} percent={e.percent}/>
                            ))}
                        </div>
                        <div className="bg-white text-black mt-10 mb-10 rounded-2xl" style={{height:"70%"}}>
                            <h1 className="text-3xl font-medium p-4">Will Study Later questions</h1>
                            <div className="flex gap-4 p-8 flex-col overflow-y-auto overflow-x-hidden" style={{maxHeight:"70%"}}>
                                {studyLaterQuestions && studyLaterQuestions.map((e)=>(
                                    <div className=" bg-gray-100 border-2 border-black rounded-2xl p-2 cursor-pointer hover:bg-gray-300">
                                        <p>{e.question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}