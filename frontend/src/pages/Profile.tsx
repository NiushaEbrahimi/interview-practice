import Header from "../components/Header"
import userProfileIMG from "../assets/user-profile.png"
import positionsCSS from "../assets/css/positionsCSS.module.css"
import CourseCard from "../components/Profile/CourseCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useAuthFetch } from "../hooks/useAuthFetch"
import type { UserProfile, StatsType, ComeBackQuestion } from "../assets/types"
import { EditIcon } from "../components/Icons/EditIcon"
import Skeleton from "../components/Skeleton"
import { usePageTitle } from "../hooks/usePageTitle"

export default function Profile(){
    usePageTitle("Profile");
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<StatsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const authFetch = useAuthFetch()

    useEffect(() => {

        if (!token || !user) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchProfile = async () => {
            try {
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

        const fetchStats = async () => {
            try{
                const statsData = await authFetch(`http://127.0.0.1:8000/api/stats/me/`)
                setStats(statsData)
            }catch(err){
                console.log(`error is : ${err}`)
            }
        }
        
        Promise.all([fetchProfile(), fetchStats()]).finally(() => setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user, navigate, logout]);
    
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
                        <div className="flex gap-4 px-8 flex-wrap">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="!w-50 !h-60" />
                                ))
                            ) : stats?.topics ? (
                                stats.topics.map((topic) => (
                                    <CourseCard 
                                        key={topic.topic}
                                        label={topic.topic} 
                                        courseName={topic.topic} 
                                        level={`${topic.answered}/${topic.total}`} 
                                        percent={topic.percent}
                                    />
                                ))
                            ) : null}
                        </div>
                        <h1 className="text-3xl font-medium p-4">Will Study Later</h1>
                        <div className="flex gap-4 px-8 flex-wrap">
                            {isLoading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <Skeleton key={i} className="!w-50 !h-60" />
                                ))
                            ) : stats?.study_later_lessons && stats.study_later_lessons.length > 0 ? (
                                stats.study_later_lessons.map((lesson) => (
                                    <Link 
                                        key={lesson.id}
                                        to={`/courses/${lesson.course}/${lesson.level_display}/${lesson.name}`}
                                        className="rounded-2xl bg-blue-50 w-50 h-60 text-center text-gray-500 px-4 py-2 shadow cursor-pointer grid grid-rows-4-3-2-1-1 hover:bg-blue-100"
                                    >
                                        <div className="flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600">
                                                {lesson.name.charAt(0)}
                                            </div>
                                        </div>
                                        <span className="flex items-center justify-center"><h3 className="text-gray-700 font-medium mb-2">{lesson.name}</h3></span>
                                        <h5>{lesson.level_display} , {lesson.progress_percent}% </h5>
                                        <p className="text-sm text-gray-400">{lesson.course}</p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-300 px-4">No lessons saved for later</p>
                            )}
                        </div>
                        <div className="bg-white text-black mt-10 mb-10 rounded-2xl" style={{height:"70%"}}>
                            <h1 className="text-3xl font-medium p-4">Go Back to These Questions</h1>
                            <div className="flex gap-4 p-8 flex-col overflow-y-auto overflow-x-hidden" style={{maxHeight:"70%"}}>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="!w-full !h-16" />
                                    ))
                                ) : stats?.come_back_questions && stats.come_back_questions.length > 0 ? (
                                    stats.come_back_questions.map((q: ComeBackQuestion, index: number) => (
                                        <Link 
                                            key={q.id}
                                            to={`/courses/${q.course}/${q.level_display}/${q.lesson}?q=${index}`}
                                            className="bg-gray-100 border-2 border-black rounded-2xl p-4 cursor-pointer hover:bg-gray-300"
                                        >
                                            <p className="font-medium text-gray-700">{q.question}</p>
                                            <p className="text-sm text-gray-500 mt-1">{q.lesson} · {q.level_display}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No questions saved to come back to</p>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}