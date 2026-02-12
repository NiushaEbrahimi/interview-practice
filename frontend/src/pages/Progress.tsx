import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";

type statsType = {
  questions_practiced: number,
  accuracy_rate: number,
  days_streak: number,
  courses: number
}

export default function Progress(){

  const { user } = useAuth();
  const authFetch = useAuthFetch();
  const [response,setResponse] = useState<statsType>()

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await authFetch("http://127.0.0.1:8000/api/stats/me/")
        console.log(response)
        setResponse(response)
      }catch(err){
        console.log(err)
      }
    }
    fetchData();
    console.log(response)
  },[])

  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      

      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">

        <Header username={user?.profile.full_name || "User"} />
        
        <main className="grid py-6 px-10 space-y-6 grid-cols-2 gap-2 text-gray-500">
            <div className="border-r-2 flex flex-col gap-4 justify-center items-center">
              <div className="border-b-2 flex flex-col gap-4 w-120 p-4">
                <h3>Questions Practiced: <span className="ml-2 font-bold">{response?.questions_practiced}</span></h3>
                <h3>Avg Confidence: <span className="ml-2 font-bold">{response?.accuracy_rate*100}%</span></h3>
              </div>
              <div className="border-b-2 flex flex-col gap-2 w-120 p-2">
                <h1 className="text-gray-700 text-2xl font-medium mb-2">Progress by Level</h1>
                <h3 className="font-medium">Easy</h3>
                <div className="h-5 rounded bg-gray-400 "><span className="h-5 w-70 bg-green-300 absolute rounded"></span></div>
                <h3 className="font-medium">Hard</h3>
                <div className="h-5 rounded bg-gray-400 "><span className="h-5 w-90 bg-red-400 absolute rounded"></span></div>
                <h3 className="font-medium">Medium</h3>
                <div className="h-5 rounded bg-gray-400 mb-4"><span className="h-5 w-30 bg-yellow-300 absolute rounded"></span></div>
              </div>
              <div className="flex flex-col gap-4 w-120 p-4">
                <h1 className="text-gray-700 text-xl font-medium">Needs Review</h1>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="font-medium"> - Hooks React</h3>
                    <button className="bg-blue-400 px-3 py-1 rounded text-white cursor-pointer">start</button>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="font-medium"> - JavaScript Memmory Leak</h3>
                    <button className="bg-blue-400 px-3 py-1 rounded text-white cursor-pointer">start</button>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="font-medium"> - Next.js Routes</h3>
                    <button className="bg-blue-400 px-3 py-1 rounded text-white cursor-pointer">start</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-120 p-4">
                <h1 className="text-gray-700 text-2xl font-medium">Progress by Topic</h1>
                <h3 className="font-medium">JavaScript</h3>
                <div className="h-5 rounded bg-gray-400 "><span className="h-5 w-70 bg-blue-400 absolute rounded"></span></div>
                <h3 className="font-medium">React</h3>
                <div className="h-5 rounded bg-gray-400 "><span className="h-5 w-90 bg-blue-400 absolute rounded"></span></div>
                <h3 className="font-medium">Database</h3>
                <div className="h-5 rounded bg-gray-400 mb-4"><span className="h-5 w-30 bg-blue-400 absolute rounded"></span></div>
            </div>
        </main>
      </div>
    </div>
  );
};