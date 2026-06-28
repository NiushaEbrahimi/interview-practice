import { useEffect, useState } from "react";
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type { StatsType } from "../assets/types";

// TODO: this needs to be fetched from the api:
const recentStudies = [
  {courseName : "JavaScript Closures", level : "Medium" , percent : "50%"},
  {courseName : "SQL Queries", level : "Easy" , percent : "20%"},
]

// TODO: this needs to be fetched from the api:
const recommended = [
  {id : 1, courseName : "JavaScript Closures", level : "Medium" , percent : "50%"},
  {id : 2, courseName : "JavaScript Closures", level : "Medium" , percent : "50%"},
]

export default function Dashboard(){
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  const [stats,setStats] = useState<StatsType[]>();
  
  const formatValue = (key: string, value: number) => {
    if (key === "accuracy_rate") {
      return `${(value * 100).toFixed(1)}%`
    }
    return value
  }

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await authFetch("http://127.0.0.1:8000/api/stats/me/")
        console.log(response)
        setStats(response)
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      

      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">

      <Header username={user?.profile.full_name || "User"} />

        <main className="flex-1 py-6 px-10 space-y-6">
          <h1 className="text-gray-700 text-2xl font-medium">Welcome Back, {user?.profile.full_name}</h1>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {stats && Object.entries(stats).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg shadow p-2 px-3">
                <p className="text-sm text-gray-500">{key.replaceAll("_"," ")}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {formatValue(key, Number(value))}
                </p>
              </div>
            ))}

          </section>

          <section>
            <h1 className="text-gray-700 font-medium">Continue Practicing</h1>
            <div className="grid justify-start align-middle gap-2 py-2">
            {recentStudies.map((item)=>(
              <div
                key={item.courseName}
                className="bg-white rounded-lg shadow p-2 px-3 grid grid-cols-4"
              >
                <span className="text-start text-gray-500">
                  {item.courseName}
                </span>
                <span className="text-center text-gray-800">
                  {item.level}
                </span>
                <span className="text-center text-gray-800">
                  {item.percent}
                </span>
                <span className="grid justify-center align-middle"><button className="bg-green-300 text-white rounded w-20 cursor-pointer">resume</button></span>
              </div>
            ))}
            </div>
          </section>

          <section>
            <h1 className="text-gray-700 font-medium">Explore More</h1>
            <div className="grid justify-start align-middle gap-2 py-2">
            {recommended.map((item)=>(
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-2 px-3 grid grid-cols-4"
              >
                <span className="text-start text-gray-500">
                  {item.courseName}
                </span>
                <span className="text-center text-gray-800">
                  {item.level}
                </span>
                <span className="text-center text-gray-800">
                  {item.percent}
                </span>
                <span className="grid justify-center align-middle"><button className="bg-green-300 text-white rounded w-20 cursor-pointer">resume</button></span>
              </div>
            ))}
            </div>
            <span className="text-center text-gray-700 underline">check out all the Studies </span>
          </section>
        </main>
      </div>
    </div>
  );
};