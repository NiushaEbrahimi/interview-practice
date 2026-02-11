import Header from "../components/Header"
import userProfileIMG from "../assets/user-profile.png"
import positionsCSS from "../assets/css/positionsCSS.module.css"
import CourseCard from "../components/Profile/CourseCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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

type UserProfile = {
    created_at: string;
    email: string;
    id: number;
    is_active: boolean;
    is_verified: boolean;
    profile: {
        experience_level: "junior" | 'beginner' | 'mid-level' | 'senior';
        full_name: string;
        known_technologies: string;
        learning_technologies: string;
        known_technologies_list: string[];
        learning_technologies_list: string[];
    }
}

type Course = {
  label: string;
  courseName: string;
  level: "Easy" | "Medium" | "Hard";
  percent: number;
};

export default function Profile(){
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
                console.log('Profile response:', response.data);
                setUserProfile(response.data);
                
            } catch (err: any) {
                console.error('Fetch profile error:', err);
                
                if (err.response?.status === 401) {
                    logout();
                }
            }
        };
        
        fetchProfile();
    }, [token, user, navigate, logout]);
    
    const courses: Course[] = [
        {label: "JavaScript", courseName: "JavaScript Closures", level: "Medium", percent: 50},
        {label: "Django", courseName: "SQL Queries", level: "Easy", percent: 20},
    ]
    
    const username = userProfile?.profile.full_name || user?.profile?.full_name || "User";
    
    if (!userProfile && (!user || !token)) {
        return <div>Loading...</div>;
    }

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
                                <p className="text-gray-700">Email: {userProfile?.email || user?.email}</p>
                                <p className="text-gray-700">Experience Level: {userProfile?.profile.experience_level || user?.profile?.experience_level}</p>
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
                    </section>
                </main>
            </div>
        </div>
    )
}