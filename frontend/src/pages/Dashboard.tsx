import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type { StatsType } from "../assets/types";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "../types/types";
import LessonCard from "../components/Questions/LessonCard";

type DashboardProgressItem = {
  id: number;
  lesson: number;
  lesson_name: string;
  lesson_level_display: "Easy" | "Medium" | "Hard";
  course_title: string;
  progress_percent: number;
  will_study_later: boolean;
  started_at: string;
  completed_at: string | null;
};

export default function Dashboard(){
  const { user } = useAuth();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [ stats , setStats ] = useState<StatsType | null>(null);
  const [ lessons , setLessons ] = useState<Lesson[]>([]);
  const [ progressItems , setProgressItems ] = useState<DashboardProgressItem[]>([]);

  const formatValue = (key: string, value: number) => {
    console.log(value)
    if (key === "accuracy_rate") {
      return `${(value/5 * 100).toFixed(1)}%`
    }
    return value
  }

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const [statsResponse, progressResponse, lessonsData ] = await Promise.all([
          authFetch("http://127.0.0.1:8000/api/stats/me/"),
          authFetch("http://127.0.0.1:8000/api/progress/"),
          authFetch('http://127.0.0.1:8000/api/lessons/'),
        ]);

        setStats(statsResponse);
        setProgressItems(Array.isArray(progressResponse) ? progressResponse : []);
        setLessons(lessonsData)
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const continuePracticing = useMemo(() => {
    return [...progressItems]
      .filter((item) => item.progress_percent < 100)
      .sort((a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      )
      .slice(0, 3);
  }, [progressItems]);

  const exploreMore = useMemo(() => {
    return [...lessons]
      .filter((lesson) => {
        for(const item of progressItems){
          return lesson.name!==item.lesson_name
        }
      })
      .slice(0, 2);
  }, [lessons, progressItems]);

  console.log(progressItems)

  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
      <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
        <Header username={user?.profile.full_name || "User"} />

        <main className="flex-1 py-6 px-10 space-y-6">
          <h1 className="text-gray-700 text-2xl font-medium">Welcome Back, {user?.profile.full_name}</h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats && Object.entries(stats).map(([key, value]) => {
              if (key === "levels" || key === "topics") return null;

              return (
                <div key={key} className="bg-white rounded-3xl shadow-sm p-5">
                  <p className="text-sm text-gray-500">{key.replaceAll("_", " ")}</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">
                    {formatValue(key, Number(value))}
                  </p>
                </div>
              );
            })}
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
            <section className="flex-1 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-gray-700 text-xl font-semibold mb-4">Continue Practicing</h2>
              <div className="space-y-4">
                {continuePracticing.length ? (
                  continuePracticing.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-gray-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{item.lesson_name}</p>
                          <p className="text-sm text-gray-500">
                            {item.course_title} · {item.lesson_level_display}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-800">
                            {item.progress_percent}%
                          </span>
                          <button
                            onClick={()=>navigate(`/courses/${item.course_title}/${item.lesson_level_display}/${item.lesson_name}`)}
                            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
                          >
                            Resume
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                          style={{ width: `${Math.min(Math.max(item.progress_percent, 0), 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No active lessons to continue yet.</p>
                )}
              </div>
            </section>

            <section className="flex-1 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-gray-700 text-xl font-semibold mb-4">Explore More</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-gray-50 p-4">
                {exploreMore.length ? (
                  exploreMore.map((item) => (
                    <LessonCard
                      key={item.id}
                      cardLable={item.course}
                      cardCourseName={item.name}
                      cardLevel={item.level_display}
                      cardLesson={item.name}
                      cardQuestionsTotal={item.questions_count}
                      cardQuestionsAnswered={0}
                      started={false}
                      width="w-full"
                      height=""
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No additional lessons recommended yet.</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};